import React, { useState } from "react";
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, FileText, DollarSign, CreditCard } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ExportActions from "@/components/common/ExportActions";
import { useInvoices, InvoiceStatus } from "@/hooks/useInvoices";
import { useCustomers } from "@/hooks/useCustomers";

const STATUS_LABEL: Record<InvoiceStatus, string> = {
    draft: 'Draft',
    issued: 'Issued',
    paid: 'Paid',
    overdue: 'Overdue',
};

const Invoices = () => {
    const { invoices, isLoading, stats, searchTerm, setSearchTerm, addInvoice, updateStatus } = useInvoices();
    const { customers } = useCustomers();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleCreateInvoice = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        addInvoice({
            customer_id: formData.get("customer_id") as string,
            amount: Number(formData.get("amount")),
            due_date: (formData.get("dueDate") as string) || null,
        });
        setIsCreateOpen(false);
        e.currentTarget.reset();
    };

    return (
        <MainLayout title="Invoices" subtitle="Manage client billing and payment tracking — shared with the customer portal.">
            <div className="space-y-6 animate-slide-up">
                <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <ExportActions
                            data={invoices}
                            fileName="invoices_export"
                            columnMapping={{
                                customer_name: "Customer",
                                amount: "Amount (PKR)",
                                status: "Status",
                            }}
                        />
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" /> Create Invoice
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>New Invoice</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateInvoice} className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="customer_id">Customer</Label>
                                        <Select name="customer_id" required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select customer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {customers.map((c) => (
                                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="amount">Amount (PKR)</Label>
                                            <Input id="amount" name="amount" type="number" step="0.01" min="0" placeholder="0.00" required />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="dueDate">Due Date</Label>
                                            <Input id="dueDate" name="dueDate" type="date" required />
                                        </div>
                                    </div>
                                    <Button type="submit">Generate Invoice</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue (Paid)</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Rs. {stats.totalRevenue.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                            <CreditCard className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">Rs. {stats.pending.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Invoices Issued</CardTitle>
                            <FileText className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.count}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-md">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Invoices</CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    type="search"
                                    placeholder="Search customer..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8 text-muted-foreground">Loading invoices...</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                                No invoices found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        invoices.map((inv) => (
                                            <TableRow key={inv.id}>
                                                <TableCell className="font-mono text-xs">{inv.id.slice(0, 8)}</TableCell>
                                                <TableCell className="font-medium">{inv.customer_name}</TableCell>
                                                <TableCell>{inv.due_date || '—'}</TableCell>
                                                <TableCell>Rs. {inv.amount.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        inv.status === "paid" ? "default" :
                                                            inv.status === "overdue" ? "destructive" : "secondary"
                                                    } className={inv.status === "paid" ? "bg-green-600" : ""}>
                                                        {STATUS_LABEL[inv.status]}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {inv.status !== 'paid' && (
                                                        <Button variant="ghost" size="sm" onClick={() => updateStatus(inv.id, 'paid')}>
                                                            Mark Paid
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
};

export default Invoices;
