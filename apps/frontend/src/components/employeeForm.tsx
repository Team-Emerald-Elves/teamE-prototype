import '../App.css'
import {HugeiconsIcon} from "@hugeicons/react"
import { Edit03Icon } from "@hugeicons/core-free-icons";

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
import { type JSX, useState} from "react";

type EditEmployeeRequest = {
    id: string,
    uname?: string ,
    first_name?: string,
    last_name?: string,
    email?: string,
    roles?: string[],
}

type Employee = {
    id: string;
    first_name: string;
    last_name: string;
    uname: string;
    email?: string;
    roles?: string[];
};

type empProps = {
    employee?: Employee;
}

async function updateEmployee(body: EditEmployeeRequest) {
    console.log(body)
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
function EmployeeForm(props: empProps): JSX.Element {
    const employee = props.employee;
    const [user, setUser] = useState({
        firstname: employee!.first_name,
        lastname: employee!.last_name,
        username: employee!.uname,
        // password: "password",
        email: employee!.email,
        role: employee!.roles ? employee!.roles.at(0) : "None",
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
                    <DialogTrigger render={<Button variant="outline" size="icon" className="px-4 py-3 text-base bg-secondary text-secondary-foreground"><HugeiconsIcon icon={Edit03Icon} size={20} /></Button>} />
                </div>
                <DialogContent className="lg:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-primary font-sans font-bold">Edit Employee</DialogTitle>
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
                            <Label htmlFor="role" className="w-22 text-right font-bold">Select Roles:</Label>
                            <Select id="role" onValueChange={(value: string | null) =>
                                setUser({ ...user, role: value ?? "" })
                            }>
                                <SelectTrigger>
                                    <SelectValue placeholder={user.role} />
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
                            const array: string[] | undefined = user.role ? [user.role] : undefined
                            const bodyData: EditEmployeeRequest = {
                                id: employee!.id,
                                uname: user.username,
                                email: user.email ? user.email : undefined,
                                first_name: user.firstname,
                                last_name: user.lastname,
                                roles: array,
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
