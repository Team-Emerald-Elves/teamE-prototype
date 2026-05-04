import "../App.css";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit03Icon } from "@hugeicons/core-free-icons";

import { Button } from "./ui/button.tsx";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FieldGroup, Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type JSX, useEffect, useState } from "react";
import { ConfirmationPopup } from "@/components/EmployeeConfirmationPopup";

type EditEmployeeRequest = {
    id: string;
    uname?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    roles?: string[];
};

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
    reload?: (any: any) => void;
};

async function updateEmployee(
    body: EditEmployeeRequest,
    reload: (any: any) => void,
) {
    console.log(body);
    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/edit-employee`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        },
    );

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
            `Failed to update employee (status ${res.status}): ${errorText}`,
        );
    }
    reload((prev: any) => !prev);
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
    const [isFilled, setIsFilled] = useState<boolean>(false);
    useEffect(() => {
        if (
            user.firstname &&
            user.lastname &&
            user.username &&
            user.email &&
            user.role
        ) {
            setIsFilled(true);
        } else {
            setIsFilled(false);
        }
    }, [user]);

    const [open, setOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <div className="flex justify-end">
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="px-3 py-3 text-base bg-gray-300 text-black"
                        >
                            <HugeiconsIcon icon={Edit03Icon} size={20} color = "var(--accent-foreground)"/>
                        </Button>
                    </DialogTrigger>
                </div>
                <DialogContent className="lg:max-w-lg bg-(--filter-background) text-foreground">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-foreground font-sans font-bold">
                            Edit Employee
                        </DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <label className="w-24 text-xs font-bold">
                                    First Name:{" "}
                                </label>
                                <Input
                                    name="firstname"
                                    value={user.firstname}
                                    onChange={handleChange}
                                    disabled={false}
                                    className="mt-1"
                                    placeholder="First Name"
                                />
                            </Field>
                            <Field>
                                <label className="w-24 text-xs font-bold">
                                    Last Name:{" "}
                                </label>
                                <Input
                                    name="lastname"
                                    value={user.lastname}
                                    onChange={handleChange}
                                    disabled={false}
                                    className="mt-1"
                                    placeholder="Last Name"
                                />
                            </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <label className="w-24 text-xs font-bold">
                                    Username:{" "}
                                </label>
                                <Input
                                    name="username"
                                    value={user.username}
                                    onChange={handleChange}
                                    disabled={false}
                                    className="mt-1"
                                    placeholder="Username"
                                />
                            </Field>
                            <Field>
                                <label className="w-24 text-xs font-bold">
                                    Email:{" "}
                                </label>
                                <Input
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    disabled={false}
                                    className="mt-1"
                                    placeholder="Email"
                                />
                            </Field>
                        </div>
                        <Field>
                            <Label
                                htmlFor="role"
                                className="w-22 text-right text-xs font-bold"
                            >
                                Select Roles:
                            </Label>
                            <Select
                                id="role"
                                onValueChange={(value: string | null) =>
                                    setUser({ ...user, role: value ?? "" })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={user.role} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Roles</SelectLabel>
                                        <SelectItem value="BusinessAnalyst">
                                            Business Analyst
                                        </SelectItem>
                                        <SelectItem value="UnderWriter">
                                            Underwriter
                                        </SelectItem>

                                        <SelectItem value="ActuarialAnalyst">
                                            ActuarialAnalyst
                                        </SelectItem>
                                        <SelectItem value="ExcelOperator">
                                            ExcelOperator
                                        </SelectItem>
                                        <SelectItem value="BusinessOperator">
                                            BusinessOperator
                                        </SelectItem>

                                        <SelectItem value="Administrator">
                                            Admin
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>
                    <DialogFooter className="mt-4 justify-end gap-2">
                        <DialogClose
                            render={<Button variant="secondary">Cancel</Button>}
                        />
                        <ConfirmationPopup
                            triggerLabel="Save"
                            onConfirm={async () => {
                                const array: string[] | undefined = user.role
                                    ? [user.role]
                                    : undefined;
                                const bodyData: EditEmployeeRequest = {
                                    id: employee!.id,
                                    uname: user.username,
                                    email: user.email ? user.email : undefined,
                                    first_name: user.firstname,
                                    last_name: user.lastname,
                                    roles: array,
                                };
                                try {
                                    await updateEmployee(
                                        bodyData,
                                        props.reload as (any: any) => void,
                                    );
                                    console.log(
                                        "Employee updated successfully",
                                    );

                                    setOpen(false);
                                } catch (err) {
                                    console.error(err);
                                    console.log("Failed to update employee");
                                }
                            }}
                            disabled={!isFilled}
                        />
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
export default EmployeeForm;

{
    /*    <Button onClick={async () => {*/
}
{
    /*    const array: string[] | undefined = user.role ? [user.role] : undefined*/
}
{
    /*    const bodyData: EditEmployeeRequest = {*/
}
{
    /*        id: employee!.id,*/
}
{
    /*        uname: user.username,*/
}
{
    /*        email: user.email ? user.email : undefined,*/
}
{
    /*        first_name: user.firstname,*/
}
{
    /*        last_name: user.lastname,*/
}
{
    /*        roles: array,*/
}
{
    /*    };*/
}
{
    /*    try {*/
}
{
    /*        await updateEmployee(bodyData);*/
}
{
    /*        console.log("Employee updated successfully");*/
}
{
    /*    } catch (err) {*/
}
{
    /*        console.error(err);*/
}
{
    /*        console.log("Failed to update employee");*/
}
{
    /*    }*/
}
{
    /*}}>*/
}
{
    /*    Save*/
}
{
    /*</Button> }/>*/
}
