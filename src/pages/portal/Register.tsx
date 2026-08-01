import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { MailCheck } from 'lucide-react';
import logo from '@/assets/zicon-logo.png';

export default function Register() {
  const [form, setForm] = useState({ company: '', fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

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

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.fullName, company: form.company, phone: form.phone },
          emailRedirectTo: `${window.location.origin}/portal/confirm`,
        },
      });

      if (signUpError) throw signUpError;

      if (data.session) {
        // Email confirmation is disabled on this Supabase project - session is active immediately.
        toast.success('Account created! Redirecting...');
        window.location.href = '/portal/confirm';
        return;
      }

      setEmailSent(true);
    } catch (err: any) {
      toast.error(`Registration failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md border-t-4 border-t-primary shadow-xl">
          <CardContent className="space-y-4 pt-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <MailCheck className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-xl font-bold">Check your email</h1>
            <p className="text-sm text-muted-foreground">
              We've sent a confirmation link to <span className="font-medium text-foreground">{form.email}</span>.
              Click the link to activate your account, then sign in.
            </p>
            <Link to="/login" className="inline-block text-sm font-medium text-primary hover:underline">Back to Sign In</Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Book shipments, request quotations, and track cargo online. We'll email you a confirmation link.</CardDescription>
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
                <Input type="email" required value={form.email} onChange={set('email')} placeholder="you@company.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input required value={form.phone} onChange={set('phone')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Password</Label>
                  <Input type="password" required minLength={6} value={form.password} onChange={set('password')} />
                </div>
                <div className="space-y-1.5">
                  <Label>Confirm Password</Label>
                  <Input type="password" required value={form.confirmPassword} onChange={set('confirmPassword')} />
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
