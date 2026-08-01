import { useState } from "react";
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Search, Plus, Building2, MoreVertical, Edit, Mail, Phone } from "lucide-react";
import { useCustomers, Customer } from "@/hooks/useCustomers";
import { CustomerDialog } from "@/components/customers/CustomerDialog";

const CustomerDirectory = () => {
    const { customers, isLoading, addCustomer, updateCustomer } = useCustomers();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);

    const filteredCustomers = customers.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.contact_person ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.email ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsDialogOpen(true);
    };

    const handleSave = (data: Omit<Customer, 'id' | 'created_at'>) => {
        if (editingCustomer) {
            updateCustomer(editingCustomer.id, data);
        } else {
            addCustomer(data);
        }
    };

    const toggleActive = (customer: Customer) => {
        updateCustomer(customer.id, { is_active: !customer.is_active });
    };

    return (
        <MainLayout title="Customers" subtitle="Registered customers and accounts, including self-service portal sign-ups.">
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div></div>
                <Button onClick={() => { setEditingCustomer(undefined); setIsDialogOpen(true); }} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Customer
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{customers.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{customers.filter(c => c.is_active).length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                        <div className="h-2 w-2 rounded-full bg-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{customers.filter(c => !c.is_active).length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Customer Directory</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Search name, contact, email..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading customers...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Email / Phone</TableHead>
                                    <TableHead>Payment Terms</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCustomers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            No customers found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCustomers.map((customer) => (
                                        <TableRow key={customer.id}>
                                            <TableCell className="font-medium">{customer.name}</TableCell>
                                            <TableCell>{customer.contact_person || '—'}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-0.5 text-sm">
                                                    {customer.email && <span className="flex items-center gap-1 text-muted-foreground"><Mail className="h-3 w-3" />{customer.email}</span>}
                                                    {customer.phone && <span className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" />{customer.phone}</span>}
                                                    {!customer.email && !customer.phone && '—'}
                                                </div>
                                            </TableCell>
                                            <TableCell>{customer.payment_terms || '—'}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={customer.is_active ? 'bg-green-500/10 text-green-500 border-0' : 'bg-gray-500/10 text-gray-500 border-0'}>
                                                    {customer.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEdit(customer)}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toggleActive(customer)}>
                                                            {customer.is_active ? 'Deactivate' : 'Reactivate'}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <CustomerDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                customer={editingCustomer}
                onSave={handleSave}
            />
        </div>
        </MainLayout>
    );
};

export default CustomerDirectory;
