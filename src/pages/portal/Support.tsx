import { useState } from 'react';
import PortalLayout from './PortalLayout';
import { usePortalCustomer, usePortalTickets } from '@/hooks/usePortal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';

export default function Support() {
  const { data: customer } = usePortalCustomer();
  const { data: tickets = [], raiseTicket } = usePortalTickets(customer?.id);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    raiseTicket({ subject, message });
    setSubject('');
    setMessage('');
  };

  return (
    <PortalLayout>
      <h1 className="mb-6 text-2xl font-bold">Support</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Raise a Ticket</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Input required value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Message</Label>
                <Textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">Submit Ticket</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>My Tickets</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {tickets.length === 0 && <p className="text-sm text-muted-foreground">No support tickets yet.</p>}
            {tickets.map((t: any) => (
              <div key={t.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <p className="font-semibold">{t.subject}</p>
                  </div>
                  <Badge variant="outline">{t.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{t.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
