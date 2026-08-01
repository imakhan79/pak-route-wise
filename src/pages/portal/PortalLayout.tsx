import { ReactNode } from 'react';
import { DashboardShell } from '@/components/dashboardV2/DashboardShell';

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <DashboardShell roleName="Customer">{children}</DashboardShell>;
}
