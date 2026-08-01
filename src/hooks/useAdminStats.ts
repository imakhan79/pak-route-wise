import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [customers, shipments, invoices, vehicles, drivers] = await Promise.all([
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase.from('shipments').select('id, status, container_number'),
        supabase.from('invoices').select('id, amount, status, created_at'),
        supabase.from('vehicles').select('id', { count: 'exact', head: true }),
        supabase.from('drivers').select('id', { count: 'exact', head: true }),
      ]);

      const shipmentRows = shipments.data || [];
      const invoiceRows = invoices.data || [];
      const today = new Date().toISOString().slice(0, 10);

      const byStatus = (status: string) => shipmentRows.filter((s) => s.status === status).length;
      const revenueToday = invoiceRows.filter((i) => i.created_at?.startsWith(today)).reduce((sum, i) => sum + Number(i.amount), 0);
      const revenueMonth = invoiceRows.reduce((sum, i) => sum + Number(i.amount), 0);

      return {
        totalCustomers: customers.count || 0,
        totalVehicles: vehicles.count || 0,
        totalDrivers: drivers.count || 0,
        totalShipments: shipmentRows.length,
        pendingShipments: byStatus('pending') + byStatus('approved'),
        completedShipments: byStatus('delivered'),
        containers: new Set(shipmentRows.map((s) => s.container_number).filter(Boolean)).size,
        totalInvoices: invoiceRows.length,
        paymentsReceived: invoiceRows.filter((i) => i.status === 'paid').length,
        revenueToday,
        revenueMonth,
        statusBreakdown: [
          { name: 'Pending', value: byStatus('pending') },
          { name: 'In Transit', value: byStatus('in_transit') },
          { name: 'Cleared', value: byStatus('cleared') },
          { name: 'Delivered', value: byStatus('delivered') },
          { name: 'Hold', value: byStatus('customs_hold') },
        ],
      };
    },
  });
}
