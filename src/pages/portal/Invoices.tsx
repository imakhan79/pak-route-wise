import PortalLayout from './PortalLayout';
import { usePortalCustomer, usePortalInvoices } from '@/hooks/usePortal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function downloadInvoice(invoice: any) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Zicon Technology - Invoice', 14, 18);
  doc.setFontSize(10);
  doc.text(`Invoice ID: ${invoice.id}`, 14, 28);
  doc.text(`Status: ${invoice.status}`, 14, 34);
  doc.text(`Due Date: ${invoice.due_date || '—'}`, 14, 40);
  doc.text(`Amount: PKR ${Number(invoice.amount).toLocaleString()}`, 14, 46);

  const items = Array.isArray(invoice.items_json) ? invoice.items_json : [];
  autoTable(doc, {
    startY: 55,
    head: [['Description', 'Amount (PKR)']],
    body: items.map((i: any) => [i.desc, Number(i.amount).toLocaleString()]),
  });

  doc.save(`invoice-${invoice.id.slice(0, 8)}.pdf`);
}

export default function Invoices() {
  const { data: customer } = usePortalCustomer();
  const { data: invoices = [] } = usePortalInvoices(customer?.id);

  return (
    <PortalLayout>
      <h1 className="mb-6 text-2xl font-bold">Invoices</h1>
      <Card>
        <CardHeader><CardTitle>All Invoices</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No invoices found.</TableCell></TableRow>
              ) : (
                invoices.map((inv: any) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-semibold">PKR {Number(inv.amount).toLocaleString()}</TableCell>
                    <TableCell>{inv.due_date || '—'}</TableCell>
                    <TableCell><Badge variant="outline">{inv.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => downloadInvoice(inv)}>
                        <Download className="mr-1.5 h-3.5 w-3.5" /> PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PortalLayout>
  );
}
