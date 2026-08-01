import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Gauge, WifiOff, Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useVehicles } from '@/hooks/useVehicles';
import { useVehicleLocations, VehicleLiveState } from '@/hooks/useVehicleLocations';
import { VehicleMarker, vehicleStatus, VehicleStatus } from '@/components/tracking/VehicleMarker';

const DEFAULT_CENTER: [number, number] = [30.3753, 69.3451]; // Pakistan, fallback when nothing is reporting yet
const DEFAULT_ZOOM = 6;

const STATUS_LABEL: Record<VehicleStatus, string> = {
  moving: 'Moving',
  idle: 'Idle',
  stale: 'Offline',
};

const STATUS_BADGE_CLASS: Record<VehicleStatus, string> = {
  moving: 'bg-green-500/10 text-green-600 hover:bg-green-500/20',
  idle: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20',
  stale: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20',
};

function MapController({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, Math.max(map.getZoom(), 13), { duration: 1 });
  }, [target, map]);
  return null;
}

export default function GPSTracking() {
  const { vehicles: fleet } = useVehicles();
  const { vehicles: liveStates, isLoading } = useVehicleLocations();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const liveByVehicleId = useMemo(
    () => new Map(liveStates.map((v) => [v.vehicleId, v] as const)),
    [liveStates]
  );

  const rows = useMemo(
    () =>
      fleet
        .map((vehicle) => ({ vehicle, live: liveByVehicleId.get(vehicle.id) ?? null }))
        .filter(({ vehicle }) => vehicle.registration_number.toLowerCase().includes(searchTerm.toLowerCase())),
    [fleet, liveByVehicleId, searchTerm]
  );

  const counts = useMemo(() => {
    let moving = 0, idle = 0, offline = 0;
    for (const { live } of rows) {
      if (!live) offline++;
      else if (live.isStale) offline++;
      else if (live.isIdle) idle++;
      else moving++;
    }
    return { moving, idle, offline };
  }, [rows]);

  const selected = selectedVehicleId ? liveByVehicleId.get(selectedVehicleId) ?? null : null;
  const target: [number, number] | null = selected ? [selected.latest.latitude, selected.latest.longitude] : null;

  const copyTrackingLink = (vehicleId: string, token: string | null) => {
    const url = `${window.location.origin}/track/${vehicleId}${token ? `?token=${token}` : ''}`;
    navigator.clipboard.writeText(url);
    toast.success('Tracking link copied');
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Live GPS Tracking</h1>
        <p className="text-muted-foreground">Real-time truck locations reported from drivers' phones.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moving</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.moving}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Idle</CardTitle>
            <div className="h-2 w-2 rounded-full bg-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.idle}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline / No Signal</CardTitle>
            <WifiOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.offline}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Fleet</CardTitle>
              <div className="relative w-40">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search reg..."
                  className="pl-8 h-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[560px] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Loading fleet data...</div>
            ) : rows.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No vehicles found.</div>
            ) : (
              rows.map(({ vehicle, live }) => {
                const status: VehicleStatus = live ? vehicleStatus(live) : 'stale';
                return (
                  <div
                    key={vehicle.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => live && setSelectedVehicleId(vehicle.id)}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && live) setSelectedVehicleId(vehicle.id);
                    }}
                    className={cn(
                      'w-full text-left rounded-lg border p-3 transition-colors',
                      selectedVehicleId === vehicle.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50',
                      !live && 'opacity-60 cursor-default'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-sm">{vehicle.registration_number}</span>
                      <Badge variant="outline" className={cn(STATUS_BADGE_CLASS[status], 'border-0 text-[10px]')}>
                        {STATUS_LABEL[status]}
                      </Badge>
                    </div>
                    {live ? (
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Gauge className="h-3 w-3" /> {live.latest.speed_kmh != null ? `${live.latest.speed_kmh} km/h` : '—'}
                        </span>
                        <span>Updated {formatDistanceToNow(new Date(live.latest.recorded_at), { addSuffix: true })}</span>
                      </div>
                    ) : (
                      <div className="mt-1 text-xs text-muted-foreground">No location reported yet</div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyTrackingLink(vehicle.id, vehicle.tracking_token ?? null);
                      }}
                      className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Copy className="h-3 w-3" /> Copy tracking link
                    </button>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-md overflow-hidden">
          <div className="h-[600px] w-full">
            <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController target={target} />
              {liveStates.map((live) => {
                const vehicle = fleet.find((v) => v.id === live.vehicleId);
                if (!vehicle) return null;
                return (
                  <VehicleMarker
                    key={live.vehicleId}
                    vehicle={live}
                    registrationNumber={vehicle.registration_number}
                    isSelected={selectedVehicleId === live.vehicleId}
                    onClick={() => setSelectedVehicleId(live.vehicleId)}
                  />
                );
              })}
              {selected && selected.history.length > 1 && (
                <Polyline
                  positions={selected.history.map((p) => [p.latitude, p.longitude])}
                  pathOptions={{ color: '#3b82f6', weight: 3, opacity: 0.6 }}
                />
              )}
            </MapContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
