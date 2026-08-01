import { Link } from 'react-router-dom';
import PortalLayout from './PortalLayout';
import { usePortalCustomer, usePortalShipments, usePortalInvoices } from '@/hooks/usePortal';
import { KPICard } from '@/components/dashboardV2/KPICard';
import { WelcomeHero, QuickActionsPanel, DataTableCard, AIInsightsWidget } from '@/components/dashboardV2/Widgets';
import { Button } from '@/components/ui/button';
import { Package, FileText, Receipt, Plus } from 'lucide-react';

export default function Dashboard() {
  const { data: customer } = usePortalCustomer();
  const { data: shipments = [] } = usePortalShipments(customer?.id);
  const { data: invoices = [] } = usePortalInvoices(customer?.id);

  const active = shipments.filter((s: any) => !['delivered', 'cancelled'].includes(s.status)).length;
  const dueInvoices = invoices.filter((i: any) => i.status === 'issued' || i.status === 'overdue').length;

  return (
    <PortalLayout>
      <WelcomeHero
        name={customer?.contact_person || customer?.name || 'Customer'}
        subtitle={customer?.name ? `${customer.name} · Here's an overview of your shipments and invoices.` : 'Track shipments, invoices, and requests in one place.'}
      />

      <div className="mb-6 flex justify-end">
        <Link to="/portal/quotation">
          <Button><Plus className="mr-1.5 h-4 w-4" /> Request Quotation</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard label="Active Shipments" value={active} icon={Package} color="hsl(1 58% 27%)" />
        <KPICard label="Total Shipments" value={shipments.length} icon={FileText} color="hsl(36 89% 53%)" />
        <KPICard label="Invoices Due" value={dueInvoices} icon={Receipt} color="hsl(1 58% 40%)" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataTableCard
            title="Recent Shipments"
            columns={['Shipment', 'Route', 'Status']}
            rows={shipments.slice(0, 5).map((s: any) => [s.shipment_id, `${s.origin} → ${s.destination}`, s.status])}
          />
        </div>
        <QuickActionsPanel
          actions={[
            { label: 'Request Quotation', key: 'booking' },
            { label: 'Track Shipment', key: 'track' },
          ]}
        />
      </div>

      <div className="mt-6">
        <AIInsightsWidget
          insights={[
            shipments.length > 0 ? `You have ${active} shipment(s) currently in progress.` : 'No active shipments right now — request a quotation to get started.',
            dueInvoices > 0 ? `${dueInvoices} invoice(s) awaiting payment.` : 'All invoices are settled.',
          ]}
        />
      </div>
    </PortalLayout>
  );
}
