import { Link } from 'react-router-dom';
import PortalLayout from './PortalLayout';
import { usePortalCustomer, usePortalShipments, usePortalInvoices } from '@/hooks/usePortal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {customer?.contact_person || customer?.name || 'Customer'}</h1>
          <p className="text-muted-foreground">{customer?.name}</p>
        </div>
        <Link to="/portal/quotation">
          <Button><Plus className="mr-1.5 h-4 w-4" /> Request Quotation</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{active}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{shipments.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices Due</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{dueInvoices}</div></CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Recent Shipments</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {shipments.length === 0 && <p className="text-sm text-muted-foreground">No shipments yet.</p>}
          {shipments.slice(0, 5).map((s: any) => (
            <Link key={s.id} to={`/portal/shipments/${s.id}`} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50">
              <div>
                <p className="font-mono text-sm font-semibold">{s.shipment_id}</p>
                <p className="text-xs text-muted-foreground">{s.origin} → {s.destination}</p>
              </div>
              <Badge variant="outline">{s.status}</Badge>
            </Link>
          ))}
        </CardContent>
      </Card>
    </PortalLayout>
  );
}
