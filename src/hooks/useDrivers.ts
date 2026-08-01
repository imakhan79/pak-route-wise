import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Driver {
    id: string;
    full_name: string;
    license_number: string;
    license_expiry: string | null;
    phone: string | null;
    status: 'available' | 'on_trip' | 'off_duty';
}

export function useDrivers() {
    const queryClient = useQueryClient();

    const { data: drivers = [], isLoading } = useQuery({
        queryKey: ['drivers'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('drivers')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Fetch drivers error:', error);
                toast.error('Failed to load drivers');
                return [];
            }
            return data as Driver[];
        },
    });

    const addDriverMutation = useMutation({
        mutationFn: async (driver: Omit<Driver, 'id'>) => {
            const { data, error } = await supabase
                .from('drivers')
                .insert(driver)
                .select()
                .single();
            if (error) throw error;
            return data as Driver;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drivers'] });
            toast.success('Driver added');
        },
        onError: (err: any) => {
            toast.error(`Add driver failed: ${err.message}`);
        },
    });

    const updateDriverMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Driver> }) => {
            const { error } = await supabase.from('drivers').update(updates).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drivers'] });
            toast.success('Driver updated');
        },
        onError: (err: any) => {
            toast.error(`Update failed: ${err.message}`);
        },
    });

    const deleteDriverMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('drivers').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drivers'] });
            toast.success('Driver removed');
        },
        onError: (err: any) => {
            toast.error(`Delete failed: ${err.message}`);
        },
    });

    return {
        drivers,
        isLoading,
        addDriver: addDriverMutation.mutate,
        updateDriver: (id: string, updates: Partial<Driver>) =>
            updateDriverMutation.mutate({ id, updates }),
        deleteDriver: deleteDriverMutation.mutate,
    };
}
