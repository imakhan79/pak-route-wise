import { DashboardShell } from '@/components/dashboardV2/DashboardShell';
import { KPICard } from '@/components/dashboardV2/KPICard';
import { WelcomeHero, ShipmentStatusPie, DataTableCard, TaskWidget } from '@/components/dashboardV2/Widgets';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Calculator, FileWarning, CheckCircle2 } from 'lucide-react';

export default function ClearingAgentDashboard() {
  const { currentUser } = useAuth();

  return (
    <DashboardShell roleName="Clearing Agent">
      <WelcomeHero name={currentUser?.fullName || 'Clearing Agent'} subtitle="Customs clearance status and duty calculations." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KPICard label="Pending Clearance" value={5} icon={ShieldCheck} color="hsl(1 58% 27%)" />
        <KPICard label="Duty Calculations" value={8} icon={Calculator} color="hsl(36 89% 53%)" />
        <KPICard label="Released Shipments" value={22} icon={CheckCircle2} trend={14} color="hsl(142 71% 40%)" />
        <KPICard label="Rejected Documents" value={1} icon={FileWarning} color="hsl(1 58% 40%)" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataTableCard
            title="Customs Status"
            columns={['GD Number', 'Shipment', 'HS Code', 'Status']}
            rows={[
              ['GD-2026-00145', 'TRK-2026-001', '520811', 'pending'],
              ['GD-2026-00146', 'TRK-2026-004', '080232', 'rejected'],
              ['GD-2026-00147', 'TRK-2026-005', '251611', 'cleared'],
            ]}
          />
        </div>
        <ShipmentStatusPie data={[{ name: 'Cleared', value: 22 }, { name: 'Pending', value: 5 }, { name: 'Rejected', value: 1 }]} />
      </div>

      <div className="mt-6">
        <TaskWidget tasks={[{ label: 'Submit customs declaration - GD-2026-00145', done: false }, { label: 'Calculate duty - TRK-2026-004', done: true }, { label: 'Notify manager of clearance delay', done: false }]} />
      </div>
    </DashboardShell>
  );
}
