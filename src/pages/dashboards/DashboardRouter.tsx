import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import ShippingAgentDashboard from './ShippingAgentDashboard';
import ClearingAgentDashboard from './ClearingAgentDashboard';
import CarrierDashboard from './CarrierDashboard';
import TerminalDashboard from './TerminalDashboard';

const DASHBOARDS: Record<string, React.ComponentType> = {
  Administrator: AdminDashboard,
  Manager: ManagerDashboard,
  'Shipping Agent': ShippingAgentDashboard,
  'Clearing Agent': ClearingAgentDashboard,
  Carrier: CarrierDashboard,
  Terminal: TerminalDashboard,
};

export default function DashboardRouter() {
  const { currentUser, roles } = useAuth();
  const roleName = roles.find((r) => r.id === currentUser?.roleId)?.name;
  const DashboardComponent = (roleName && DASHBOARDS[roleName]) || AdminDashboard;
  return <DashboardComponent />;
}
