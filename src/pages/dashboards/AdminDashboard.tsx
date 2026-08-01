import { DashboardShell } from '@/components/dashboardV2/DashboardShell';
import { KPICard } from '@/components/dashboardV2/KPICard';
import { LiveMapWidget } from '@/components/dashboardV2/LiveMapWidget';
import {
  WelcomeHero, RevenueTrendChart, ShipmentStatusPie, BookingTrendLine, CustomerGrowthBar,
  PerformanceRadar, DemandHeatmap, ActivityFeedWidget, QuickActionsPanel, AIInsightsWidget,
  DataTableCard, MiniCalendarWidget, TaskWidget, FilesWidget, ChatWidget, SystemHealthWidget,
} from '@/components/dashboardV2/Widgets';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useAuth } from '@/contexts/AuthContext';
import {
  DollarSign, Package, CheckCircle2, Container, Users, ClipboardList, Receipt,
  CreditCard, Building2, Truck, UserCog, ShieldCheck, UserCheck, Wifi,
} from 'lucide-react';

const REVENUE_DATA = [
  { name: 'Jan', value: 32 }, { name: 'Feb', value: 41 }, { name: 'Mar', value: 38 },
  { name: 'Apr', value: 52 }, { name: 'May', value: 49 }, { name: 'Jun', value: 61 }, { name: 'Jul', value: 58 },
];
const BOOKING_DATA = [
  { name: 'W1', value: 24 }, { name: 'W2', value: 32 }, { name: 'W3', value: 28 }, { name: 'W4', value: 40 },
];
const CUSTOMER_GROWTH = [
  { name: 'Q1', value: 12 }, { name: 'Q2', value: 19 }, { name: 'Q3', value: 27 }, { name: 'Q4', value: 34 },
];
const PERFORMANCE_DATA = [
  { metric: 'On-Time', value: 92 }, { metric: 'Cost', value: 78 }, { metric: 'Safety', value: 95 },
  { metric: 'Speed', value: 84 }, { metric: 'Comms', value: 88 },
];

export default function AdminDashboard() {
  const { currentUser, users, roles } = useAuth();
  const { data: stats } = useAdminStats();

  const roleCount = (name: string) => users.filter((u) => roles.find((r) => r.id === u.roleId)?.name === name).length;

  return (
    <DashboardShell roleName="Administrator">
      <WelcomeHero name={currentUser?.fullName || 'Administrator'} subtitle="Here's what's happening across your logistics network today." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <KPICard label="Today's Revenue" value={stats?.revenueToday || 0} prefix="PKR " icon={DollarSign} trend={12} color="hsl(1 58% 27%)" />
        <KPICard label="Monthly Revenue" value={stats?.revenueMonth || 0} prefix="PKR " icon={DollarSign} trend={8} color="hsl(36 89% 53%)" />
        <KPICard label="Pending Shipments" value={stats?.pendingShipments || 0} icon={Package} trend={-3} color="hsl(1 58% 40%)" />
        <KPICard label="Completed Shipments" value={stats?.completedShipments || 0} icon={CheckCircle2} trend={15} color="hsl(142 71% 40%)" />
        <KPICard label="Containers" value={stats?.containers || 0} icon={Container} trend={5} color="hsl(217 91% 55%)" />
        <KPICard label="Customers" value={stats?.totalCustomers || 0} icon={Users} trend={9} color="hsl(1 58% 27%)" />
        <KPICard label="Bookings" value={stats?.totalShipments || 0} icon={ClipboardList} trend={7} color="hsl(36 89% 53%)" />
        <KPICard label="Invoices" value={stats?.totalInvoices || 0} icon={Receipt} trend={4} color="hsl(1 58% 40%)" />
        <KPICard label="Payments" value={stats?.paymentsReceived || 0} icon={CreditCard} trend={11} color="hsl(142 71% 40%)" />
        <KPICard label="Terminals" value={roleCount('Terminal')} icon={Building2} color="hsl(217 91% 55%)" />
        <KPICard label="Carriers" value={roleCount('Carrier')} icon={Truck} color="hsl(1 58% 27%)" />
        <KPICard label="Shipping Agents" value={roleCount('Shipping Agent')} icon={UserCog} color="hsl(36 89% 53%)" />
        <KPICard label="Clearing Agents" value={roleCount('Clearing Agent')} icon={ShieldCheck} color="hsl(1 58% 40%)" />
        <KPICard label="Managers" value={roleCount('Manager')} icon={UserCheck} color="hsl(142 71% 40%)" />
        <KPICard label="Registered Users" value={users.length} icon={Wifi} color="hsl(217 91% 55%)" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RevenueTrendChart data={REVENUE_DATA} />
        <ShipmentStatusPie data={stats?.statusBreakdown || []} />
        <BookingTrendLine data={BOOKING_DATA} />
        <CustomerGrowthBar data={CUSTOMER_GROWTH} />
        <PerformanceRadar data={PERFORMANCE_DATA} />
        <DemandHeatmap />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><LiveMapWidget title="Live Shipments & Fleet" /></div>
        <ActivityFeedWidget
          items={[
            { type: 'booking', text: 'New booking TRK-2026-009 created', time: '3m ago' },
            { type: 'delivered', text: 'Shipment TRK-2026-006 delivered', time: '25m ago' },
            { type: 'payment', text: 'Payment received - INV-00212', time: '1h ago' },
            { type: 'customer', text: 'New customer: Meridian Trading Co.', time: '2h ago' },
            { type: 'approval', text: 'GD-2026-00145 approved by clearing agent', time: '4h ago' },
          ]}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <DataTableCard
            title="Recent Bookings"
            columns={['Booking', 'Customer', 'Route', 'Status']}
            rows={[
              ['TRK-2026-001', 'Al-Falah Trading', 'Karachi → Lahore', 'pending'],
              ['TRK-2026-003', 'Punjab Agro Exports', 'Lahore → Torkham', 'in_transit'],
              ['TRK-2026-005', 'Balochistan Minerals', 'Gwadar → Quetta', 'cleared'],
              ['TRK-2026-006', 'National Logistics', 'Karachi → Multan', 'delivered'],
            ]}
          />
        </div>
        <QuickActionsPanel
          actions={[
            { label: 'Create Shipment', key: 'shipment' },
            { label: 'Create Booking', key: 'booking' },
            { label: 'Add Customer', key: 'customer' },
            { label: 'Generate Invoice', key: 'invoice' },
            { label: 'Track Shipment', key: 'track' },
            { label: 'Assign Carrier', key: 'carrier' },
            { label: 'Assign Terminal', key: 'terminal' },
            { label: 'Assign Agent', key: 'agent' },
          ]}
        />
        <AIInsightsWidget
          insights={[
            'Revenue trending 12% above forecast for Q3.',
            '3 shipments at risk of customs delay - review recommended.',
            'Route KHI-LHR performing 8% faster than average this week.',
            'Carrier utilization is at 87% - consider onboarding 1 more.',
          ]}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
        <MiniCalendarWidget events={[{ day: 5, label: 'Vessel departure - MV Ever Fortune' }, { day: 12, label: 'Customs audit' }, { day: 20, label: 'Quarterly review' }]} />
        <TaskWidget tasks={[{ label: 'Review pending customs holds', done: false }, { label: 'Approve Q3 carrier contracts', done: true }, { label: 'Sign off on new terminal SLA', done: false }]} />
        <FilesWidget files={[{ name: 'BL-2026-0089.pdf', type: 'Bill of Lading', size: '240 KB' }, { name: 'INV-00212.pdf', type: 'Invoice', size: '88 KB' }, { name: 'GD-2026-00145.pdf', type: 'GD Filing', size: '156 KB' }]} />
        <SystemHealthWidget />
      </div>

      <div className="mt-6">
        <ChatWidget
          contacts={[
            { name: 'Operations Manager', role: 'Manager', lastMsg: 'Please review the pending approvals list.', unread: 2 },
            { name: 'Shipping Agent', role: 'Shipping Agent', lastMsg: 'BL uploaded for TRK-2026-007.' },
            { name: 'Carrier Desk', role: 'Carrier', lastMsg: 'Vessel ETA updated to Aug 12.' },
            { name: 'Terminal Ops', role: 'Terminal', lastMsg: 'Container yard at 82% capacity.' },
          ]}
        />
      </div>
    </DashboardShell>
  );
}
