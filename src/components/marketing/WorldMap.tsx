import { MapContainer, TileLayer, Polyline, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Reveal } from './Reveal';

const PORTS: { name: string; pos: [number, number] }[] = [
  { name: 'Karachi', pos: [24.86, 67.0] },
  { name: 'Dubai', pos: [25.2, 55.27] },
  { name: 'Singapore', pos: [1.35, 103.82] },
  { name: 'Shanghai', pos: [31.23, 121.47] },
  { name: 'Rotterdam', pos: [51.92, 4.48] },
  { name: 'Los Angeles', pos: [33.74, -118.27] },
];

const ROUTES: [number, number][][] = [
  [PORTS[0].pos, PORTS[1].pos],
  [PORTS[1].pos, PORTS[2].pos],
  [PORTS[2].pos, PORTS[3].pos],
  [PORTS[0].pos, PORTS[4].pos],
  [PORTS[4].pos, PORTS[5].pos],
  [PORTS[0].pos, PORTS[2].pos],
];

function portIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:14px;height:14px;">
      <div style="position:absolute;inset:0;border-radius:9999px;background:hsl(36 89% 53% / 0.35);animation:mapPulse 2.4s ease-out infinite;"></div>
      <div style="position:absolute;inset:4px;border-radius:9999px;background:hsl(36 89% 53%);box-shadow:0 0 8px hsl(36 89% 53%);"></div>
    </div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export function WorldMap() {
  return (
    <section id="coverage" className="relative bg-[hsl(1,20%,8%)] py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">A network spanning the globe.</h2>
          <p className="mt-4 text-white/50">Live shipment routes, ports, and distribution centers - always in view.</p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-14 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <div className="h-[480px] w-full">
              <MapContainer
                center={[20, 40]}
                zoom={2}
                scrollWheelZoom={false}
                zoomControl={false}
                dragging={false}
                doubleClickZoom={false}
                style={{ height: '100%', width: '100%', background: 'hsl(1 20% 8%)' }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; OpenStreetMap &copy; CARTO'
                />
                {ROUTES.map((route, i) => (
                  <Polyline
                    key={i}
                    positions={route}
                    pathOptions={{
                      color: 'hsl(36 89% 53%)',
                      weight: 1.5,
                      opacity: 0.55,
                      dashArray: '6 8',
                      className: 'route-flow',
                    }}
                  />
                ))}
                {PORTS.map((port) => (
                  <Marker key={port.name} position={port.pos} icon={portIcon()}>
                    <Tooltip direction="top" offset={[0, -8]}>
                      {port.name}
                    </Tooltip>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
