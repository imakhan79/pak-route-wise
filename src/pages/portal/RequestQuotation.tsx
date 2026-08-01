import { useState } from 'react';
import PortalLayout from './PortalLayout';
import { usePortalCustomer, usePortalQuotations } from '@/hooks/usePortal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function RequestQuotation() {
  const { data: customer } = usePortalCustomer();
  const { data: quotations = [], requestQuotation } = usePortalQuotations(customer?.id);
  const [form, setForm] = useState({ origin: '', destination: '', mode: 'road', commodity: '', weight: '', notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestQuotation({
      origin: form.origin,
      destination: form.destination,
      mode: form.mode,
      commodity: form.commodity,
      weight: form.weight ? parseFloat(form.weight) : undefined,
      notes: form.notes,
    });
    setForm({ origin: '', destination: '', mode: 'road', commodity: '', weight: '', notes: '' });
  };

  return (
    <PortalLayout>
      <h1 className="mb-6 text-2xl font-bold">Request a Quotation</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>New Request</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label>Origin</Label>
                <Input required value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Destination</Label>
                <Input required value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Mode</Label>
                <Select value={form.mode} onValueChange={(v) => setForm({ ...form, mode: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="road">Road</SelectItem>
                    <SelectItem value="sea">Sea</SelectItem>
                    <SelectItem value="air">Air</SelectItem>
                    <SelectItem value="rail">Rail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Commodity</Label>
                <Input value={form.commodity} onChange={(e) => setForm({ ...form, commodity: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Weight (kg)</Label>
                <Input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Notes</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <Button type="submit" className="w-full">Submit Request</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>My Requests</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Commodity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No requests yet.</TableCell></TableRow>
                ) : (
                  quotations.map((q: any) => (
                    <TableRow key={q.id}>
                      <TableCell>{q.origin} → {q.destination}</TableCell>
                      <TableCell className="capitalize">{q.mode}</TableCell>
                      <TableCell>{q.commodity || '—'}</TableCell>
                      <TableCell><Badge variant="outline">{q.status}</Badge></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
