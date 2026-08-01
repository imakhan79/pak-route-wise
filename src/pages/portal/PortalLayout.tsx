import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/zicon-logo.png';

const NAV = [
  { label: 'Dashboard', path: '/portal' },
  { label: 'My Shipments', path: '/portal/shipments' },
  { label: 'Request Quotation', path: '/portal/quotation' },
  { label: 'Invoices', path: '/portal/invoices' },
  { label: 'Support', path: '/portal/support' },
  { label: 'Profile', path: '/portal/profile' },
];

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/portal" className="flex items-center gap-2">
            <img src={logo} alt="Zicon Technology" className="h-9 w-auto" />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  location.pathname === item.path ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{currentUser?.fullName}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" /> Logout
            </Button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t px-4 py-2 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'shrink-0 rounded-md px-3 py-1.5 text-xs font-medium',
                location.pathname === item.path ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
