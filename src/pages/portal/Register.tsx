import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import logo from '@/assets/zicon-logo.png';

export default function Register() {
  const { registerCustomer } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ company: '', fullName: '', email: '', phone: '', username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data: existing } = await supabase.from('customers').select('id').eq('email', form.email).maybeSingle();
      if (!existing) {
        const { error } = await supabase.from('customers').insert({
          name: form.company || form.fullName,
          contact_person: form.fullName,
          email: form.email,
          phone: form.phone,
          is_active: true,
        });
        if (error) throw error;
      }

      const ok = registerCustomer({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
        department: form.company,
      });

      if (ok) {
        toast.success('Account created', { description: `Welcome, ${form.fullName}!` });
        navigate('/portal', { replace: true });
      }
    } catch (err: any) {
      toast.error(`Registration failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-white p-3 rounded-xl shadow-sm border">
            <img src={logo} alt="Zicon Technology" className="h-12 w-auto" />
          </div>
          <h1 className="text-2xl font-bold">Create Customer Account</h1>
        </div>

        <Card className="border-t-4 border-t-primary shadow-xl">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Book shipments, request quotations, and track cargo online.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input required value={form.fullName} onChange={set('fullName')} />
                </div>
                <div className="space-y-1.5">
                  <Label>Company</Label>
                  <Input value={form.company} onChange={set('company')} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" required value={form.email} onChange={set('email')} />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input required value={form.phone} onChange={set('phone')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Username</Label>
                  <Input required value={form.username} onChange={set('username')} />
                </div>
                <div className="space-y-1.5">
                  <Label>Password</Label>
                  <Input type="password" required value={form.password} onChange={set('password')} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
