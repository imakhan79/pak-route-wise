import { ReactNode, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/zicon-logo.png';
import {
  LayoutDashboard, Search, Bell, MessageSquare, CheckSquare, Calendar as CalendarIcon,
  Globe, Sun, Moon, Maximize, ChevronLeft, ChevronRight, LogOut, Sparkles, Cloud,
  Truck, Package, FileText, Users, Ship, Warehouse, DollarSign, Settings, Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NotificationDrawer } from './Widgets';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path?: string;
}

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  Administrator: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Vehicles', icon: Truck, path: '/fleet/vehicles' },
    { label: 'GPS Tracking', icon: Package, path: '/tracking/gps' },
    { label: 'Documents', icon: FileText, path: '/documents/bl' },
    { label: 'Finance', icon: DollarSign, path: '/finance/invoices' },
    { label: 'HR', icon: Users, path: '/hr/employees' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ],
  Manager: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'GPS Tracking', icon: Package, path: '/tracking/gps' },
    { label: 'Finance', icon: DollarSign, path: '/finance/invoices' },
    { label: 'Reports', icon: FileText, path: '/reports' },
  ],
  'Shipping Agent': [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Road Freight', icon: Truck, path: '/freight/road' },
    { label: 'Sea Freight', icon: Ship, path: '/freight/sea' },
    { label: 'Documents', icon: FileText, path: '/documents/bl' },
  ],
  'Clearing Agent': [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'GD Filing', icon: FileText, path: '/customs/gd' },
    { label: 'HS Codes', icon: Package, path: '/customs/hs-codes' },
  ],
  Carrier: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'GPS Tracking', icon: Package, path: '/tracking/gps' },
    { label: 'Vessel Schedule', icon: Ship, path: '/maritime/vessels' },
  ],
  Terminal: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Warehouse', icon: Warehouse, path: '/warehouse/inventory' },
    { label: 'Container Track', icon: Package, path: '/tracking/containers' },
  ],
};

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function DashboardShell({ roleName, children }: { roleName: string; children: ReactNode }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const now = useClock();

  const navItems = NAV_BY_ROLE[roleName] || NAV_BY_ROLE.Administrator;

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setDark((d) => !d);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(1 58% 27% / 0.08), transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-32 top-1/3 h-[380px] w-[380px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(36 89% 53% / 0.1), transparent 70%)' }}
          animate={{ scale: [1.1, 1, 1.1], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Floating Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 84 : 256 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-4 top-4 bottom-4 z-40 hidden flex-col overflow-hidden rounded-3xl border border-black/5 bg-white/70 shadow-xl backdrop-blur-2xl lg:flex"
      >
        <div className="flex items-center gap-2 border-b border-black/5 p-4">
          <img src={logo} alt="Zicon" className="h-9 w-auto shrink-0" />
        </div>

        <div className="p-3">
          {!collapsed && (
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search..."
                className="w-full rounded-xl border border-black/5 bg-black/[0.03] py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {navItems.map((item) => (
            <NavLink key={item.label} to={item.path || '#'} end={item.path === '/'}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: collapsed ? 0 : 3 }}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive ? 'text-white shadow-lg' : 'text-foreground/70 hover:bg-black/[0.04]'
                  )}
                  style={isActive ? { background: 'var(--gradient-primary)' } : undefined}
                >
                  <item.icon className={cn('h-[18px] w-[18px] shrink-0 transition-transform group-hover:scale-110', isActive && 'drop-shadow')} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="truncate">
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-black/5 p-3">
          <div className={cn('flex items-center gap-2 rounded-xl p-2', !collapsed && 'bg-black/[0.03]')}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: 'var(--gradient-primary)' }}>
              {currentUser?.fullName?.[0] || 'U'}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{currentUser?.fullName}</p>
                <p className="truncate text-[10px] text-muted-foreground">{roleName}</p>
              </div>
            )}
            {!collapsed && (
              <button onClick={() => { logout(); navigate('/login'); }} className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="mt-2 flex w-full items-center justify-center rounded-xl border border-black/5 py-1.5 text-muted-foreground hover:bg-black/[0.03]"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </motion.aside>

      {/* Main column */}
      <div className={cn('relative z-10 transition-all duration-300', collapsed ? 'lg:pl-[108px]' : 'lg:pl-[280px]')}>
        {/* Premium Header */}
        <header className="sticky top-4 z-30 mx-4 mb-4">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-black/5 bg-white/70 px-4 py-3 shadow-lg backdrop-blur-2xl">
            <div className="relative hidden min-w-[180px] flex-1 sm:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input placeholder="Global search..." className="w-full rounded-xl border border-black/5 bg-black/[0.03] py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow" style={{ background: 'var(--gradient-primary)' }}>
              <Sparkles className="h-3.5 w-3.5" /> AI Assistant
            </button>

            <div className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
              <Cloud className="h-3.5 w-3.5" /> 28°C Karachi
            </div>
            <div className="hidden font-mono text-xs text-muted-foreground md:block">
              {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>

            <select className="hidden rounded-lg border border-black/5 bg-black/[0.03] px-2 py-1.5 text-xs lg:block">
              <option>Zicon Technology</option>
            </select>
            <select className="hidden rounded-lg border border-black/5 bg-black/[0.03] px-2 py-1.5 text-xs lg:block">
              <option>Karachi HQ</option>
              <option>Lahore Office</option>
              <option>Islamabad Branch</option>
            </select>

            <button className="rounded-lg p-2 text-muted-foreground hover:bg-black/[0.04]"><Globe className="h-4 w-4" /></button>
            <button onClick={toggleDark} className="rounded-lg p-2 text-muted-foreground hover:bg-black/[0.04]">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={toggleFullscreen} className="rounded-lg p-2 text-muted-foreground hover:bg-black/[0.04]"><Maximize className="h-4 w-4" /></button>
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-black/[0.04]"><MessageSquare className="h-4 w-4" /></button>
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-black/[0.04]"><CheckSquare className="h-4 w-4" /></button>
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-black/[0.04]"><CalendarIcon className="h-4 w-4" /></button>
            <button onClick={() => setNotifOpen(true)} className="relative rounded-lg p-2 text-muted-foreground hover:bg-black/[0.04]">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">5</span>
            </button>

            <div className="relative">
              <button onClick={() => setProfileOpen((o) => !o)} className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: 'var(--gradient-primary)' }}>
                {currentUser?.fullName?.[0] || 'U'}
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-11 w-48 rounded-xl border border-black/5 bg-white p-2 shadow-xl"
                  >
                    <p className="px-2 py-1.5 text-xs font-semibold">{currentUser?.fullName}</p>
                    <p className="px-2 pb-2 text-[10px] text-muted-foreground">{currentUser?.email}</p>
                    <button
                      onClick={() => { logout(); navigate('/login'); }}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-destructive hover:bg-destructive/5"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="px-4 pb-8">{children}</main>
      </div>

      <NotificationDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}
