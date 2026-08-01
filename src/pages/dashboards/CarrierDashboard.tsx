import { DashboardShell } from '@/components/dashboardV2/DashboardShell';
import { KPICard } from '@/components/dashboardV2/KPICard';
import { LiveMapWidget } from '@/components/dashboardV2/LiveMapWidget';
import { WelcomeHero, DataTableCard, PerformanceRadar } from '@/components/dashboardV2/Widgets';
import { useAuth } from '@/contexts/AuthContext';
import { useVehicles } from '@/hooks/useVehicles';
import { Truck, Gauge, Fuel, Wrench } from 'lucide-react';

const FLEET_PERFORMANCE = [
  { metric: 'On-Time', value: 88 }, { metric: 'Fuel Eff.', value: 74 }, { metric: 'Safety', value: 96 },
  { metric: 'Utilization', value: 82 }, { metric: 'Maint.', value: 79 },
];

export default function CarrierDashboard() {
  const { currentUser } = useAuth();
  const { vehicles } = useVehicles();

  const inTransit = vehicles.filter((v) => v.status === 'in_transit').length;
  const available = vehicles.filter((v) => v.status === 'available').length;
  const maintenance = vehicles.filter((v) => v.status === 'maintenance').length;

  return (
    <DashboardShell roleName="Carrier">
      <WelcomeHero name={currentUser?.fullName || 'Carrier'} subtitle="Fleet status, routes, and trip progress." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KPICard label="Assigned Shipments" value={inTransit} icon={Truck} color="hsl(1 58% 27%)" />
        <KPICard label="Fleet Utilization" value={vehicles.length ? Math.round(((inTransit + available) / vehicles.length) * 100) : 0} suffix="%" icon={Gauge} color="hsl(36 89% 53%)" />
        <KPICard label="Fuel Consumption" value={1840} suffix=" L" icon={Fuel} color="hsl(217 91% 55%)" />
        <KPICard label="Maintenance Alerts" value={maintenance} icon={Wrench} color="hsl(1 58% 40%)" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><LiveMapWidget title="Route Map & ETA" /></div>
        <PerformanceRadar data={FLEET_PERFORMANCE} />
      </div>

      <div className="mt-6">
        <DataTableCard
          title="Vehicle Status"
          columns={['Registration', 'Type', 'Status', 'Last Update']}
          rows={vehicles.slice(0, 6).map((v) => [v.registration_number, v.type || '—', v.status, 'Today'])}
        />
      </div>
    </DashboardShell>
  );
}
