import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Vendor {
    id: string;
    name: string;
    contact_person: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    category: string | null;
    tax_id: string | null;
    payment_terms: string | null;
    is_active: boolean;
    created_at?: string;
}

export function useVendors() {
    const queryClient = useQueryClient();

    const { data: vendors = [], isLoading } = useQuery({
        queryKey: ['vendors'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('vendors')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Fetch vendors error:', error);
                toast.error('Failed to load vendors');
                return [];
            }
            return data as Vendor[];
        },
    });

    const addVendorMutation = useMutation({
        mutationFn: async (vendor: Omit<Vendor, 'id' | 'created_at'>) => {
            const { data, error } = await supabase
                .from('vendors')
                .insert(vendor)
                .select()
                .single();
            if (error) throw error;
            return data as Vendor;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendors'] });
            toast.success('Vendor added');
        },
        onError: (err: any) => {
            toast.error(`Add vendor failed: ${err.message}`);
        },
    });

    const updateVendorMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Vendor> }) => {
            const { error } = await supabase.from('vendors').update(updates).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendors'] });
            toast.success('Vendor updated');
        },
        onError: (err: any) => {
            toast.error(`Update failed: ${err.message}`);
        },
    });

    return {
        vendors,
        isLoading,
        addVendor: addVendorMutation.mutate,
        updateVendor: (id: string, updates: Partial<Vendor>) =>
            updateVendorMutation.mutate({ id, updates }),
    };
}
