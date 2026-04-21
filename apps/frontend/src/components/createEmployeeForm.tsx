import '../App.css'
import { useState } from 'react'

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
import { FieldGroup, Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {PlusSignIcon} from "@hugeicons/core-free-icons";
import {HugeiconsIcon} from "@hugeicons/react";
import ConfirmationPopup from "@/components/EmployeeConfirmationPopup.tsx";

type CreateEmployeeRequest = {
    uname?: string,
    first_name?: string,
    last_name?: string,
    email?: string,
    roles?: string[],
}

async function createEmployee(body: CreateEmployeeRequest) {
    console.log(body)
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/create-employee`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to create employee (status ${res.status}): ${errorText}`);
    }

    return res;
}

function CreateEmployeeForm() {

    const [user, setUser] = useState({
        fname: "",
        lname: "",
        username: "",
        email: "",
        roles: "",
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
                <div className="flex justify-end w-full">
                    <DialogTrigger
                        render={
                            <Button className="ml-auto px-4 py-4 text-base bg-[#5f935a] text-secondary-foreground">
                                <HugeiconsIcon icon={PlusSignIcon} /> Create Employee
                            </Button>
                        }
                    />
                </div>

                <DialogContent className="lg:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-primary font-mono font-bold">
                            Create Employee
                        </DialogTitle>
                    </DialogHeader>

                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                            <Label htmlFor="fname" className="w-24 text-right text-xs font-bold">
                                First Name:
                            </Label>
                            <Input
                                id="fname"
                                name="fname"
                                value={user.fname}
                                onChange={handleChange}
                                placeholder="First Name"
                            />
                            </Field>
                            <Field>
                            <Label htmlFor="lname" className="w-24 text-right text-xs font-bold">
                                Last Name:
                            </Label>
                            <Input
                                id="lname"
                                name="lname"
                                value={user.lname}
                                onChange={handleChange}
                                placeholder="Last Name"
                            />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                            <Label htmlFor="username" className="w-24 text-right text-xs font-bold">
                                Username:
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                placeholder="Username"
                            />
                            </Field>

                            <Field>
                            <Label htmlFor="email" className="w-24 text-right text-xs font-bold">
                                Email:
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                placeholder="Email"
                            />
                            </Field>
                        </div>

                        <Field>
                            <Label className="w-24 text-right text-xs font-bold">
                                Role:
                            </Label>
                            <Select
                                onValueChange={(value: string | null) =>
                                    setUser({ ...user, roles: value ?? "" })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Roles</SelectLabel>
                                        <SelectItem value="BusinessAnalyst">Business Analyst</SelectItem>
                                        <SelectItem value="UnderWriter">Underwriter</SelectItem>
                                        <SelectItem value="ActuarialAnalyst">ActuarialAnalyst</SelectItem>
                                        <SelectItem value="ExcelOperator">ExcelOperator</SelectItem>
                                        <SelectItem value="BusinessOperator">BusinessOperator</SelectItem>
                                        <SelectItem value="Administrator">Administrator</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-4 justify-end gap-2">
                        <DialogClose
                            render={<Button variant="outline">Cancel</Button>}
                        />
                        <ConfirmationPopup
                            triggerLabel="Submit"
                            onConfirm={async () => {
                                const bodyData: CreateEmployeeRequest = {
                                    uname: user.username,
                                    first_name: user.fname,
                                    last_name: user.lname,
                                    email: user.email || undefined,
                                    roles: user.roles ? [user.roles] : undefined,
                                };
                                try {
                                    const res = await createEmployee(bodyData);
                                    console.log(res);
                                    console.log("Employee created successfully");
                                    setUser({ fname: "", lname: "", username: "", email: "", roles: "" });
                                } catch (err) {
                                    console.error(err);
                                }
                            }}
                        />
                        {/*
                        <Button
                            type="submit"
                            className="bg-secondary text-background p-3"
                            onClick={async () => {

                                const bodyData: CreateEmployeeRequest = {
                                    uname: user.username,
                                    first_name: user.fname,
                                    last_name: user.lname,
                                    email: user.email || undefined,
                                    roles: user.roles ? [user.roles] : undefined,
                                };

                                try {
                                    const res = await createEmployee(bodyData);
                                    console.log(res)
                                    console.log("Employee created successfully");

                                    setUser({
                                        fname: "",
                                        lname: "",
                                        username: "",
                                        email: "",
                                        roles: "",
                                    });

                                } catch (err) {
                                    console.error(err);
                                    console.log("Failed to create employee");
                                }
                            }}
                        >
                            Submit
                        </Button>
                        */}
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}

export default CreateEmployeeForm;