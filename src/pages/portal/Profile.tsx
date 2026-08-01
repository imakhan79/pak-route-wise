import { useState, useEffect } from 'react';
import PortalLayout from './PortalLayout';
import { useAuth } from '@/contexts/AuthContext';
import { usePortalCustomer } from '@/hooks/usePortal';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Profile() {
  const { currentUser } = useAuth();
  const { data: customer } = usePortalCustomer();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', contact_person: '', phone: '', address: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name || '',
        contact_person: customer.contact_person || '',
        phone: customer.phone || '',
        address: customer.address || '',
      });
    }
  }, [customer]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    setSaving(true);
    const { error } = await supabase.from('customers').update(form).eq('id', customer.id);
    setSaving(false);
    if (error) {
      toast.error(`Update failed: ${error.message}`);
    } else {
      toast.success('Profile updated');
      queryClient.invalidateQueries({ queryKey: ['portal-customer'] });
    }
  };

  return (
    <PortalLayout>
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>
      <Card className="max-w-xl">
        <CardHeader><CardTitle>Company Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Email (login)</Label>
              <Input value={currentUser?.email || ''} disabled />
            </div>
            <div className="space-y-1.5">
              <Label>Company Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Contact Person</Label>
              <Input value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </form>
        </CardContent>
      </Card>
    </PortalLayout>
  );
}
