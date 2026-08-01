import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { haversineKm, isIdle as computeIsIdle } from '@/lib/geo';

export interface VehiclePing {
  id: string;
  vehicle_id: string;
  latitude: number;
  longitude: number;
  speed_kmh: number | null;
  heading: number | null;
  accuracy_m: number | null;
  altitude_m: number | null;
  battery_level: number | null;
  connection_status: string | null;
  engine_status: string | null;
  recorded_at: string;
  created_at: string | null;
}

export interface VehicleLiveState {
  vehicleId: string;
  latest: VehiclePing;
  history: VehiclePing[];
  /** Distance covered since this dashboard session started watching this vehicle - not a full trip odometer. */
  sessionDistanceKm: number;
  isIdle: boolean;
  /** No ping received in over STALE_THRESHOLD_MS - likely offline or tab closed. */
  isStale: boolean;
}

const STALE_THRESHOLD_MS = 2 * 60 * 1000;
const HISTORY_LIMIT_PER_VEHICLE = 200;
const LATEST_LOCATIONS_KEY = ['vehicle-latest-locations'];

export function useVehicleLocations() {
  const queryClient = useQueryClient();
  const [historyMap, setHistoryMap] = useState<Map<string, VehiclePing[]>>(new Map());
  const [staleTick, setStaleTick] = useState(0);

  const { data: latestList = [], isLoading } = useQuery({
    queryKey: LATEST_LOCATIONS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from('vehicle_latest_locations').select('*');
      if (error) {
        console.error('Fetch vehicle locations error:', error);
        toast.error('Failed to load vehicle locations');
        return [];
      }
      return data as VehiclePing[];
    },
  });

  // Seed history with whatever the initial fetch returned, without clobbering
  // points already accumulated live for a vehicle.
  useEffect(() => {
    setHistoryMap((prev) => {
      const next = new Map(prev);
      let changed = false;
      for (const ping of latestList) {
        if (!next.has(ping.vehicle_id)) {
          next.set(ping.vehicle_id, [ping]);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [latestList]);

  useEffect(() => {
    const channel = supabase
      .channel('vehicle-locations-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'vehicle_locations' },
        (payload) => {
          const ping = payload.new as VehiclePing;

          queryClient.setQueryData<VehiclePing[]>(LATEST_LOCATIONS_KEY, (old = []) => {
            const idx = old.findIndex((p) => p.vehicle_id === ping.vehicle_id);
            if (idx === -1) return [...old, ping];
            if (new Date(ping.recorded_at) < new Date(old[idx].recorded_at)) return old;
            const copy = [...old];
            copy[idx] = ping;
            return copy;
          });

          setHistoryMap((prev) => {
            const next = new Map(prev);
            const arr = next.get(ping.vehicle_id) ?? [];
            next.set(ping.vehicle_id, [...arr, ping].slice(-HISTORY_LIMIT_PER_VEHICLE));
            return next;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Re-derive "stale" periodically even without new pings arriving.
  useEffect(() => {
    const id = setInterval(() => setStaleTick((t) => t + 1), 15_000);
    return () => clearInterval(id);
  }, []);

  const vehicles: VehicleLiveState[] = useMemo(() => {
    return latestList.map((latest) => {
      const history = historyMap.get(latest.vehicle_id) ?? [latest];
      let sessionDistanceKm = 0;
      for (let i = 1; i < history.length; i++) {
        sessionDistanceKm += haversineKm(history[i - 1], history[i]);
      }
      const staleMs = Date.now() - new Date(latest.recorded_at).getTime();

      return {
        vehicleId: latest.vehicle_id,
        latest,
        history,
        sessionDistanceKm,
        isIdle: computeIsIdle(latest.speed_kmh),
        isStale: staleMs > STALE_THRESHOLD_MS,
      };
    });
  }, [latestList, historyMap, staleTick]);

  return { vehicles, isLoading };
}
