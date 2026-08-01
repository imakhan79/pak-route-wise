import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import logo from '@/assets/zicon-logo.png';

export default function ConfirmEmail() {
  const { bridgeSupabaseUser } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // The Supabase client auto-detects the confirmation tokens in the URL on load
      // and exchanges them for a session; give it a brief moment to settle.
      await new Promise((r) => setTimeout(r, 400));

      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;

      if (!session?.user) {
        setStatus('error');
        return;
      }

      const email = session.user.email!;
      const meta = session.user.user_metadata || {};

      await supabase.from('customers').update({
        contact_person: meta.full_name,
        name: meta.company || meta.full_name,
        phone: meta.phone,
      }).eq('email', email);

      bridgeSupabaseUser(session.user.id, email, meta.full_name || email, meta.phone, meta.company);
      setStatus('success');

      setTimeout(() => {
        if (!cancelled) navigate('/portal', { replace: true });
      }, 1500);
    })();

    return () => { cancelled = true; };
  }, [bridgeSupabaseUser, navigate]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md border-t-4 border-t-primary shadow-xl">
        <CardContent className="space-y-4 pt-8 text-center">
          <img src={logo} alt="Zicon Technology" className="mx-auto h-10 w-auto" />

          {status === 'checking' && (
            <>
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Confirming your account...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
              <h1 className="text-xl font-bold">Email confirmed!</h1>
              <p className="text-sm text-muted-foreground">Taking you to your dashboard...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="mx-auto h-10 w-10 text-destructive" />
              <h1 className="text-xl font-bold">Confirmation link invalid or expired</h1>
              <p className="text-sm text-muted-foreground">Please try registering again, or sign in if you're already confirmed.</p>
              <Link to="/login" className="inline-block text-sm font-medium text-primary hover:underline">Back to Sign In</Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
