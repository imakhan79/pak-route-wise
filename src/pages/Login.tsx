import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Eye, EyeOff, Lock, User, AlertCircle, CheckCircle2, AlertTriangle,
  ShieldCheck, Building2, Globe2, Radar, Cloud, Clock, Sparkles,
  ShieldAlert, FileCheck, Lock as LockIcon, Sun, Moon, MonitorSmartphone,
  Briefcase, Ship, Truck, Warehouse, UserRound, MailCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/zicon-logo.png';
import { LoginVisual } from '@/components/login/LoginVisual';
import { RoleCard } from '@/components/login/RoleCard';
import { MagneticButton } from '@/components/marketing/MagneticButton';

const ROLES = [
  { label: 'Admin', description: 'Full System Access', icon: ShieldCheck, username: 'admin', password: 'Admin@123' },
  { label: 'Manager', description: 'Operations Control', icon: Briefcase, username: 'manager', password: 'Manager@123' },
  { label: 'Shipping Agent', description: 'Shipment Booking', icon: Ship, username: 'agent', password: 'Agent@123' },
  { label: 'Clearing Agent', description: 'Customs Clearance', icon: FileCheck, username: 'clearing', password: 'Clearing@123' },
  { label: 'Carrier', description: 'Transportation', icon: Truck, username: 'carrier', password: 'Carrier@123' },
  { label: 'Terminal', description: 'Warehouse Operations', icon: Warehouse, username: 'terminal', password: 'Terminal@123' },
  { label: 'User', description: 'Customer Portal', icon: UserRound, username: 'customer', password: 'Customer@123' },
];

const FEATURES = [
  { icon: LockIcon, label: 'Secure Login' },
  { icon: ShieldAlert, label: 'Enterprise Security' },
  { icon: Building2, label: 'Multi Branch' },
  { icon: Globe2, label: 'Multi Company' },
  { icon: Radar, label: 'Real-time Tracking' },
  { icon: Cloud, label: 'Cloud Based' },
  { icon: Clock, label: '24/7 Availability' },
  { icon: Sparkles, label: 'AI Powered' },
];

const SECURITY_BADGES = ['SSL Secured', 'Encrypted Login', '2FA Ready', 'Audit Logs', 'Secure Cloud'];

type ThemeMode = 'light' | 'dark' | 'auto';

export default function Login() {
  const { login, users, roles, bridgeSupabaseUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/app';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else if (theme === 'light') document.documentElement.classList.remove('dark');
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, [theme]);

  const cycleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : t === 'dark' ? 'auto' : 'light'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      const ok = login(username, password);

      if (ok) {
        setSuccess(true);
        toast.success('Login successful', { description: `Welcome back, ${username}!` });
        const user = users.find((u) => u.username === username);
        const role = roles.find((r) => r.id === user?.roleId);
        const isCustomer = role?.name === 'Customer';
        await new Promise((resolve) => setTimeout(resolve, 500));
        navigate(isCustomer ? '/portal' : from, { replace: true });
        return;
      }

      // Fall back to a real Supabase-authenticated customer (self-registered via /portal/register)
      if (username.includes('@')) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email: username, password });
        if (!authError && data.user) {
          const meta = data.user.user_metadata || {};
          bridgeSupabaseUser(data.user.id, data.user.email!, meta.full_name || data.user.email!, meta.phone, meta.company);
          setSuccess(true);
          toast.success('Login successful', { description: `Welcome back, ${meta.full_name || username}!` });
          await new Promise((resolve) => setTimeout(resolve, 500));
          navigate('/portal', { replace: true });
          return;
        }
      }

      setError('Invalid username or password. Please try again.');
      toast.error('Login failed');
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleClick = (role: (typeof ROLES)[number]) => {
    setUsername(role.username);
    setPassword(role.password);
    setActiveRole(role.label);
    toast.info(`Filled credentials for ${role.label}`);
  };

  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-background lg:grid-cols-[60%_40%]">
      <LoginVisual />

      <div className="relative flex items-center justify-center overflow-y-auto p-4 py-10 sm:p-8">
        {/* Ambient light for right panel */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 right-0 h-72 w-72 rounded-full opacity-[0.06] blur-3xl" style={{ background: 'var(--gradient-primary)' }} />
        </div>

        <div className="relative w-full max-w-md space-y-6">
          <button
            onClick={cycleTheme}
            className="absolute right-0 top-0 flex items-center gap-1.5 rounded-full border border-black/5 bg-white/60 px-3 py-1.5 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur-md"
            aria-label="Toggle theme"
          >
            {theme === 'light' && <Sun className="h-3.5 w-3.5" />}
            {theme === 'dark' && <Moon className="h-3.5 w-3.5" />}
            {theme === 'auto' && <MonitorSmartphone className="h-3.5 w-3.5" />}
            <span className="capitalize">{theme}</span>
          </button>

          <div className="flex flex-col items-center space-y-3 pt-8 lg:hidden">
            <img src={logo} alt="Zicon Technology" className="h-14 w-auto rounded-xl shadow-sm" />
          </div>

          {/* Glass login card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[24px] border border-black/5 bg-white/70 p-7 shadow-2xl backdrop-blur-2xl"
          >
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-[24px]"
              style={{ boxShadow: '0 0 0 1px hsl(36 89% 53% / 0.15)' }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="relative hidden items-center gap-2 lg:flex">
              <img src={logo} alt="Zicon Technology" className="h-9 w-auto rounded-md" />
            </div>

            <div className="relative mt-4">
              <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to continue.</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative mt-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="relative mt-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username">Username or Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="e.g. admin"
                    className="pl-9"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="text-xs font-medium text-primary hover:underline"
                    onClick={(e) => { e.preventDefault(); toast.info('Please contact IT Support to reset your password.'); }}
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="pl-9 pr-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={(e) => setCapsLockOn(e.getModifierState?.('CapsLock') ?? false)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <AnimatePresence>
                  {capsLockOn && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-1.5 text-[11px] text-amber-600"
                    >
                      <AlertTriangle className="h-3 w-3" /> Caps Lock is on
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={(c) => setRememberMe(!!c)} />
                <Label htmlFor="remember" className="cursor-pointer text-sm font-normal text-muted-foreground">Remember me for 30 days</Label>
              </div>

              <MagneticButton variant="primary" type="submit" disabled={isLoading} className="!flex !w-full !items-center !justify-center !gap-2 !py-3.5">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.span key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Success
                    </motion.span>
                  ) : (
                    <motion.span key="idle">{isLoading ? 'Signing in...' : 'Sign In'}</motion.span>
                  )}
                </AnimatePresence>
              </MagneticButton>

              <Link
                to="/portal/register"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white py-3 text-sm font-medium shadow-sm transition-shadow hover:shadow-md"
              >
                <MailCheck className="h-4 w-4 text-primary" />
                Sign Up · Confirm via Email
              </Link>

              <div className="flex items-center justify-center gap-4 pt-1 text-xs text-muted-foreground">
                <button type="button" onClick={() => toast.info('Our sales team will be in touch shortly.')} className="hover:text-primary hover:underline">Request Demo</button>
                <span>·</span>
                <button type="button" onClick={() => toast.info('Support: support@zicontechnology.com')} className="hover:text-primary hover:underline">Contact Support</button>
              </div>
            </form>
          </motion.div>

          {/* Role selector */}
          <div>
            <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Demo Accounts — Click a role to auto-fill</p>
            <div className="grid grid-cols-4 gap-2">
              {ROLES.map((r) => (
                <RoleCard key={r.label} label={r.label} description={r.description} icon={r.icon} active={activeRole === r.label} onClick={() => handleRoleClick(r)} />
              ))}
            </div>
          </div>

          {/* Quick features */}
          <div className="flex flex-wrap justify-center gap-2">
            {FEATURES.map((f) => (
              <span key={f.label} className="flex items-center gap-1.5 rounded-full border border-black/5 bg-white px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                <f.icon className="h-3 w-3" /> {f.label}
              </span>
            ))}
          </div>

          {/* Security badges */}
          <div className="flex flex-wrap justify-center gap-2">
            {SECURITY_BADGES.map((b) => (
              <span key={b} className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">{b}</span>
            ))}
          </div>

          {/* Footer */}
          <div className="space-y-2 text-center text-[11px] text-muted-foreground">
            <div className="flex flex-wrap justify-center gap-3">
              <a href="#" className="hover:text-primary hover:underline">Privacy Policy</a>
              <a href="#" className="hover:text-primary hover:underline">Terms &amp; Conditions</a>
              <a href="#" className="hover:text-primary hover:underline">Support</a>
              <a href="#" className="hover:text-primary hover:underline">Documentation</a>
            </div>
            <p>
              v1.0.0 · © {new Date().getFullYear()} Zicon Technology. All rights reserved. · Powered by{' '}
              <Link to="/home" className="font-medium text-primary hover:underline">Zicon Technology</Link>
            </p>
            <p>
              New customer? <Link to="/portal/register" className="font-medium text-primary hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
