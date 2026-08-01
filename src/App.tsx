import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, roles } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = roles.find(r => r.id === currentUser.roleId);
  if (role?.name === 'Customer') {
    return <Navigate to="/portal" replace />;
  }

  return <>{children}</>;
}

function PortalRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, roles } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = roles.find(r => r.id === currentUser.roleId);
  if (role?.name !== 'Customer') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

import DashboardRouter from "./pages/dashboards/DashboardRouter";
import RoadFreight from "./pages/freight/RoadFreight";
import SeaFreight from "./pages/freight/SeaFreight";
import AirFreight from "./pages/freight/AirFreight";
import RailFreight from "./pages/freight/RailFreight";
import RateCalculator from "./pages/freight/RateCalculator";
import GDFiling from "./pages/customs/GDFiling";
import HSCodeLookup from "./pages/customs/HSCodeLookup";
import Examination from "./pages/customs/Examination";
import DutyAssessment from "./pages/import/DutyAssessment";
import ImportIndex from "./pages/import/ImportIndex";
import IGMManagement from "./pages/import/IGMManagement";
import ReleaseOrders from "./pages/import/ReleaseOrders";
import BillOfLading from "./pages/documents/BillOfLading";
import PackingList from "./pages/documents/PackingList";
import DesignSystem from "./pages/DesignSystem";

import Manifest from "./pages/documents/Manifest";
import AirWaybill from "./pages/documents/AirWaybill";
import Bilty from "./pages/documents/Bilty";
import NotFound from "./pages/NotFound";
import ExportFiling from "./pages/export/ExportFiling";
import EFormManagement from "./pages/export/EFormManagement";
import ShippingBills from "./pages/export/ShippingBills";
import TSRFiling from "./pages/transshipment/TSRFiling";
import DryPortTransfer from "./pages/transshipment/DryPortTransfer";
import SealVerification from "./pages/transshipment/SealVerification";
import ATTAManagement from "./pages/atta/ATTAManagement";
import TransitPass from "./pages/atta/TransitPass";
import BorderClearance from "./pages/atta/BorderClearance";
import BondedCarriers from "./pages/atta/BondedCarriers";
import Dispatch from "./pages/local/Dispatch";
import RoutePlanning from "./pages/local/RoutePlanning";
import PODManagement from "./pages/local/PODManagement";
import Inventory from "./pages/warehouse/Inventory";
import GRNGIN from "./pages/warehouse/GRNGIN";
import BondedWarehouse from "./pages/warehouse/BondedWarehouse";
import ContainerTracking from "./pages/maritime/ContainerTracking";
import VesselSchedule from "./pages/maritime/VesselSchedule";
import PortDirectory from "./pages/maritime/PortDirectory";
import Vehicles from "./pages/fleet/Vehicles";
import Invoices from "./pages/finance/Invoices";
import DutyPayments from "./pages/finance/DutyPayments";
import Demurrage from "./pages/finance/Demurrage";
import FinancialReports from "./pages/finance/FinancialReports";
import DocumentsManager from "./pages/compliance/DocumentsManager";
import CustomsRules from "./pages/compliance/CustomsRules";
import AuditTrail from "./pages/compliance/AuditTrail";
import SettingsLayout from "./pages/settings/SettingsLayout";
import EmployeeManagement from "./pages/hr/EmployeeManagement";
import PayrollManagement from "./pages/hr/PayrollManagement";
import OperationsWorkflow from "./pages/OperationsWorkflow";
import CourierBooking from "./pages/courier/CourierBooking";
import CourierTracking from "./pages/courier/CourierTracking";
import CourierManagement from "./pages/courier/CourierManagement";
import GPSTracking from "./pages/tracking/GPSTracking";
import DriverTracker from "./pages/tracking/DriverTracker";
import Home from "./pages/marketing/Home";
import Register from "./pages/portal/Register";
import ConfirmEmail from "./pages/portal/ConfirmEmail";
import PortalDashboard from "./pages/portal/Dashboard";
import MyShipments from "./pages/portal/MyShipments";
import ShipmentDetail from "./pages/portal/ShipmentDetail";
import RequestQuotation from "./pages/portal/RequestQuotation";
import PortalInvoices from "./pages/portal/Invoices";
import Support from "./pages/portal/Support";
import Profile from "./pages/portal/Profile";
import ModulePlaceholder from "./pages/ModulePlaceholder";



const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/track/:vehicleId" element={<DriverTracker />} />
            <Route path="/portal/register" element={<Register />} />
            <Route path="/portal/confirm" element={<ConfirmEmail />} />
            <Route path="/portal" element={<PortalRoute><PortalDashboard /></PortalRoute>} />
            <Route path="/portal/shipments" element={<PortalRoute><MyShipments /></PortalRoute>} />
            <Route path="/portal/shipments/:id" element={<PortalRoute><ShipmentDetail /></PortalRoute>} />
            <Route path="/portal/quotation" element={<PortalRoute><RequestQuotation /></PortalRoute>} />
            <Route path="/portal/invoices" element={<PortalRoute><PortalInvoices /></PortalRoute>} />
            <Route path="/portal/support" element={<PortalRoute><Support /></PortalRoute>} />
            <Route path="/portal/profile" element={<PortalRoute><Profile /></PortalRoute>} />

            <Route path="/*" element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/" element={<DashboardRouter />} />

                  {/* Freight Management */}
                  <Route path="/freight/road" element={<RoadFreight />} />
                  <Route path="/freight/sea" element={<SeaFreight />} />
                  <Route path="/freight/air" element={<AirFreight />} />
                  <Route path="/freight/rail" element={<RailFreight />} />
                  <Route path="/freight/calculator" element={<RateCalculator />} />

                  {/* Documents */}
                  <Route path="/documents/bl" element={<BillOfLading />} />
                  <Route path="/documents/packing-list" element={<PackingList />} />
                  <Route path="/documents/bilty" element={<Bilty />} />
                  <Route path="/documents/awb" element={<AirWaybill />} />
                  <Route path="/documents/manifest" element={<Manifest />} />

                  {/* Customs */}
                  <Route path="/customs/gd" element={<GDFiling />} />
                  <Route path="/customs/hs-codes" element={<HSCodeLookup />} />
                  <Route path="/customs/duty-calculator" element={<ModulePlaceholder title="Duty Calculator" subtitle="Estimate customs duties and taxes" />} />
                  <Route path="/customs/examination" element={<Examination />} />
                  <Route path="/customs/gate-pass" element={<ModulePlaceholder title="Gate Pass" subtitle="Issue and manage terminal gate passes" />} />

                  {/* Import */}
                  <Route path="/import/index" element={<ImportIndex />} />
                  <Route path="/import/igm" element={<IGMManagement />} />
                  <Route path="/import/duty" element={<DutyAssessment />} />
                  <Route path="/import/release" element={<ReleaseOrders />} />

                  {/* Export */}

                  <Route path="/export/filing" element={<ExportFiling />} />
                  <Route path="/export/e-form" element={<EFormManagement />} />
                  <Route path="/export/shipping-bills" element={<ShippingBills />} />

                  {/* Transshipment */}
                  <Route path="/transshipment/tsr" element={<TSRFiling />} />
                  <Route path="/transshipment/dry-port" element={<DryPortTransfer />} />
                  <Route path="/transshipment/seal" element={<SealVerification />} />

                  {/* Afghan Transit */}
                  <Route path="/atta/management" element={<ATTAManagement />} />
                  <Route path="/atta/transit-pass" element={<TransitPass />} />
                  <Route path="/atta/border-clearance" element={<BorderClearance />} />
                  <Route path="/atta/bonded-carriers" element={<BondedCarriers />} />

                  {/* Local Trade */}
                  <Route path="/local/dispatch" element={<Dispatch />} />
                  <Route path="/local/routes" element={<RoutePlanning />} />
                  <Route path="/local/pod" element={<PODManagement />} />

                  {/* Warehouse */}
                  <Route path="/warehouse/inventory" element={<Inventory />} />
                  <Route path="/warehouse/grn" element={<GRNGIN />} />
                  <Route path="/warehouse/bonded" element={<BondedWarehouse />} />

                  {/* Fleet */}
                  <Route path="/fleet/vehicles" element={<Vehicles />} />

                  {/* Courier Service */}
                  <Route path="/courier/booking" element={<CourierBooking />} />
                  <Route path="/courier/tracking" element={<CourierTracking />} />
                  <Route path="/courier/management" element={<CourierManagement />} />


                  {/* Air Cargo */}
                  <Route path="/air-cargo/awb" element={<ModulePlaceholder title="AWB Management" subtitle="Manage Air Waybills for air cargo shipments" />} />
                  <Route path="/air-cargo/handling" element={<ModulePlaceholder title="Cargo Handling" subtitle="Track air cargo handling and warehousing" />} />
                  <Route path="/air-cargo/airlines" element={<ModulePlaceholder title="Airlines" subtitle="Manage airline partners and schedules" />} />

                  {/* Maritime */}
                  <Route path="/maritime/containers" element={<ContainerTracking />} />
                  <Route path="/maritime/vessels" element={<VesselSchedule />} />
                  <Route path="/maritime/ports" element={<PortDirectory />} />

                  {/* Finance */}
                  <Route path="/finance/invoices" element={<Invoices />} />
                  <Route path="/finance/duties" element={<DutyPayments />} />
                  <Route path="/finance/demurrage" element={<Demurrage />} />
                  <Route path="/finance/reports" element={<FinancialReports />} />

                  {/* Compliance */}
                  <Route path="/compliance/documents" element={<DocumentsManager />} />
                  <Route path="/compliance/rules" element={<CustomsRules />} />
                  <Route path="/compliance/audit" element={<AuditTrail />} />

                  {/* Tracking */}
                  <Route path="/tracking/gps" element={<GPSTracking />} />
                  <Route path="/tracking/containers" element={<ContainerTracking />} />
                  <Route path="/tracking/milestones" element={<ModulePlaceholder title="Milestones" subtitle="Shipment milestone tracking timeline" />} />
                  <Route path="/tracking/alerts" element={<ModulePlaceholder title="Alerts" subtitle="Live exception and delay alerts" />} />

                  {/* HR Management */}
                  <Route path="/hr/employees" element={<EmployeeManagement />} />
                  <Route path="/hr/payroll" element={<PayrollManagement />} />

                  {/* Reports & Settings */}
                  <Route path="/reports" element={<FinancialReports />} />
                  <Route path="/design-system" element={<DesignSystem />} />
                  <Route path="/settings" element={<SettingsLayout />} />

                  <Route path="/operations/workflow" element={<OperationsWorkflow />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
