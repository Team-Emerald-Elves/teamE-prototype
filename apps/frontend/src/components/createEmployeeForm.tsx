// import '../App.css'
//
// import { Button } from './ui/button.tsx'
// import {
//     Dialog,
//     DialogTrigger,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
//     DialogClose,
// } from "@/components/ui/dialog"
// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectLabel,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import {FieldGroup} from "@/components/ui/field"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
//
// type CreateEmployeeRequest = {
//     id: string,
//     uname?: string,
//     first_name?: string,
//     last_name?: string,
//     email?: string,
//     role?: string[],
// }
//
// async function updateEmployee(body: CreateEmployeeRequest) {
//     console.log(body)
//     const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/edit-employee`, {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(body),
//     });
//
//     if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(`Failed to update employee (status ${res.status}): ${errorText}`);
//     }
//     return res.json();
// }
//
// function CreateEmployeeForm() {
//
//
//     return (
//         <Dialog>
//             <form>
//                 <div className="flex justify-end w-full">
//                     <DialogTrigger render={<Button variant="outline" className="ml-auto px-4 py-3 text-base bg-secondary text-secondary-foreground">Create Employee</Button>} />
//                 </div>
//                 <DialogContent className="lg:max-w-3xl">
//                     <DialogHeader>
//                         <DialogTitle className="text-2xl text-primary font-mono font-bold">Edit Employee</DialogTitle>
//                     </DialogHeader>
//                     <FieldGroup>
//                         <div className="flex items-center gap-4">
//                             <Label htmlFor="fname" className="w-24 text-right font-bold">First Name:</Label>
//                             <Input id="fname" name="fname" placeholder="First Name" />
//                         </div>
//                         <div className="flex items-center gap-4">
//                             <Label htmlFor="lname" className="w-24 text-right font-bold">Last Name:</Label>
//                             <Input id="lname" name="lname" placeholder="Last Name" />
//                         </div>
//                         <div className="flex items-center gap-4">
//                             <Label htmlFor="user" className="w-24 text-right font-bold">Username:</Label>
//                             <Input id="user" name="user" placeholder="Username" />
//                         </div>
//                         <div className="flex items-center gap-4">
//                             <Label htmlFor="email" className="w-24 text-right font-bold">Email:</Label>
//                             <Input id="email" name="email" placeholder="Email" />
//                         </div>
//                         <div className="flex items-center gap-4">
//                             <Label htmlFor="contentOwner" className="w-22 text-right font-bold">Select Roles:</Label>
//                             <Select id="contentOwner">
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Role" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectGroup>
//                                         <SelectLabel>Roles</SelectLabel>
//                                         <SelectItem value="Business Analyst">Business Analyst</SelectItem>
//                                         <SelectItem value="Underwriter">Underwriter</SelectItem>
//                                         <SelectItem value="Admin">Admin</SelectItem>
//                                     </SelectGroup>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </FieldGroup>
//                     <DialogFooter className="mt-4 justify-end gap-2">
//                         <DialogClose render={<Button variant="outline">Cancel</Button>} />
//                         <Button type="submit" className="bg-secondary text-background p-3" onClick={async () => {
//                             const array: string[] | undefined = user.role ? [user.role] : undefined
//                             const bodyData: EditEmployeeRequest = {
//                                 id: employee.id,
//                                 uname: user.username,
//                                 email: user.email ? user.email : undefined,
//                                 first_name: user.firstname,
//                                 last_name: user.lastname,
//                                 role: array,
//                             };
//                             try {
//                                 await updateEmployee(bodyData);
//                                 console.log("Employee created successfully");
//                             } catch (err) {
//                                 console.error(err);
//                                 console.log("Failed to update employee");
//                             }
//                         }}>Submit</Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </form>
//         </Dialog>
//     )
// }
// export default CreateEmployeeForm;
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
import { FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CreateEmployeeRequest = {
    uname?: string,
    first_name?: string,
    last_name?: string,
    email?: string,
    role?: string[],
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
        role: "",
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
                            <Button className="ml-auto px-4 py-3 text-base bg-secondary text-secondary-foreground">
                                Create Employee
                            </Button>
                        }
                    />
                </div>

                <DialogContent className="lg:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-primary font-mono font-bold">
                            Create Employee
                        </DialogTitle>
                    </DialogHeader>

                    <FieldGroup>
                        <div className="flex items-center gap-4">
                            <Label htmlFor="fname" className="w-24 text-right font-bold">
                                First Name:
                            </Label>
                            <Input
                                id="fname"
                                name="fname"
                                value={user.fname}
                                onChange={handleChange}
                                placeholder="First Name"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Label htmlFor="lname" className="w-24 text-right font-bold">
                                Last Name:
                            </Label>
                            <Input
                                id="lname"
                                name="lname"
                                value={user.lname}
                                onChange={handleChange}
                                placeholder="Last Name"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Label htmlFor="username" className="w-24 text-right font-bold">
                                Username:
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                placeholder="Username"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Label htmlFor="email" className="w-24 text-right font-bold">
                                Email:
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                placeholder="Email"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Label className="w-24 text-right font-bold">
                                Role:
                            </Label>
                            <Select
                                onValueChange={(value: string | null) =>
                                    setUser({ ...user, role: value ?? "" })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Role" />
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
                        <DialogClose
                            render={<Button variant="outline">Cancel</Button>}
                        />

                        <Button
                            type="submit"
                            className="bg-secondary text-background p-3"
                            onClick={async () => {

                                const bodyData: CreateEmployeeRequest = {
                                    uname: user.username,
                                    first_name: user.fname,
                                    last_name: user.lname,
                                    email: user.email || undefined,
                                    role: user.role ? [user.role] : undefined,
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
                                        role: "",
                                    });

                                } catch (err) {
                                    console.error(err);
                                    console.log("Failed to create employee");
                                }
                            }}
                        >
                            Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}

export default CreateEmployeeForm;