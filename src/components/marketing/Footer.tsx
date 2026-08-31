import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';
import logo from '@/assets/zicon-logo.png';

const COLUMNS: { title: string; links: string[] }[] = [
  { title: 'Products', links: ['Transportation', 'Warehouse', 'Fleet', 'GPS Tracking'] },
  { title: 'Solutions', links: ['Enterprise', 'Freight Forwarders', 'Customs Brokers'] },
  { title: 'Industries', links: ['Retail', 'Manufacturing', 'E-commerce', 'Energy'] },
  { title: 'Resources', links: ['Documentation', 'API Reference', 'Blog', 'Case Studies'] },
  { title: 'Support', links: ['Help Center', 'Contact Us', 'System Status'] },
];

const SOCIALS: { Icon: typeof Facebook; label: string }[] = [
  { Icon: Facebook, label: 'Facebook' },
  { Icon: Twitter, label: 'Twitter' },
  { Icon: Linkedin, label: 'LinkedIn' },
  { Icon: Instagram, label: 'Instagram' },
];

export function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('Subscribed! Check your inbox for a confirmation email.');
    setEmail('');
  };

  return (
    <footer className="relative overflow-hidden bg-[hsl(1,20%,7%)] pt-20">
      <svg viewBox="0 0 1440 80" className="absolute -top-px left-0 w-full text-[hsl(1,20%,10%)]" preserveAspectRatio="none">
        <path
          fill="currentColor"
          d="M0,32 C240,80 480,0 720,24 C960,48 1200,88 1440,40 L1440,0 L0,0 Z"
        />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-14 md:grid-cols-6">
          <div className="md:col-span-1">
            <img src={logo} alt="Zicon Technology" className="h-10 w-auto" />
            <p className="mt-4 text-sm leading-relaxed text-white/40">
              The enterprise logistics platform for global operations.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  onClick={() => toast.info(`Follow us on ${label} — coming soon`)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-[hsl(36,89%,53%)]/50 hover:text-[hsl(36,89%,53%)]"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      onClick={() => toast.info(`${link} — coming soon`)}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
          <div className="w-full max-w-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">Newsletter</p>
            <form className="flex gap-2" onSubmit={handleSubscribe}>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 focus:border-[hsl(36,89%,53%)]/50 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(36,89%,53%)] text-white transition-transform hover:scale-105"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Zicon Technology. All rights reserved. ·{' '}
            <Link to="/login" className="hover:text-white">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
