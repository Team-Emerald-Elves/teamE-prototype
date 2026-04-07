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
import {useState} from "react";
type EditEmployeeRequest = {
    id: string,
    uname?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    role?: string,
}

async function updateEmployee(body: EditEmployeeRequest) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/edit-employee`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update employee (status ${res.status}): ${errorText}`);
    }
    return res.json();
}
function EmployeeForm() {

    const [user, setUser] = useState({
        firstname: "John",
        lastname: "Doe",
        username: "johndoe",
        password: "password",
        email: "johndoe@example.com",
        role: "Underwriter",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };
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
                            <label className="w-24 text-right font-bold">First Name: </label>
                            <Input
                                name="firstname"
                                value={user.firstname}
                                onChange={handleChange}
                                disabled={false}
                                className="mt-1"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-24 text-right font-bold">Last Name: </label>
                            <Input
                                name="lastname"
                                value={user.lastname}
                                onChange={handleChange}
                                disabled={false}
                                className="mt-1"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-24 text-right font-bold">Username: </label>
                            <Input
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                disabled={false}
                                className="mt-1"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-24 text-right font-bold">Email: </label>
                            <Input
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                disabled={false}
                                className="mt-1"
                            />
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
                                        <SelectItem value="Admin">Admin</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </FieldGroup>
                    <DialogFooter className="mt-4 justify-end gap-2">
                        <DialogClose render={<Button variant="secondary">Cancel</Button>} />
                        <DialogClose render={
                        <Button onClick={async () => {
                            const bodyData: EditEmployeeRequest = {
                                id: "dummyIDfromAuth",
                                uname: user.username,
                                email: user.email,
                                firstName: user.firstname,
                                lastName: user.lastname,
                                role: user.role,
                            };
                            try {
                                await updateEmployee(bodyData);
                                console.log("Employee updated successfully");
                            } catch (err) {
                                console.error(err);
                                console.log("Failed to update employee");
                            }
                        }}>
                            Save
                        </Button> }/>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
export default EmployeeForm;
