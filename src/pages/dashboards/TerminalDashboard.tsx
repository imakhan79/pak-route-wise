import { DashboardShell } from '@/components/dashboardV2/DashboardShell';
import { KPICard } from '@/components/dashboardV2/KPICard';
import { WelcomeHero, DataTableCard, CustomerGrowthBar } from '@/components/dashboardV2/Widgets';
import { useAuth } from '@/contexts/AuthContext';
import { PackageOpen, PackageCheck, Warehouse, ListChecks } from 'lucide-react';

const QUEUE_DATA = [
  { name: 'Mon', value: 12 }, { name: 'Tue', value: 18 }, { name: 'Wed', value: 9 },
  { name: 'Thu', value: 22 }, { name: 'Fri', value: 15 },
];

export default function TerminalDashboard() {
  const { currentUser } = useAuth();

  return (
    <DashboardShell roleName="Terminal">
      <WelcomeHero name={currentUser?.fullName || 'Terminal'} subtitle="Container yard, storage, and dispatch queue." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KPICard label="Incoming Containers" value={14} icon={PackageOpen} trend={6} color="hsl(1 58% 27%)" />
        <KPICard label="Outgoing Containers" value={9} icon={PackageCheck} trend={3} color="hsl(36 89% 53%)" />
        <KPICard label="Storage Capacity" value={78} suffix="%" icon={Warehouse} color="hsl(1 58% 40%)" />
        <KPICard label="Loading Queue" value={5} icon={ListChecks} color="hsl(217 91% 55%)" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><CustomerGrowthBar data={QUEUE_DATA} /></div>
        <DataTableCard
          title="Gate Passes"
          columns={['Container', 'Status']}
          rows={[
            ['TCLU9982341', 'issued'],
            ['MSCU7712345', 'pending'],
          ]}
        />
      </div>

      <div className="mt-6">
        <DataTableCard
          title="Warehouse Utilization"
          columns={['Zone', 'Capacity', 'Occupied', 'Status']}
          rows={[
            ['Zone A', '500 TEU', '390 TEU', 'active'],
            ['Zone B', '300 TEU', '210 TEU', 'active'],
            ['Zone C (Bonded)', '150 TEU', '145 TEU', 'near-full'],
          ]}
        />
      </div>
    </DashboardShell>
  );
}
