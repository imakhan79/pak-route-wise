import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'overdue';

export interface Invoice {
    id: string;
    shipment_id: string | null;
    customer_id: string | null;
    customer_name: string;
    amount: number;
    status: InvoiceStatus;
    due_date: string | null;
    created_at: string;
}

// Same real `invoices` table the customer portal already reads (usePortalInvoices) —
// this is the staff-facing view over the same rows, not a separate dataset.
export function useInvoices() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: invoices = [], isLoading } = useQuery({
        queryKey: ['invoices'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('invoices')
                .select('*, customers(name)')
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Fetch invoices error:', error);
                toast.error('Failed to load invoices');
                return [];
            }
            return (data as any[]).map((row) => ({
                id: row.id,
                shipment_id: row.shipment_id,
                customer_id: row.customer_id,
                customer_name: row.customers?.name || 'Unknown Customer',
                amount: Number(row.amount) || 0,
                status: (row.status || 'draft') as InvoiceStatus,
                due_date: row.due_date,
                created_at: row.created_at,
            })) as Invoice[];
        },
    });

    const filteredInvoices = useMemo(() => {
        if (!searchTerm) return invoices;
        const term = searchTerm.toLowerCase();
        return invoices.filter((inv) =>
            inv.customer_name.toLowerCase().includes(term) || inv.id.toLowerCase().includes(term)
        );
    }, [invoices, searchTerm]);

    const stats = useMemo(() => ({
        totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
        pending: invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0),
        count: invoices.length,
    }), [invoices]);

    const addInvoiceMutation = useMutation({
        mutationFn: async (invoice: { customer_id: string; amount: number; due_date: string | null; shipment_id?: string | null }) => {
            const { data, error } = await supabase
                .from('invoices')
                .insert({
                    customer_id: invoice.customer_id,
                    amount: invoice.amount,
                    due_date: invoice.due_date,
                    shipment_id: invoice.shipment_id || null,
                    status: 'issued',
                })
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['portal-invoices'] });
            toast.success('Invoice generated');
        },
        onError: (err: any) => {
            toast.error(`Create invoice failed: ${err.message}`);
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: InvoiceStatus }) => {
            const { error } = await supabase.from('invoices').update({ status }).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['portal-invoices'] });
            toast.success('Invoice updated');
        },
        onError: (err: any) => {
            toast.error(`Update failed: ${err.message}`);
        },
    });

    return {
        invoices: filteredInvoices,
        allInvoices: invoices,
        isLoading,
        stats,
        searchTerm,
        setSearchTerm,
        addInvoice: addInvoiceMutation.mutate,
        updateStatus: (id: string, status: InvoiceStatus) => updateStatusMutation.mutate({ id, status }),
    };
}
