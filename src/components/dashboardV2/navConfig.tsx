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
  { title: '', items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/app' }] },
  {
    title: 'Customers',
    items: [
      { label: 'Customer Directory', icon: Building2, path: '/app/customers' },
      { label: 'Vendors', icon: Truck, path: '/app/vendors' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Operations Workflow', icon: Layers, path: '/app/operations/workflow' },
    ],
  },
  {
    title: 'Freight',
    items: [
      { label: 'Road Freight', icon: Truck, path: '/app/freight/road', moduleId: 'freight_road' },
      { label: 'Sea Freight', icon: Ship, path: '/app/freight/sea', moduleId: 'freight_sea' },
      { label: 'Air Freight', icon: Plane, path: '/app/freight/air', moduleId: 'freight_air' },
      { label: 'Rail Freight', icon: Truck, path: '/app/freight/rail', moduleId: 'freight_rail' },
      { label: 'Rate Calculator', icon: Truck, path: '/app/freight/calculator', moduleId: ['freight_road', 'freight_sea', 'freight_air', 'freight_rail'] },
    ],
  },
  {
    title: 'Documents',
    items: [
      { label: 'Bill of Lading', icon: FileText, path: '/app/documents/bl', moduleId: 'bl_management' },
      { label: 'Packing List', icon: FileText, path: '/app/documents/packing-list', moduleId: 'bl_management' },
      { label: 'Bilty / GR', icon: FileText, path: '/app/documents/bilty', moduleId: 'bl_management' },
      { label: 'Air Waybill', icon: FileText, path: '/app/documents/awb', moduleId: 'bl_management' },
      { label: 'Shipping Manifest', icon: FileText, path: '/app/documents/manifest', moduleId: 'bl_management' },
    ],
  },
  {
    title: 'Customs (C&F)',
    items: [
      { label: 'GD Filing', icon: ClipboardCheck, path: '/app/customs/gd', moduleId: 'customs_gd' },
      { label: 'HS Code Lookup', icon: Package, path: '/app/customs/hs-codes', moduleId: 'customs_gd' },
      { label: 'Duty Calculator', icon: DollarSign, path: '/app/customs/duty-calculator', moduleId: 'customs_gd' },
      { label: 'Examination', icon: ClipboardCheck, path: '/app/customs/examination', moduleId: 'customs_gd' },
      { label: 'Gate Pass', icon: ClipboardCheck, path: '/app/customs/gate-pass', moduleId: 'customs_gd' },
    ],
  },
  {
    title: 'Imports',
    items: [
      { label: 'Import Index', icon: Package, path: '/app/import/index', moduleId: 'import' },
      { label: 'IGM Processing', icon: Package, path: '/app/import/igm', moduleId: 'import' },
      { label: 'Duty Assessment', icon: DollarSign, path: '/app/import/duty', moduleId: 'import' },
      { label: 'Release Orders', icon: FileText, path: '/app/import/release', moduleId: 'import' },
    ],
  },
  {
    title: 'Exports',
    items: [
      { label: 'Export Filing', icon: Globe, path: '/app/export/filing', moduleId: 'export' },
      { label: 'E-Form Processing', icon: Globe, path: '/app/export/e-form', moduleId: 'export' },
      { label: 'Shipping Bills', icon: FileText, path: '/app/export/shipping-bills', moduleId: 'export' },
    ],
  },
  {
    title: 'Transshipment',
    items: [
      { label: 'TSR Filing', icon: ArrowRightLeft, path: '/app/transshipment/tsr', moduleId: 'transshipment' },
      { label: 'Dry Port Transfer', icon: ArrowRightLeft, path: '/app/transshipment/dry-port', moduleId: 'transshipment' },
      { label: 'Seal Verification', icon: ArrowRightLeft, path: '/app/transshipment/seal', moduleId: 'transshipment' },
    ],
  },
  {
    title: 'Afghan Transit',
    items: [
      { label: 'ATTA Management', icon: MapPin, path: '/app/atta/management', moduleId: 'afghan_transit' },
      { label: 'Transit Pass', icon: MapPin, path: '/app/atta/transit-pass', moduleId: 'afghan_transit' },
      { label: 'Border Clearance', icon: MapPin, path: '/app/atta/border-clearance', moduleId: 'afghan_transit' },
      { label: 'Bonded Carriers', icon: MapPin, path: '/app/atta/bonded-carriers', moduleId: 'afghan_transit' },
    ],
  },
  {
    title: 'Local Logistics',
    items: [
      { label: 'Dispatch', icon: Box, path: '/app/local/dispatch' },
      { label: 'Route Planning', icon: Box, path: '/app/local/routes' },
      { label: 'POD Management', icon: Box, path: '/app/local/pod' },
    ],
  },
  {
    title: 'Maritime Operations',
    items: [
      { label: 'Container Tracking', icon: Anchor, path: '/app/maritime/containers' },
      { label: 'Vessel Schedule', icon: Ship, path: '/app/maritime/vessels' },
      { label: 'Port Directory', icon: Anchor, path: '/app/maritime/ports' },
    ],
  },
  {
    title: 'Air Cargo',
    items: [
      { label: 'AWB Management', icon: Plane, path: '/app/air-cargo/awb' },
      { label: 'Cargo Handling', icon: Plane, path: '/app/air-cargo/handling' },
      { label: 'Airlines', icon: Plane, path: '/app/air-cargo/airlines' },
    ],
  },
  {
    title: 'Courier Service',
    items: [
      { label: 'Shipment Booking', icon: Truck, path: '/app/courier/booking' },
      { label: 'Live Tracking', icon: Truck, path: '/app/courier/tracking' },
      { label: 'Courier Management', icon: Truck, path: '/app/courier/management' },
    ],
  },
  {
    title: 'Warehousing',
    items: [
      { label: 'Inventory', icon: Warehouse, path: '/app/warehouse/inventory', moduleId: 'warehousing' },
      { label: 'GRN / GIN', icon: Warehouse, path: '/app/warehouse/grn', moduleId: 'warehousing' },
      { label: 'Bonded Warehouse', icon: Warehouse, path: '/app/warehouse/bonded', moduleId: 'warehousing' },
    ],
  },
  {
    title: 'Asset Management',
    items: [
      { label: 'Vehicles', icon: Truck, path: '/app/fleet/vehicles' },
      { label: 'Drivers', icon: Users, path: '/app/fleet/drivers' },
    ],
  },
  {
    title: 'Finance & Accounts',
    items: [
      { label: 'Invoices', icon: DollarSign, path: '/app/finance/invoices', moduleId: 'finance' },
      { label: 'Duty Payments', icon: DollarSign, path: '/app/finance/duties', moduleId: 'finance' },
      { label: 'Demurrage', icon: DollarSign, path: '/app/finance/demurrage', moduleId: 'finance' },
      { label: 'Financial Reports', icon: BarChart3, path: '/app/finance/reports', moduleId: 'finance' },
    ],
  },
  {
    title: 'HR & Payroll',
    items: [
      { label: 'Employees', icon: Users, path: '/app/hr/employees' },
      { label: 'Payroll', icon: Users, path: '/app/hr/payroll' },
    ],
  },
  {
    title: 'Compliance',
    items: [
      { label: 'Documents', icon: Shield, path: '/app/compliance/documents' },
      { label: 'Customs Rules', icon: Shield, path: '/app/compliance/rules' },
      { label: 'Audit Trail', icon: Shield, path: '/app/compliance/audit' },
    ],
  },
  {
    title: 'Tracking & Visibility',
    items: [
      { label: 'GPS Tracking', icon: MapPin, path: '/app/tracking/gps', moduleId: 'tracking' },
      { label: 'Container Track', icon: MapPin, path: '/app/tracking/containers', moduleId: 'tracking' },
      { label: 'Milestones', icon: MapPin, path: '/app/tracking/milestones', moduleId: 'tracking' },
      { label: 'Alerts', icon: MapPin, path: '/app/tracking/alerts', moduleId: 'tracking' },
    ],
  },
  {
    title: 'Reports',
    items: [
      { label: 'Reports & Analytics', icon: BarChart3, path: '/app/reports', moduleId: 'reports' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Global Settings', icon: Settings, path: '/app/settings', moduleId: 'settings' },
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
