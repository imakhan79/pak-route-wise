import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, XAxis, Tooltip,
} from 'recharts';
import {
  X, Bell, Package, CheckCircle2, DollarSign, UserPlus, FileText, ShieldCheck,
  Sparkles, TrendingUp, AlertTriangle, Gauge, Plus, Truck, Users as UsersIcon,
  Receipt, MapPin, UserCog, Building2, ChevronLeft, ChevronRight, Paperclip,
  Send, Cpu, HardDrive, Server, Wifi, Database, Mail, MessageCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const COLORS = ['hsl(1 58% 27%)', 'hsl(36 89% 53%)', 'hsl(0 0% 66%)', 'hsl(142 71% 45%)', 'hsl(217 91% 60%)'];

// ---------- Chart Card wrapper ----------
function ChartFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-2xl border-black/5 shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">{title}</CardTitle></CardHeader>
      <CardContent className="h-[220px]">{children}</CardContent>
    </Card>
  );
}

export function RevenueTrendChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ChartFrame title="Revenue Trend">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(36 89% 53%)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="hsl(36 89% 53%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="hsl(36 89% 53%)" strokeWidth={2} fill="url(#rev)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function ShipmentStatusPie({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ChartFrame title="Shipment Status">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function BookingTrendLine({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ChartFrame title="Booking Trend">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="hsl(1 58% 27%)" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function PerformanceRadar({ data }: { data: { metric: string; value: number }[] }) {
  return (
    <ChartFrame title="Carrier Performance">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9 }} />
          <Radar dataKey="value" stroke="hsl(36 89% 53%)" fill="hsl(36 89% 53%)" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function CustomerGrowthBar({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ChartFrame title="Customer Growth">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="value" fill="hsl(1 58% 45%)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function DemandHeatmap({ title = 'Weekly Demand Heatmap' }: { title?: string }) {
  const cells = Array.from({ length: 70 }).map(() => Math.random());
  return (
    <ChartFrame title={title}>
      <div className="grid h-full grid-cols-[repeat(14,minmax(0,1fr))] gap-1">
        {cells.map((v, i) => (
          <div key={i} className="rounded-sm" style={{ background: `hsl(1 58% 27% / ${0.08 + v * 0.6})` }} />
        ))}
      </div>
    </ChartFrame>
  );
}

// ---------- Activity Feed ----------
const ACTIVITY_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  booking: { icon: Package, color: 'text-blue-600 bg-blue-500/10' },
  delivered: { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-500/10' },
  payment: { icon: DollarSign, color: 'text-amber-600 bg-amber-500/10' },
  customer: { icon: UserPlus, color: 'text-purple-600 bg-purple-500/10' },
  invoice: { icon: FileText, color: 'text-primary bg-primary/10' },
  approval: { icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-500/10' },
};

export function ActivityFeedWidget({ items }: { items: { type: keyof typeof ACTIVITY_ICONS; text: string; time: string }[] }) {
  return (
    <Card className="rounded-2xl border-black/5 shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Live Activity</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, i) => {
          const meta = ACTIVITY_ICONS[item.type];
          return (
            <div key={i} className="flex gap-3">
              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', meta.color)}>
                <meta.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm">{item.text}</p>
                <p className="text-[11px] text-muted-foreground">{item.time}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ---------- Quick Actions ----------
const ACTION_ICONS: Record<string, React.ElementType> = {
  shipment: Truck, booking: Package, customer: UserPlus, invoice: Receipt,
  track: MapPin, carrier: Truck, terminal: Building2, agent: UserCog,
};

export function QuickActionsPanel({ actions }: { actions: { label: string; key: keyof typeof ACTION_ICONS }[] }) {
  return (
    <Card className="rounded-2xl border-black/5 shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Quick Actions</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {actions.map((a) => {
          const Icon = ACTION_ICONS[a.key] || Plus;
          return (
            <motion.button
              key={a.label}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center gap-2 rounded-xl border border-black/5 bg-black/[0.02] p-3 text-center"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg text-white" style={{ background: 'var(--gradient-primary)' }}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-medium leading-tight">{a.label}</span>
            </motion.button>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ---------- AI Insights ----------
export function AIInsightsWidget({ insights }: { insights: string[] }) {
  return (
    <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-secondary" /> AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {insights.map((text, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
            <span className="text-foreground/80">{text}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ---------- Bookings/Data Table ----------
export function DataTableCard({ title, columns, rows }: { title: string; columns: string[]; rows: (string | number)[][] }) {
  return (
    <Card className="rounded-2xl border-black/5 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" className="h-7 text-[11px]">Filter</Button>
          <Button size="sm" variant="ghost" className="h-7 text-[11px]">Export</Button>
          <Button size="sm" variant="ghost" className="h-7 text-[11px]">Print</Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-[11px] uppercase text-muted-foreground">
              {columns.map((c) => <th key={c} className="px-5 py-2 font-medium">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                {row.map((cell, j) => (
                  <td key={j} className="px-5 py-3">
                    {j === row.length - 1 && typeof cell === 'string' ? (
                      <Badge variant="outline" className="border-0 bg-primary/10 text-primary">{cell}</Badge>
                    ) : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

// ---------- Mini Calendar ----------
export function MiniCalendarWidget({ events }: { events: { day: number; label: string }[] }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const startDay = viewDate.getDay();
  const eventDays = new Set(events.map((e) => e.day));

  return (
    <Card className="rounded-2xl border-black/5 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold">
          {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </CardTitle>
        <div className="flex gap-1">
          <button onClick={() => setMonthOffset((m) => m - 1)}><ChevronLeft className="h-4 w-4 text-muted-foreground" /></button>
          <button onClick={() => setMonthOffset((m) => m + 1)}><ChevronRight className="h-4 w-4 text-muted-foreground" /></button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
          {Array.from({ length: startDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = monthOffset === 0 && day === today.getDate();
            return (
              <div
                key={day}
                className={cn(
                  'relative flex h-7 items-center justify-center rounded-lg text-[11px]',
                  isToday && 'text-white',
                  eventDays.has(day) && !isToday && 'font-semibold text-primary'
                )}
                style={isToday ? { background: 'var(--gradient-primary)' } : undefined}
              >
                {day}
                {eventDays.has(day) && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-secondary" />}
              </div>
            );
          })}
        </div>
        <div className="mt-3 space-y-1.5 border-t border-black/5 pt-3">
          {events.slice(0, 3).map((e, i) => (
            <p key={i} className="text-[11px] text-muted-foreground"><span className="font-semibold text-foreground">{e.day}</span> — {e.label}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------- Notification Drawer ----------
const NOTIF_COLORS: Record<string, string> = { high: 'bg-red-500', medium: 'bg-amber-500', low: 'bg-blue-500' };
const MOCK_NOTIFS = [
  { icon: Package, text: 'Shipment TRK-2026-003 is now in transit', time: '2m ago', priority: 'medium' },
  { icon: DollarSign, text: 'Payment received for INV-00212', time: '18m ago', priority: 'low' },
  { icon: AlertTriangle, text: 'Container seal tampering detected', time: '1h ago', priority: 'high' },
  { icon: UserPlus, text: 'New customer registered: Al-Falah Trading', time: '3h ago', priority: 'low' },
  { icon: FileText, text: 'GD-2026-00146 requires review', time: '5h ago', priority: 'medium' },
];

export function NotificationDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40 bg-black/20" />
          <motion.div
            initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} transition={{ type: 'spring', damping: 28 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-white p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold"><Bell className="h-4 w-4" /> Notifications</h3>
              <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              {MOCK_NOTIFS.map((n, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-black/5 p-3">
                  <div className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', NOTIF_COLORS[n.priority])} />
                  <n.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs">{n.text}</p>
                    <p className="text-[10px] text-muted-foreground">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ---------- Task Widget ----------
export function TaskWidget({ tasks }: { tasks: { label: string; done: boolean }[] }) {
  const doneCount = tasks.filter((t) => t.done).length;
  const pct = Math.round((doneCount / tasks.length) * 100);
  return (
    <Card className="rounded-2xl border-black/5 shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Tasks</CardTitle></CardHeader>
      <CardContent>
        <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-black/5">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full rounded-full" style={{ background: 'var(--gradient-primary)' }} />
        </div>
        <p className="mb-3 text-[11px] text-muted-foreground">{doneCount}/{tasks.length} completed</p>
        <div className="space-y-2">
          {tasks.map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <CheckCircle2 className={cn('h-4 w-4', t.done ? 'text-emerald-500' : 'text-black/15')} />
              <span className={cn(t.done && 'text-muted-foreground line-through')}>{t.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------- Files Widget ----------
export function FilesWidget({ files }: { files: { name: string; type: string; size: string }[] }) {
  return (
    <Card className="rounded-2xl border-black/5 shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Recent Documents</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {files.map((f, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg p-2 hover:bg-black/[0.02]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Paperclip className="h-4 w-4" /></div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{f.name}</p>
              <p className="text-[10px] text-muted-foreground">{f.type} · {f.size}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ---------- Chat Widget ----------
export function ChatWidget({ contacts }: { contacts: { name: string; role: string; lastMsg: string; unread?: number }[] }) {
  const [active, setActive] = useState(0);
  const [text, setText] = useState('');
  return (
    <Card className="rounded-2xl border-black/5 shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Messages</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-5 gap-3 p-0 px-4 pb-4">
        <div className="col-span-2 space-y-1">
          {contacts.map((c, i) => (
            <button key={i} onClick={() => setActive(i)} className={cn('w-full rounded-lg p-2 text-left', active === i ? 'bg-primary/10' : 'hover:bg-black/[0.02]')}>
              <div className="flex items-center justify-between">
                <p className="truncate text-xs font-semibold">{c.name}</p>
                {c.unread ? <span className="flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] text-white">{c.unread}</span> : null}
              </div>
              <p className="truncate text-[10px] text-muted-foreground">{c.role}</p>
            </button>
          ))}
        </div>
        <div className="col-span-3 flex flex-col rounded-lg border border-black/5 p-2">
          <div className="flex-1 space-y-2 text-xs text-muted-foreground">
            <p className="rounded-lg bg-black/[0.03] p-2">{contacts[active]?.lastMsg}</p>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message..." className="flex-1 rounded-lg border border-black/5 px-2 py-1.5 text-xs outline-none" />
            <button className="rounded-lg p-1.5 text-white" style={{ background: 'var(--gradient-primary)' }}><Send className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------- System Health ----------
const HEALTH_ICONS = [
  { key: 'CPU', icon: Cpu, value: 42 },
  { key: 'Memory', icon: HardDrive, value: 61 },
  { key: 'Server', icon: Server, value: 98 },
  { key: 'API', icon: Wifi, value: 99 },
  { key: 'Database', icon: Database, value: 87 },
  { key: 'Email Queue', icon: Mail, value: 12 },
  { key: 'SMS Queue', icon: MessageCircle, value: 4 },
];

export function SystemHealthWidget() {
  return (
    <Card className="rounded-2xl border-black/5 shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-semibold"><Gauge className="h-4 w-4" /> System Health</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {HEALTH_ICONS.map((h) => (
          <div key={h.key}>
            <div className="mb-1 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-muted-foreground"><h.icon className="h-3 w-3" /> {h.key}</span>
              <span className="font-semibold">{h.value}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${h.value}%` }}
                className="h-full rounded-full"
                style={{ background: h.value > 90 ? 'hsl(142 71% 45%)' : h.value > 60 ? 'hsl(36 89% 53%)' : 'hsl(1 58% 45%)' }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ---------- Welcome Hero ----------
export function WelcomeHero({ name, subtitle }: { name: string; subtitle: string }) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl p-8 text-white shadow-xl" style={{ background: 'var(--gradient-primary)' }}>
      <motion.div
        className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-white/10 blur-2xl"
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <div className="relative">
        <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, {name}</h1>
        <p className="mt-1.5 text-sm text-white/80">{subtitle}</p>
      </div>
    </div>
  );
}
