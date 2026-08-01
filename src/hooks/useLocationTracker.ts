import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { haversineKm, bearingDegrees } from '@/lib/geo';

export interface TrackerStats {
  latitude: number | null;
  longitude: number | null;
  speedKmh: number | null;
  headingDeg: number | null;
  accuracyM: number | null;
  altitudeM: number | null;
  batteryLevel: number | null;
  isCharging: boolean | null;
  isOnline: boolean;
  pageVisible: boolean;
  lastSentAt: Date | null;
  queuedCount: number;
  errorMessage: string | null;
}

interface QueuedPing {
  vehicle_id: string;
  latitude: number;
  longitude: number;
  speed_kmh: number | null;
  heading: number | null;
  accuracy_m: number | null;
  altitude_m: number | null;
  battery_level: number | null;
  connection_status: string;
  recorded_at: string;
}

const MIN_INTERVAL_SECONDS = 5;
const MAX_INTERVAL_SECONDS = 10;
const DEFAULT_INTERVAL_SECONDS = 7;
const MAX_QUEUE_SIZE = 200;
const RETRY_INTERVAL_MS = 30_000;

const initialStats: TrackerStats = {
  latitude: null,
  longitude: null,
  speedKmh: null,
  headingDeg: null,
  accuracyM: null,
  altitudeM: null,
  batteryLevel: null,
  isCharging: null,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  pageVisible: typeof document !== 'undefined' ? document.visibilityState === 'visible' : true,
  lastSentAt: null,
  queuedCount: 0,
  errorMessage: null,
};

function queueKey(vehicleId: string) {
  return `gps-queue-${vehicleId}`;
}

function readQueue(vehicleId: string): QueuedPing[] {
  try {
    const raw = localStorage.getItem(queueKey(vehicleId));
    return raw ? (JSON.parse(raw) as QueuedPing[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(vehicleId: string, queue: QueuedPing[]) {
  try {
    localStorage.setItem(queueKey(vehicleId), JSON.stringify(queue.slice(-MAX_QUEUE_SIZE)));
  } catch {
    // localStorage unavailable (private mode, quota) - queued ping is lost, nothing more we can do
  }
}

export function useLocationTracker(vehicleId: string) {
  const [isTracking, setIsTracking] = useState(false);
  const [intervalSeconds, setIntervalSeconds] = useState(DEFAULT_INTERVAL_SECONDS);
  const [stats, setStats] = useState<TrackerStats>({
    ...initialStats,
    queuedCount: typeof window !== 'undefined' ? readQueue(vehicleId).length : 0,
  });

  const watchIdRef = useRef<number | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const lastSendRef = useRef<number>(0);
  const lastPositionRef = useRef<{ lat: number; lng: number; t: number } | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const batteryRef = useRef<any>(null);
  const intervalSecondsRef = useRef(intervalSeconds);
  intervalSecondsRef.current = intervalSeconds;

  const flushQueue = useCallback(async () => {
    const queue = readQueue(vehicleId);
    if (queue.length === 0) return;

    const { error } = await supabase.from('vehicle_locations').insert(queue);
    if (!error) {
      writeQueue(vehicleId, []);
      setStats((s) => ({ ...s, queuedCount: 0 }));
    }
  }, [vehicleId]);

  const sendPing = useCallback(
    async (ping: QueuedPing) => {
      if (!navigator.onLine) {
        const queue = [...readQueue(vehicleId), ping];
        writeQueue(vehicleId, queue);
        setStats((s) => ({ ...s, queuedCount: queue.length }));
        return;
      }

      const { error } = await supabase.from('vehicle_locations').insert(ping);
      if (error) {
        const queue = [...readQueue(vehicleId), ping];
        writeQueue(vehicleId, queue);
        setStats((s) => ({ ...s, queuedCount: queue.length }));
      } else {
        setStats((s) => ({ ...s, lastSentAt: new Date() }));
        // opportunistically flush anything backed up from earlier failures
        void flushQueue();
      }
    },
    [vehicleId, flushQueue]
  );

  const handlePosition = useCallback(
    (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy, altitude, heading, speed } = position.coords;
      const now = position.timestamp;

      let speedKmh = speed != null ? speed * 3.6 : null;
      let headingDeg = heading;

      const last = lastPositionRef.current;
      if (last) {
        const dtSeconds = (now - last.t) / 1000;
        if (dtSeconds > 0.5) {
          const distanceKm = haversineKm(
            { latitude: last.lat, longitude: last.lng },
            { latitude, longitude }
          );
          if (speedKmh == null) {
            speedKmh = (distanceKm / dtSeconds) * 3600;
          }
          if (headingDeg == null && distanceKm > 0.001) {
            headingDeg = bearingDegrees(
              { latitude: last.lat, longitude: last.lng },
              { latitude, longitude }
            );
          }
        }
      }
      lastPositionRef.current = { lat: latitude, lng: longitude, t: now };

      setStats((s) => ({
        ...s,
        latitude,
        longitude,
        speedKmh: speedKmh != null ? Math.round(speedKmh * 10) / 10 : null,
        headingDeg: headingDeg != null ? Math.round(headingDeg) : null,
        accuracyM: accuracy != null ? Math.round(accuracy) : null,
        altitudeM: altitude != null ? Math.round(altitude) : null,
        errorMessage: null,
      }));

      const elapsedMs = Date.now() - lastSendRef.current;
      if (elapsedMs >= intervalSecondsRef.current * 1000) {
        lastSendRef.current = Date.now();
        void sendPing({
          vehicle_id: vehicleId,
          latitude,
          longitude,
          speed_kmh: speedKmh != null ? Math.round(speedKmh * 10) / 10 : null,
          heading: headingDeg != null ? Math.round(headingDeg) : null,
          accuracy_m: accuracy != null ? Math.round(accuracy) : null,
          altitude_m: altitude != null ? Math.round(altitude) : null,
          battery_level: batteryRef.current?.level != null ? Math.round(batteryRef.current.level * 100) : null,
          connection_status: navigator.onLine ? 'online' : 'offline',
          recorded_at: new Date(now).toISOString(),
        });
      }
    },
    [sendPing, vehicleId]
  );

  const start = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStats((s) => ({ ...s, errorMessage: 'Geolocation is not supported on this device/browser.' }));
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      (err) => setStats((s) => ({ ...s, errorMessage: err.message })),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 20_000 }
    );

    if ('wakeLock' in navigator) {
      (navigator as any).wakeLock
        .request('screen')
        .then((lock: WakeLockSentinel) => {
          wakeLockRef.current = lock;
        })
        .catch(() => {
          // wake lock unsupported/denied - non-fatal, tracking continues without it
        });
    }

    setIsTracking(true);
  }, [handlePosition]);

  const stop = useCallback(() => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    wakeLockRef.current?.release().catch(() => {});
    wakeLockRef.current = null;
    lastPositionRef.current = null;
    setIsTracking(false);
  }, []);

  // Network status + queue flush on reconnect
  useEffect(() => {
    const handleOnline = () => {
      setStats((s) => ({ ...s, isOnline: true }));
      void flushQueue();
    };
    const handleOffline = () => setStats((s) => ({ ...s, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [flushQueue]);

  // Periodic retry in case the 'online' event doesn't fire (flaky mobile networks)
  useEffect(() => {
    retryTimerRef.current = setInterval(() => {
      if (navigator.onLine) void flushQueue();
    }, RETRY_INTERVAL_MS);
    return () => {
      if (retryTimerRef.current) clearInterval(retryTimerRef.current);
    };
  }, [flushQueue]);

  // Page visibility - tracking is throttled/suspended by the browser while hidden;
  // we just reflect that honestly in the UI rather than pretending it still works.
  useEffect(() => {
    const handleVisibility = () => {
      setStats((s) => ({ ...s, pageVisible: document.visibilityState === 'visible' }));
      if (document.visibilityState === 'visible' && isTracking && !wakeLockRef.current && 'wakeLock' in navigator) {
        (navigator as any).wakeLock.request('screen').then((lock: WakeLockSentinel) => {
          wakeLockRef.current = lock;
        }).catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isTracking]);

  // Best-effort battery status (deprecated/unsupported in many browsers - fails silently)
  useEffect(() => {
    const nav = navigator as any;
    if (typeof nav.getBattery !== 'function') return;

    let battery: any;
    nav.getBattery().then((b: any) => {
      battery = b;
      batteryRef.current = b;
      const update = () =>
        setStats((s) => ({ ...s, batteryLevel: Math.round(b.level * 100), isCharging: b.charging }));
      update();
      b.addEventListener('levelchange', update);
      b.addEventListener('chargingchange', update);
    }).catch(() => {});

    return () => {
      batteryRef.current = null;
    };
  }, []);

  // Stop tracking and release the wake lock on unmount
  useEffect(() => () => stop(), [stop]);

  return {
    stats,
    isTracking,
    start,
    stop,
    intervalSeconds,
    setIntervalSeconds: (n: number) =>
      setIntervalSeconds(Math.min(MAX_INTERVAL_SECONDS, Math.max(MIN_INTERVAL_SECONDS, n))),
    minIntervalSeconds: MIN_INTERVAL_SECONDS,
    maxIntervalSeconds: MAX_INTERVAL_SECONDS,
  };
}
