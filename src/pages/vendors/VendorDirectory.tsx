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
import { Search, Plus, Truck, MoreVertical, Edit, Mail, Phone } from "lucide-react";
import { useVendors, Vendor } from "@/hooks/useVendors";
import { VendorDialog } from "@/components/vendors/VendorDialog";

const VendorDirectory = () => {
    const { vendors, isLoading, addVendor, updateVendor } = useVendors();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<Vendor | undefined>(undefined);

    const filteredVendors = vendors.filter((v) =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.contact_person ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.category ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (vendor: Vendor) => {
        setEditingVendor(vendor);
        setIsDialogOpen(true);
    };

    const handleSave = (data: Omit<Vendor, 'id' | 'created_at'>) => {
        if (editingVendor) {
            updateVendor(editingVendor.id, data);
        } else {
            addVendor(data);
        }
    };

    const toggleActive = (vendor: Vendor) => {
        updateVendor(vendor.id, { is_active: !vendor.is_active });
    };

    return (
        <MainLayout title="Vendors" subtitle="Bonded carriers, warehouses, customs agents, and other suppliers.">
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div></div>
                <Button onClick={() => { setEditingVendor(undefined); setIsDialogOpen(true); }} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Vendor
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vendors.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vendors.filter(v => v.is_active).length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                        <div className="h-2 w-2 rounded-full bg-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vendors.filter(v => !v.is_active).length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Vendor Directory</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Search name, contact, category..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading vendors...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Email / Phone</TableHead>
                                    <TableHead>Terms</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredVendors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                            No vendors found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredVendors.map((vendor) => (
                                        <TableRow key={vendor.id}>
                                            <TableCell className="font-medium">{vendor.name}</TableCell>
                                            <TableCell>{vendor.category ? <Badge variant="outline">{vendor.category}</Badge> : '—'}</TableCell>
                                            <TableCell>{vendor.contact_person || '—'}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-0.5 text-sm">
                                                    {vendor.email && <span className="flex items-center gap-1 text-muted-foreground"><Mail className="h-3 w-3" />{vendor.email}</span>}
                                                    {vendor.phone && <span className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" />{vendor.phone}</span>}
                                                    {!vendor.email && !vendor.phone && '—'}
                                                </div>
                                            </TableCell>
                                            <TableCell>{vendor.payment_terms || '—'}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={vendor.is_active ? 'bg-green-500/10 text-green-500 border-0' : 'bg-gray-500/10 text-gray-500 border-0'}>
                                                    {vendor.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" aria-label="Vendor actions">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEdit(vendor)}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toggleActive(vendor)}>
                                                            {vendor.is_active ? 'Deactivate' : 'Reactivate'}
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

            <VendorDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                vendor={editingVendor}
                onSave={handleSave}
            />
        </div>
        </MainLayout>
    );
};

export default VendorDirectory;
