import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVehicleLocations } from '@/hooks/useVehicleLocations';
import { vehicleStatus } from '@/components/tracking/VehicleMarker';

const DEFAULT_CENTER: [number, number] = [30.3753, 69.3451];

function icon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;border-radius:9999px;background:${color};box-shadow:0 0 0 4px ${color}33;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

const STATUS_COLOR = { moving: '#22c55e', idle: '#f59e0b', stale: '#9ca3af' };

export function LiveMapWidget({ title = 'Live Fleet Map' }: { title?: string }) {
  const { vehicles } = useVehicleLocations();

  return (
    <Card className="rounded-2xl border-black/5 shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">{title}</CardTitle></CardHeader>
      <CardContent className="overflow-hidden rounded-b-2xl p-0">
        <div className="h-[320px] w-full">
          <MapContainer center={DEFAULT_CENTER} zoom={5} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
            {vehicles.map((v) => (
              <Marker key={v.vehicleId} position={[v.latest.latitude, v.latest.longitude]} icon={icon(STATUS_COLOR[vehicleStatus(v)])}>
                <Popup>Speed: {v.latest.speed_kmh ?? '—'} km/h</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
