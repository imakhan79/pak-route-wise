import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Driver } from "@/hooks/useDrivers";

interface DriverDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    driver?: Driver; // If present, edit mode
    onSave: (driver: Omit<Driver, 'id'>) => void;
}

export function DriverDialog({ open, onOpenChange, driver, onSave }: DriverDialogProps) {
    const isEdit = !!driver;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newDriver: Omit<Driver, 'id'> = {
            full_name: formData.get("full_name") as string,
            license_number: formData.get("license_number") as string,
            license_expiry: (formData.get("license_expiry") as string) || null,
            phone: (formData.get("phone") as string) || null,
            status: formData.get("status") as Driver['status'],
        };

        onSave(newDriver);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Driver" : "Add New Driver"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                            id="full_name"
                            name="full_name"
                            defaultValue={driver?.full_name}
                            placeholder="e.g. Ahmed Ali"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="license_number">License No.</Label>
                            <Input
                                id="license_number"
                                name="license_number"
                                defaultValue={driver?.license_number}
                                placeholder="LIC-12345"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                defaultValue={driver?.phone ?? ''}
                                placeholder="+92 300 0000000"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="license_expiry">License Expiry</Label>
                            <Input
                                id="license_expiry"
                                name="license_expiry"
                                type="date"
                                defaultValue={driver?.license_expiry ?? ''}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" defaultValue={driver?.status || "available"}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="on_trip">On Trip</SelectItem>
                                    <SelectItem value="off_duty">Off Duty</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Save Driver</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
