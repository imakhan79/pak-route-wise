import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function usePortalCustomer() {
  const { currentUser } = useAuth();
  const email = currentUser?.email;

  return useQuery({
    queryKey: ['portal-customer', email],
    enabled: !!email,
    queryFn: async () => {
      const { data, error } = await supabase.from('customers').select('*').eq('email', email).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function usePortalShipments(customerId?: string) {
  return useQuery({
    queryKey: ['portal-shipments', customerId],
    enabled: !!customerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function usePortalShipment(id?: string) {
  return useQuery({
    queryKey: ['portal-shipment', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from('shipments').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
  });
}

export function usePortalDocuments(shipmentId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['portal-documents', shipmentId],
    enabled: !!shipmentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipment_documents')
        .select('*')
        .eq('shipment_id', shipmentId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const uploadDocument = useMutation({
    mutationFn: async (doc: { type: string; document_number: string; file_url: string }) => {
      const { error } = await supabase.from('shipment_documents').insert({ ...doc, shipment_id: shipmentId, status: 'pending' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-documents', shipmentId] });
      toast.success('Document uploaded');
    },
    onError: (e: any) => toast.error(`Upload failed: ${e.message}`),
  });

  return { ...query, uploadDocument: uploadDocument.mutate };
}

export function usePortalInvoices(customerId?: string) {
  return useQuery({
    queryKey: ['portal-invoices', customerId],
    enabled: !!customerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function usePortalQuotations(customerId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['portal-quotations', customerId],
    enabled: !!customerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotation_requests')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const requestQuotation = useMutation({
    mutationFn: async (q: { origin: string; destination: string; mode: string; commodity?: string; weight?: number; notes?: string }) => {
      const { error } = await supabase.from('quotation_requests').insert({ ...q, customer_id: customerId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-quotations', customerId] });
      toast.success('Quotation request submitted');
    },
    onError: (e: any) => toast.error(`Request failed: ${e.message}`),
  });

  return { ...query, requestQuotation: requestQuotation.mutate };
}

export function usePortalTickets(customerId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['portal-tickets', customerId],
    enabled: !!customerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const raiseTicket = useMutation({
    mutationFn: async (t: { subject: string; message: string; shipment_id?: string }) => {
      const { error } = await supabase.from('support_tickets').insert({ ...t, customer_id: customerId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-tickets', customerId] });
      toast.success('Support ticket submitted');
    },
    onError: (e: any) => toast.error(`Submit failed: ${e.message}`),
  });

  return { ...query, raiseTicket: raiseTicket.mutate };
}
