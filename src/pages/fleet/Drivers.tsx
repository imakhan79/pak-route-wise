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
import { Search, Plus, Users, MoreVertical, Edit, Trash2, AlertTriangle } from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";
import { useDrivers, Driver } from "@/hooks/useDrivers";
import { DriverDialog } from "@/components/fleet/DriverDialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const EXPIRY_WARNING_DAYS = 30;

const Drivers = () => {
    const { drivers, isLoading, addDriver, updateDriver, deleteDriver } = useDrivers();
    const [searchTerm, setSearchTerm] = useState("");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState<Driver | undefined>(undefined);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const filteredDrivers = drivers.filter((d) =>
        d.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.license_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (driver: Driver) => {
        setEditingDriver(driver);
        setIsDialogOpen(true);
    };

    const handleDelete = () => {
        if (deleteId) {
            deleteDriver(deleteId);
            setDeleteId(null);
        }
    };

    const handleSave = (driverData: Omit<Driver, 'id'>) => {
        if (editingDriver) {
            updateDriver(editingDriver.id, driverData);
        } else {
            addDriver(driverData);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
            case 'on_trip': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
            case 'off_duty': return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
            default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'available': return 'Available';
            case 'on_trip': return 'On Trip';
            case 'off_duty': return 'Off Duty';
            default: return status;
        }
    };

    const expiryBadge = (expiry: string | null) => {
        if (!expiry) return <span className="text-muted-foreground">—</span>;
        const days = differenceInCalendarDays(new Date(expiry), new Date());
        const label = format(new Date(expiry), 'dd MMM yyyy');
        if (days < 0) {
            return <span className="flex items-center gap-1 text-red-600 font-medium"><AlertTriangle className="h-3.5 w-3.5" />{label} (expired)</span>;
        }
        if (days <= EXPIRY_WARNING_DAYS) {
            return <span className="flex items-center gap-1 text-amber-600 font-medium"><AlertTriangle className="h-3.5 w-3.5" />{label}</span>;
        }
        return <span>{label}</span>;
    };

    const expiringSoonCount = drivers.filter((d) => {
        if (!d.license_expiry) return false;
        return differenceInCalendarDays(new Date(d.license_expiry), new Date()) <= EXPIRY_WARNING_DAYS;
    }).length;

    return (
        <MainLayout title="Driver Management" subtitle="Manage driver profiles, licenses, and availability.">
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div></div>
                <Button onClick={() => { setEditingDriver(undefined); setIsDialogOpen(true); }} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Driver
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{drivers.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Now</CardTitle>
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{drivers.filter(d => d.status === 'available').length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">License Expiring/Expired</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{expiringSoonCount}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Driver Roster</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Search name, license..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading drivers...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>License No.</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>License Expiry</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDrivers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            No drivers found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredDrivers.map((driver) => (
                                        <TableRow key={driver.id}>
                                            <TableCell className="font-medium">{driver.full_name}</TableCell>
                                            <TableCell className="font-mono">{driver.license_number}</TableCell>
                                            <TableCell>{driver.phone || '—'}</TableCell>
                                            <TableCell>{expiryBadge(driver.license_expiry)}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`${getStatusColor(driver.status)} border-0`}>
                                                    {getStatusLabel(driver.status)}
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
                                                        <DropdownMenuItem onClick={() => handleEdit(driver)}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            onClick={() => setDeleteId(driver.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
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

            <DriverDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                driver={editingDriver}
                onSave={handleSave}
            />

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Driver</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove this driver? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        </MainLayout>
    );
};

export default Drivers;
