import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocationTracker } from '@/hooks/useLocationTracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Truck,
  Gauge,
  Compass,
  Crosshair,
  Mountain,
  BatteryFull,
  Wifi,
  WifiOff,
  Play,
  Square,
  AlertTriangle,
  Loader2,
  CloudOff,
} from 'lucide-react';

function StatTile({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3 flex flex-col items-center justify-center text-center gap-1">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-lg font-bold leading-none">{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
    </div>
  );
}

export default function DriverTracker() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['tracking-vehicle', vehicleId],
    enabled: !!vehicleId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id, registration_number, tracking_token')
        .eq('id', vehicleId)
        .single();
      if (error) return null;
      return data;
    },
  });

  const { stats, isTracking, start, stop, intervalSeconds, setIntervalSeconds, minIntervalSeconds, maxIntervalSeconds } =
    useLocationTracker(vehicleId ?? '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const tokenValid = vehicle && (!vehicle.tracking_token || vehicle.tracking_token === token);

  if (!vehicle || !tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
        <Card className="max-w-sm w-full">
          <CardContent className="pt-6 text-center space-y-3">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
            <p className="font-semibold">Invalid tracking link</p>
            <p className="text-sm text-muted-foreground">
              This link is missing or doesn't match a known vehicle. Ask your dispatcher for a new one.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <div className="flex-1 flex items-start justify-center p-4 pt-8">
        <div className="w-full max-w-sm space-y-4">
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-mono text-xl">{vehicle.registration_number}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    isTracking
                      ? 'bg-green-500/10 text-green-600 border-0'
                      : 'bg-gray-500/10 text-gray-500 border-0'
                  }
                >
                  {isTracking ? 'Tracking active' : 'Tracking stopped'}
                </Badge>
                <Badge variant="outline" className={stats.isOnline ? 'border-0 bg-blue-500/10 text-blue-600' : 'border-0 bg-red-500/10 text-red-600'}>
                  {stats.isOnline ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                  {stats.isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>

              {!isTracking && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Update interval</span>
                    <span>{intervalSeconds}s</span>
                  </div>
                  <Slider
                    min={minIntervalSeconds}
                    max={maxIntervalSeconds}
                    step={1}
                    value={[intervalSeconds]}
                    onValueChange={([v]) => setIntervalSeconds(v)}
                  />
                </div>
              )}

              <Button
                onClick={isTracking ? stop : start}
                className="w-full h-12 text-base"
                variant={isTracking ? 'destructive' : 'default'}
              >
                {isTracking ? (
                  <>
                    <Square className="mr-2 h-4 w-4" /> Stop Tracking
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Start Tracking
                  </>
                )}
              </Button>

              {stats.errorMessage && (
                <p className="text-xs text-destructive text-center">{stats.errorMessage}</p>
              )}

              {isTracking && !stats.pageVisible && (
                <p className="text-xs text-amber-600 text-center flex items-center justify-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Tracking paused — this tab is in the background.
                </p>
              )}

              {stats.queuedCount > 0 && (
                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                  <CloudOff className="h-3 w-3" /> {stats.queuedCount} update{stats.queuedCount === 1 ? '' : 's'} waiting to sync
                </p>
              )}
            </CardContent>
          </Card>

          {isTracking && (
            <div className="grid grid-cols-3 gap-2">
              <StatTile icon={Gauge} label="Speed" value={stats.speedKmh != null ? `${stats.speedKmh}` : '—'} />
              <StatTile icon={Compass} label="Heading" value={stats.headingDeg != null ? `${stats.headingDeg}°` : '—'} />
              <StatTile icon={Crosshair} label="Accuracy" value={stats.accuracyM != null ? `±${stats.accuracyM}m` : '—'} />
              <StatTile icon={Mountain} label="Altitude" value={stats.altitudeM != null ? `${stats.altitudeM}m` : '—'} />
              <StatTile icon={BatteryFull} label="Battery" value={stats.batteryLevel != null ? `${stats.batteryLevel}%` : 'N/A'} />
              <StatTile
                icon={Wifi}
                label="Last sent"
                value={stats.lastSentAt ? stats.lastSentAt.toLocaleTimeString() : '—'}
              />
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center px-4">
            Keep this tab open and your screen on while driving for continuous updates. Location is shared
            only while tracking is active.
          </p>
        </div>
      </div>
    </div>
  );
}
