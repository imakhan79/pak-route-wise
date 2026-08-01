import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardShell } from '@/components/dashboardV2/DashboardShell';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  const { currentUser, roles } = useAuth();
  const roleName = roles.find((r) => r.id === currentUser?.roleId)?.name || 'Administrator';

  return (
    <DashboardShell roleName={roleName} title={title} subtitle={subtitle}>
      {children}
    </DashboardShell>
  );
}
