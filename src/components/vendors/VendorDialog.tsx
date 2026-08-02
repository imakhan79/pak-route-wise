import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vendor } from "@/hooks/useVendors";

interface VendorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vendor?: Vendor; // If present, edit mode
    onSave: (vendor: Omit<Vendor, 'id' | 'created_at'>) => void;
}

const CATEGORIES = ['Bonded Carrier', 'Warehouse', 'Customs Agent', 'Fuel Supplier', 'Fleet Maintenance', 'Other'];

export function VendorDialog({ open, onOpenChange, vendor, onSave }: VendorDialogProps) {
    const isEdit = !!vendor;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newVendor: Omit<Vendor, 'id' | 'created_at'> = {
            name: formData.get("name") as string,
            contact_person: (formData.get("contact_person") as string) || null,
            email: (formData.get("email") as string) || null,
            phone: (formData.get("phone") as string) || null,
            address: (formData.get("address") as string) || null,
            category: (formData.get("category") as string) || null,
            tax_id: (formData.get("tax_id") as string) || null,
            payment_terms: (formData.get("payment_terms") as string) || null,
            is_active: vendor?.is_active ?? true,
        };

        onSave(newVendor);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Company Name</Label>
                        <Input id="name" name="name" defaultValue={vendor?.name} placeholder="e.g. Khyber Transporters" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="contact_person">Contact Person</Label>
                            <Input id="contact_person" name="contact_person" defaultValue={vendor?.contact_person ?? ''} placeholder="Full name" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select name="category" defaultValue={vendor?.category ?? undefined}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" defaultValue={vendor?.email ?? ''} placeholder="contact@company.com" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" defaultValue={vendor?.phone ?? ''} placeholder="+92 300 0000000" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" defaultValue={vendor?.address ?? ''} placeholder="Street, City" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="tax_id">Tax / NTN</Label>
                            <Input id="tax_id" name="tax_id" defaultValue={vendor?.tax_id ?? ''} placeholder="1234567-8" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="payment_terms">Payment Terms</Label>
                            <Input id="payment_terms" name="payment_terms" defaultValue={vendor?.payment_terms ?? ''} placeholder="Net 30" />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Save Vendor</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
