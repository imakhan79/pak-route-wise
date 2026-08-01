import { useEffect, useRef } from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { formatDistanceToNow } from 'date-fns';
import type { VehicleLiveState } from '@/hooks/useVehicleLocations';

const ANIMATION_MS = 1200;

export type VehicleStatus = 'moving' | 'idle' | 'stale';

export function vehicleStatus(vehicle: VehicleLiveState): VehicleStatus {
  if (vehicle.isStale) return 'stale';
  if (vehicle.isIdle) return 'idle';
  return 'moving';
}

const STATUS_COLOR: Record<VehicleStatus, string> = {
  moving: '#22c55e',
  idle: '#f59e0b',
  stale: '#9ca3af',
};

function buildIcon(headingDeg: number | null, status: VehicleStatus) {
  const color = STATUS_COLOR[status];
  const rotation = headingDeg ?? 0;
  const html = `
    <div style="width:34px;height:34px;border-radius:9999px;background:${color}26;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px ${color}55;">
      <div style="transform:rotate(${rotation}deg);width:20px;height:20px;display:flex;align-items:center;justify-content:center;transition:transform 0.3s ease;">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="${color}" stroke="white" stroke-width="1.5">
          <path d="M12 2 L19 21 L12 17 L5 21 Z" />
        </svg>
      </div>
    </div>`;
  return L.divIcon({ html, className: '', iconSize: [34, 34], iconAnchor: [17, 17] });
}

interface VehicleMarkerProps {
  vehicle: VehicleLiveState;
  registrationNumber: string;
  isSelected: boolean;
  onClick: () => void;
}

export function VehicleMarker({ vehicle, registrationNumber, isSelected, onClick }: VehicleMarkerProps) {
  const markerRef = useRef<L.Marker | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const from = marker.getLatLng();
    const to = L.latLng(vehicle.latest.latitude, vehicle.latest.longitude);
    if (from.equals(to)) return;

    if (animFrameRef.current != null) cancelAnimationFrame(animFrameRef.current);
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ANIMATION_MS);
      marker.setLatLng([from.lat + (to.lat - from.lat) * t, from.lng + (to.lng - from.lng) * t]);
      if (t < 1) animFrameRef.current = requestAnimationFrame(step);
    };
    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current != null) cancelAnimationFrame(animFrameRef.current);
    };
  }, [vehicle.latest.latitude, vehicle.latest.longitude]);

  const status = vehicleStatus(vehicle);
  const icon = buildIcon(vehicle.latest.heading, status);

  return (
    <Marker
      ref={markerRef}
      position={[vehicle.latest.latitude, vehicle.latest.longitude]}
      icon={icon}
      eventHandlers={{ click: onClick }}
    >
      {isSelected && (
        <Tooltip direction="top" offset={[0, -18]} permanent>
          {registrationNumber}
        </Tooltip>
      )}
      <Popup>
        <div className="space-y-1 text-sm min-w-[180px]">
          <p className="font-bold">{registrationNumber}</p>
          <p>Speed: {vehicle.latest.speed_kmh != null ? `${vehicle.latest.speed_kmh} km/h` : '—'}</p>
          <p>Heading: {vehicle.latest.heading != null ? `${vehicle.latest.heading}°` : '—'}</p>
          <p>Accuracy: {vehicle.latest.accuracy_m != null ? `±${vehicle.latest.accuracy_m}m` : '—'}</p>
          <p>Altitude: {vehicle.latest.altitude_m != null ? `${vehicle.latest.altitude_m}m` : '—'}</p>
          <p>Battery: {vehicle.latest.battery_level != null ? `${vehicle.latest.battery_level}%` : 'N/A'}</p>
          <p>Connection: {vehicle.latest.connection_status ?? '—'}</p>
          <p>Session distance: {vehicle.sessionDistanceKm.toFixed(1)} km</p>
          <p className="text-muted-foreground">
            Updated {formatDistanceToNow(new Date(vehicle.latest.recorded_at), { addSuffix: true })}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}
