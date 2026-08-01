import { DashboardShell } from '@/components/dashboardV2/DashboardShell';
import { KPICard } from '@/components/dashboardV2/KPICard';
import {
  WelcomeHero, RevenueTrendChart, ShipmentStatusPie, PerformanceRadar,
  ActivityFeedWidget, QuickActionsPanel, DataTableCard, TaskWidget,
} from '@/components/dashboardV2/Widgets';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useAuth } from '@/contexts/AuthContext';
import { ClipboardCheck, Package, DollarSign, ShieldAlert, Truck } from 'lucide-react';

const REVENUE_DATA = [
  { name: 'Mon', value: 18 }, { name: 'Tue', value: 24 }, { name: 'Wed', value: 20 },
  { name: 'Thu', value: 29 }, { name: 'Fri', value: 33 }, { name: 'Sat', value: 22 }, { name: 'Sun', value: 15 },
];
const PERFORMANCE_DATA = [
  { metric: 'On-Time', value: 90 }, { metric: 'Approvals', value: 82 }, { metric: 'Quality', value: 88 },
  { metric: 'Cost', value: 75 }, { metric: 'Response', value: 91 },
];

export default function ManagerDashboard() {
  const { currentUser } = useAuth();
  const { data: stats } = useAdminStats();

  return (
    <DashboardShell roleName="Manager">
      <WelcomeHero name={currentUser?.fullName || 'Manager'} subtitle="Today's operations, approvals, and performance at a glance." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        <KPICard label="Today's Operations" value={stats?.totalShipments || 0} icon={Package} trend={6} color="hsl(1 58% 27%)" />
        <KPICard label="Pending Approvals" value={4} icon={ClipboardCheck} trend={-2} color="hsl(36 89% 53%)" />
        <KPICard label="Revenue (Month)" value={stats?.revenueMonth || 0} prefix="PKR " icon={DollarSign} trend={9} color="hsl(142 71% 40%)" />
        <KPICard label="Pending Customs" value={1} icon={ShieldAlert} color="hsl(1 58% 40%)" />
        <KPICard label="Pending Delivery" value={stats?.pendingShipments || 0} icon={Truck} color="hsl(217 91% 55%)" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RevenueTrendChart data={REVENUE_DATA} />
        <ShipmentStatusPie data={stats?.statusBreakdown || []} />
        <PerformanceRadar data={PERFORMANCE_DATA} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataTableCard
            title="Pending Approvals"
            columns={['Item', 'Requested By', 'Type', 'Status']}
            rows={[
              ['TRK-2026-001', 'Shipping Agent', 'Booking', 'pending'],
              ['GD-2026-00146', 'Clearing Agent', 'Customs', 'pending'],
              ['INV-00088', 'Finance', 'Invoice', 'pending'],
            ]}
          />
        </div>
        <TaskWidget tasks={[{ label: 'Approve pending bookings', done: false }, { label: 'Review carrier assignment', done: true }, { label: 'Sign off customs release', done: false }]} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityFeedWidget
            items={[
              { type: 'approval', text: 'You approved booking TRK-2026-002', time: '10m ago' },
              { type: 'booking', text: 'Shipping Agent created TRK-2026-009', time: '40m ago' },
              { type: 'invoice', text: 'Finance issued INV-00218', time: '2h ago' },
            ]}
          />
        </div>
        <QuickActionsPanel
          actions={[
            { label: 'Assign Shipping Agent', key: 'agent' },
            { label: 'Assign Clearing Agent', key: 'agent' },
            { label: 'Assign Carrier', key: 'carrier' },
            { label: 'Assign Terminal', key: 'terminal' },
          ]}
        />
      </div>
    </DashboardShell>
  );
}
