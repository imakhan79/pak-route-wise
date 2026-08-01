import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Customer } from "@/hooks/useCustomers";

interface CustomerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customer?: Customer; // If present, edit mode
    onSave: (customer: Omit<Customer, 'id' | 'created_at'>) => void;
}

export function CustomerDialog({ open, onOpenChange, customer, onSave }: CustomerDialogProps) {
    const isEdit = !!customer;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const creditLimit = formData.get("credit_limit") as string;

        const newCustomer: Omit<Customer, 'id' | 'created_at'> = {
            name: formData.get("name") as string,
            contact_person: (formData.get("contact_person") as string) || null,
            email: (formData.get("email") as string) || null,
            phone: (formData.get("phone") as string) || null,
            address: (formData.get("address") as string) || null,
            tax_id: (formData.get("tax_id") as string) || null,
            credit_limit: creditLimit ? parseFloat(creditLimit) : null,
            payment_terms: (formData.get("payment_terms") as string) || null,
            is_active: customer?.is_active ?? true,
        };

        onSave(newCustomer);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Customer" : "Add New Customer"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Company Name</Label>
                        <Input id="name" name="name" defaultValue={customer?.name} placeholder="e.g. Al-Falah Trading Co." required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="contact_person">Contact Person</Label>
                            <Input id="contact_person" name="contact_person" defaultValue={customer?.contact_person ?? ''} placeholder="Full name" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" defaultValue={customer?.phone ?? ''} placeholder="+92 300 0000000" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" defaultValue={customer?.email ?? ''} placeholder="contact@company.com" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" defaultValue={customer?.address ?? ''} placeholder="Street, City" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="tax_id">Tax / NTN</Label>
                            <Input id="tax_id" name="tax_id" defaultValue={customer?.tax_id ?? ''} placeholder="1234567-8" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="credit_limit">Credit Limit</Label>
                            <Input id="credit_limit" name="credit_limit" type="number" step="0.01" defaultValue={customer?.credit_limit ?? ''} placeholder="0.00" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="payment_terms">Terms</Label>
                            <Input id="payment_terms" name="payment_terms" defaultValue={customer?.payment_terms ?? ''} placeholder="Net 30" />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Save Customer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
