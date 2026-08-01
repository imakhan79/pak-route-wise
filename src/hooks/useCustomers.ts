import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Customer {
    id: string;
    name: string;
    contact_person: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    tax_id: string | null;
    credit_limit: number | null;
    payment_terms: string | null;
    is_active: boolean;
    created_at?: string;
}

export function useCustomers() {
    const queryClient = useQueryClient();

    const { data: customers = [], isLoading } = useQuery({
        queryKey: ['customers'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Fetch customers error:', error);
                toast.error('Failed to load customers');
                return [];
            }
            return data as Customer[];
        },
    });

    const addCustomerMutation = useMutation({
        mutationFn: async (customer: Omit<Customer, 'id' | 'created_at'>) => {
            const { data, error } = await supabase
                .from('customers')
                .insert(customer)
                .select()
                .single();
            if (error) throw error;
            return data as Customer;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            toast.success('Customer added');
        },
        onError: (err: any) => {
            toast.error(`Add customer failed: ${err.message}`);
        },
    });

    const updateCustomerMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Customer> }) => {
            const { error } = await supabase.from('customers').update(updates).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            toast.success('Customer updated');
        },
        onError: (err: any) => {
            toast.error(`Update failed: ${err.message}`);
        },
    });

    return {
        customers,
        isLoading,
        addCustomer: addCustomerMutation.mutate,
        updateCustomer: (id: string, updates: Partial<Customer>) =>
            updateCustomerMutation.mutate({ id, updates }),
    };
}
