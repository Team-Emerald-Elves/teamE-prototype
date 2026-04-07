import '../App.css'
import { Edit03Icon } from 'hugeicons-react';

import { Button } from './ui/button.tsx'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {FieldGroup} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function EmployeeForm() {
    return (
        <Dialog>
            <form>
                <div className="flex justify-end">
                    <DialogTrigger render={<Button variant="outline" size="icon" className="px-4 py-3 text-base bg-secondary text-secondary-foreground"><Edit03Icon size={20} /></Button>} />
                </div>
                <DialogContent className="lg:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-primary font-mono font-bold">Edit Employee</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        <div className="flex items-center gap-4">
                            <Label htmlFor="fname" className="w-24 text-right font-bold">First Name:</Label>
                            <Input id="fname" name="fname" placeholder="First Name" />
                        </div>
                        <div className="flex items-center gap-4">
                            <Label htmlFor="lname" className="w-24 text-right font-bold">Last Name:</Label>
                            <Input id="lname" name="lname" placeholder="Last Name" />
                        </div>
                        <div className="flex items-center gap-4">
                            <Label htmlFor="user" className="w-24 text-right font-bold">Username:</Label>
                            <Input id="user" name="user" placeholder="Username" />
                        </div>
                        <div className="flex items-center gap-4">
                            <Label htmlFor="employeeId" className="w-24 text-right font-bold">Employee ID:</Label>
                            <Input id="employeeId" name="employeeId" placeholder="Employee ID" />
                        </div>
                        <div className="flex items-center gap-4">
                            <Label htmlFor="email" className="w-24 text-right font-bold">Email:</Label>
                            <Input id="email" name="email" placeholder="Email" />
                        </div>
                        <div className="flex items-center gap-4">
                            <Label htmlFor="contentOwner" className="w-22 text-right font-bold">Select Roles:</Label>
                            <Select id="contentOwner">
                                <SelectTrigger>
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Roles</SelectLabel>
                                        <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                                        <SelectItem value="Underwriter">Underwriter</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </FieldGroup>
                    <DialogFooter className="mt-4 justify-end gap-2">
                        <DialogClose render={<Button variant="outline">Cancel</Button>} />
                        <Button type="submit" className="bg-secondary text-background p-3">Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
export default EmployeeForm;
