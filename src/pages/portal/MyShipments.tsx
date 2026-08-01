import { Link } from 'react-router-dom';
import PortalLayout from './PortalLayout';
import { usePortalCustomer, usePortalShipments } from '@/hooks/usePortal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function MyShipments() {
  const { data: customer } = usePortalCustomer();
  const { data: shipments = [], isLoading } = usePortalShipments(customer?.id);

  return (
    <PortalLayout>
      <h1 className="mb-6 text-2xl font-bold">My Shipments</h1>
      <Card>
        <CardHeader><CardTitle>All Shipments</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment ID</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Commodity</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No shipments found.</TableCell></TableRow>
                ) : (
                  shipments.map((s: any) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <Link to={`/portal/shipments/${s.id}`} className="font-mono font-medium text-primary hover:underline">{s.shipment_id}</Link>
                      </TableCell>
                      <TableCell>{s.origin} → {s.destination}</TableCell>
                      <TableCell>{s.commodity || '—'}</TableCell>
                      <TableCell>{s.eta ? new Date(s.eta).toLocaleDateString() : '—'}</TableCell>
                      <TableCell><Badge variant="outline">{s.status}</Badge></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </PortalLayout>
  );
}
