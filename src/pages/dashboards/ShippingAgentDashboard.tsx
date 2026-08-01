import { DashboardShell } from '@/components/dashboardV2/DashboardShell';
import { KPICard } from '@/components/dashboardV2/KPICard';
import { WelcomeHero, BookingTrendLine, DataTableCard, TaskWidget, FilesWidget, QuickActionsPanel } from '@/components/dashboardV2/Widgets';
import { useAuth } from '@/contexts/AuthContext';
import { Package, FileText, Container, Plane } from 'lucide-react';

const BOOKING_DATA = [
  { name: 'Mon', value: 3 }, { name: 'Tue', value: 5 }, { name: 'Wed', value: 4 },
  { name: 'Thu', value: 7 }, { name: 'Fri', value: 6 },
];

export default function ShippingAgentDashboard() {
  const { currentUser } = useAuth();

  return (
    <DashboardShell roleName="Shipping Agent">
      <WelcomeHero name={currentUser?.fullName || 'Shipping Agent'} subtitle="Your bookings, documents, and upcoming departures." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KPICard label="Today's Bookings" value={6} icon={Package} trend={10} color="hsl(1 58% 27%)" />
        <KPICard label="Pending Documents" value={3} icon={FileText} color="hsl(36 89% 53%)" />
        <KPICard label="Container Status" value={12} suffix=" active" icon={Container} color="hsl(217 91% 55%)" />
        <KPICard label="Upcoming Departures" value={4} icon={Plane} color="hsl(142 71% 40%)" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><BookingTrendLine data={BOOKING_DATA} /></div>
        <TaskWidget tasks={[{ label: 'Upload commercial invoice - TRK-2026-002', done: false }, { label: 'Generate BL - TRK-2026-001', done: true }, { label: 'Confirm booking with carrier', done: false }]} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataTableCard
            title="My Shipment Progress"
            columns={['Shipment', 'Route', 'ETD', 'Status']}
            rows={[
              ['TRK-2026-001', 'Karachi → Lahore', '2026-08-02', 'pending'],
              ['TRK-2026-007', 'Karachi → Lahore', '2026-08-09', 'in_transit'],
            ]}
          />
        </div>
        <QuickActionsPanel actions={[{ label: 'Create Booking', key: 'booking' }, { label: 'Generate BL', key: 'invoice' }, { label: 'Track Shipment', key: 'track' }, { label: 'Add Customer', key: 'customer' }]} />
      </div>

      <div className="mt-6">
        <FilesWidget files={[{ name: 'Commercial-Invoice-001.pdf', type: 'Invoice', size: '120 KB' }, { name: 'Packing-List-001.pdf', type: 'Packing List', size: '96 KB' }, { name: 'COO-001.pdf', type: 'Certificate of Origin', size: '64 KB' }]} />
      </div>
    </DashboardShell>
  );
}
