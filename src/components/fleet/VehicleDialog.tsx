import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vehicle } from "@/hooks/useVehicles";

interface VehicleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vehicle?: Vehicle; // If present, edit mode
    onSave: (vehicle: Omit<Vehicle, 'id'>) => void;
}

export function VehicleDialog({ open, onOpenChange, vehicle, onSave }: VehicleDialogProps) {
    const isEdit = !!vehicle;

    // Simple form handling. For production, Zod + React Hook Form is better, keeping it simple here.
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const capacityWeight = formData.get("capacity_weight") as string;
        const capacityVolume = formData.get("capacity_volume") as string;
        const fitnessExpiry = formData.get("fitness_expiry") as string;
        const insuranceExpiry = formData.get("insurance_expiry") as string;

        const newVehicle: Omit<Vehicle, 'id'> = {
            registration_number: formData.get("registration_number") as string,
            type: (formData.get("type") as string) || null,
            capacity_weight: capacityWeight ? parseFloat(capacityWeight) : null,
            capacity_volume: capacityVolume ? parseFloat(capacityVolume) : null,
            status: formData.get("status") as Vehicle['status'],
            fitness_expiry: fitnessExpiry || null,
            insurance_expiry: insuranceExpiry || null,
        };

        onSave(newVehicle);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="registration_number">Registration No.</Label>
                            <Input
                                id="registration_number"
                                name="registration_number"
                                defaultValue={vehicle?.registration_number}
                                placeholder="ABC-123"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <Input
                                id="type"
                                name="type"
                                defaultValue={vehicle?.type ?? ''}
                                placeholder="Truck, Trailer..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="capacity_weight">Capacity (tons)</Label>
                            <Input
                                id="capacity_weight"
                                name="capacity_weight"
                                type="number"
                                step="0.01"
                                defaultValue={vehicle?.capacity_weight ?? ''}
                                placeholder="20"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="capacity_volume">Capacity (m³)</Label>
                            <Input
                                id="capacity_volume"
                                name="capacity_volume"
                                type="number"
                                step="0.01"
                                defaultValue={vehicle?.capacity_volume ?? ''}
                                placeholder="40"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="fitness_expiry">Fitness Expiry</Label>
                            <Input
                                id="fitness_expiry"
                                name="fitness_expiry"
                                type="date"
                                defaultValue={vehicle?.fitness_expiry ?? ''}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="insurance_expiry">Insurance Expiry</Label>
                            <Input
                                id="insurance_expiry"
                                name="insurance_expiry"
                                type="date"
                                defaultValue={vehicle?.insurance_expiry ?? ''}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={vehicle?.status || "available"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="in_transit">In Transit</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Save Vehicle</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
