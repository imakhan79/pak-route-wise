import {
  LayoutDashboard, Truck, Ship, Plane, FileText, Package, Globe, Warehouse, MapPin,
  DollarSign, Shield, BarChart3, Settings, Box, ClipboardCheck, ArrowRightLeft, Anchor,
  Layers, Users, Building2,
} from 'lucide-react';
import { ModuleId } from '@/types/auth';

export interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  moduleId?: ModuleId | ModuleId[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

// Groups/items without a moduleId have no permission gate (mirrors legacy behavior
// for modules that predate the ModuleId permission model).
export const NAV_GROUPS: NavGroup[] = [
  { title: '', items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/' }] },
  {
    title: 'Customers',
    items: [
      { label: 'Customer Directory', icon: Building2, path: '/customers' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Operations Workflow', icon: Layers, path: '/operations/workflow' },
    ],
  },
  {
    title: 'Freight',
    items: [
      { label: 'Road Freight', icon: Truck, path: '/freight/road', moduleId: 'freight_road' },
      { label: 'Sea Freight', icon: Ship, path: '/freight/sea', moduleId: 'freight_sea' },
      { label: 'Air Freight', icon: Plane, path: '/freight/air', moduleId: 'freight_air' },
      { label: 'Rail Freight', icon: Truck, path: '/freight/rail', moduleId: 'freight_rail' },
      { label: 'Rate Calculator', icon: Truck, path: '/freight/calculator', moduleId: ['freight_road', 'freight_sea', 'freight_air', 'freight_rail'] },
    ],
  },
  {
    title: 'Documents',
    items: [
      { label: 'Bill of Lading', icon: FileText, path: '/documents/bl', moduleId: 'bl_management' },
      { label: 'Packing List', icon: FileText, path: '/documents/packing-list', moduleId: 'bl_management' },
      { label: 'Bilty / GR', icon: FileText, path: '/documents/bilty', moduleId: 'bl_management' },
      { label: 'Air Waybill', icon: FileText, path: '/documents/awb', moduleId: 'bl_management' },
      { label: 'Shipping Manifest', icon: FileText, path: '/documents/manifest', moduleId: 'bl_management' },
    ],
  },
  {
    title: 'Customs (C&F)',
    items: [
      { label: 'GD Filing', icon: ClipboardCheck, path: '/customs/gd', moduleId: 'customs_gd' },
      { label: 'HS Code Lookup', icon: Package, path: '/customs/hs-codes', moduleId: 'customs_gd' },
      { label: 'Duty Calculator', icon: DollarSign, path: '/customs/duty-calculator', moduleId: 'customs_gd' },
      { label: 'Examination', icon: ClipboardCheck, path: '/customs/examination', moduleId: 'customs_gd' },
      { label: 'Gate Pass', icon: ClipboardCheck, path: '/customs/gate-pass', moduleId: 'customs_gd' },
    ],
  },
  {
    title: 'Imports',
    items: [
      { label: 'Import Index', icon: Package, path: '/import/index', moduleId: 'import' },
      { label: 'IGM Processing', icon: Package, path: '/import/igm', moduleId: 'import' },
      { label: 'Duty Assessment', icon: DollarSign, path: '/import/duty', moduleId: 'import' },
      { label: 'Release Orders', icon: FileText, path: '/import/release', moduleId: 'import' },
    ],
  },
  {
    title: 'Exports',
    items: [
      { label: 'Export Filing', icon: Globe, path: '/export/filing', moduleId: 'export' },
      { label: 'E-Form Processing', icon: Globe, path: '/export/e-form', moduleId: 'export' },
      { label: 'Shipping Bills', icon: FileText, path: '/export/shipping-bills', moduleId: 'export' },
    ],
  },
  {
    title: 'Transshipment',
    items: [
      { label: 'TSR Filing', icon: ArrowRightLeft, path: '/transshipment/tsr', moduleId: 'transshipment' },
      { label: 'Dry Port Transfer', icon: ArrowRightLeft, path: '/transshipment/dry-port', moduleId: 'transshipment' },
      { label: 'Seal Verification', icon: ArrowRightLeft, path: '/transshipment/seal', moduleId: 'transshipment' },
    ],
  },
  {
    title: 'Afghan Transit',
    items: [
      { label: 'ATTA Management', icon: MapPin, path: '/atta/management', moduleId: 'afghan_transit' },
      { label: 'Transit Pass', icon: MapPin, path: '/atta/transit-pass', moduleId: 'afghan_transit' },
      { label: 'Border Clearance', icon: MapPin, path: '/atta/border-clearance', moduleId: 'afghan_transit' },
      { label: 'Bonded Carriers', icon: MapPin, path: '/atta/bonded-carriers', moduleId: 'afghan_transit' },
    ],
  },
  {
    title: 'Local Logistics',
    items: [
      { label: 'Dispatch', icon: Box, path: '/local/dispatch' },
      { label: 'Route Planning', icon: Box, path: '/local/routes' },
      { label: 'POD Management', icon: Box, path: '/local/pod' },
    ],
  },
  {
    title: 'Maritime Operations',
    items: [
      { label: 'Container Tracking', icon: Anchor, path: '/maritime/containers' },
      { label: 'Vessel Schedule', icon: Ship, path: '/maritime/vessels' },
      { label: 'Port Directory', icon: Anchor, path: '/maritime/ports' },
    ],
  },
  {
    title: 'Air Cargo',
    items: [
      { label: 'AWB Management', icon: Plane, path: '/air-cargo/awb' },
      { label: 'Cargo Handling', icon: Plane, path: '/air-cargo/handling' },
      { label: 'Airlines', icon: Plane, path: '/air-cargo/airlines' },
    ],
  },
  {
    title: 'Courier Service',
    items: [
      { label: 'Shipment Booking', icon: Truck, path: '/courier/booking' },
      { label: 'Live Tracking', icon: Truck, path: '/courier/tracking' },
      { label: 'Courier Management', icon: Truck, path: '/courier/management' },
    ],
  },
  {
    title: 'Warehousing',
    items: [
      { label: 'Inventory', icon: Warehouse, path: '/warehouse/inventory', moduleId: 'warehousing' },
      { label: 'GRN / GIN', icon: Warehouse, path: '/warehouse/grn', moduleId: 'warehousing' },
      { label: 'Bonded Warehouse', icon: Warehouse, path: '/warehouse/bonded', moduleId: 'warehousing' },
    ],
  },
  {
    title: 'Asset Management',
    items: [
      { label: 'Vehicles', icon: Truck, path: '/fleet/vehicles' },
      { label: 'Drivers', icon: Users, path: '/fleet/drivers' },
    ],
  },
  {
    title: 'Finance & Accounts',
    items: [
      { label: 'Invoices', icon: DollarSign, path: '/finance/invoices', moduleId: 'finance' },
      { label: 'Duty Payments', icon: DollarSign, path: '/finance/duties', moduleId: 'finance' },
      { label: 'Demurrage', icon: DollarSign, path: '/finance/demurrage', moduleId: 'finance' },
      { label: 'Financial Reports', icon: BarChart3, path: '/finance/reports', moduleId: 'finance' },
    ],
  },
  {
    title: 'HR & Payroll',
    items: [
      { label: 'Employees', icon: Users, path: '/hr/employees' },
      { label: 'Payroll', icon: Users, path: '/hr/payroll' },
    ],
  },
  {
    title: 'Compliance',
    items: [
      { label: 'Documents', icon: Shield, path: '/compliance/documents' },
      { label: 'Customs Rules', icon: Shield, path: '/compliance/rules' },
      { label: 'Audit Trail', icon: Shield, path: '/compliance/audit' },
    ],
  },
  {
    title: 'Tracking & Visibility',
    items: [
      { label: 'GPS Tracking', icon: MapPin, path: '/tracking/gps', moduleId: 'tracking' },
      { label: 'Container Track', icon: MapPin, path: '/tracking/containers', moduleId: 'tracking' },
      { label: 'Milestones', icon: MapPin, path: '/tracking/milestones', moduleId: 'tracking' },
      { label: 'Alerts', icon: MapPin, path: '/tracking/alerts', moduleId: 'tracking' },
    ],
  },
  {
    title: 'Reports',
    items: [
      { label: 'Reports & Analytics', icon: BarChart3, path: '/reports', moduleId: 'reports' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Global Settings', icon: Settings, path: '/settings', moduleId: 'settings' },
    ],
  },
];

export function filterNavGroups(
  hasPermission: (module: ModuleId, action: 'view') => boolean
): NavGroup[] {
  return NAV_GROUPS.map((group) => {
    const items = group.items.filter((item) => {
      if (!item.moduleId) return true;
      const ids = Array.isArray(item.moduleId) ? item.moduleId : [item.moduleId];
      return ids.some((id) => hasPermission(id, 'view'));
    });
    return { ...group, items };
  }).filter((group) => group.items.length > 0);
}
