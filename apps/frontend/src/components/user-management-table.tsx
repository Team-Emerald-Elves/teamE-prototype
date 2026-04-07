import '../App.css'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Edit03Icon } from 'hugeicons-react';
import { Delete02Icon } from 'hugeicons-react';
import { UserCircleIcon } from 'hugeicons-react';
import { Button } from "@/components/ui/button"
import {useEffect, useState} from "react";

const users = [
    {
        name: "John Doe",
        username: "JohnDoe",
        email: "jodoe@gmail.com",
        role: "Business Analyst",
    },
    {
        name: "John Doe",
        username: "JohnDoe",
        email: "jodoe@gmail.com",
        role: "Underwriter",
    },
    {
        name: "John Doe",
        username: "JohnDoe",
        email: "jodoe@gmail.com",
        role: "Underwriter",
    },
    {
        name: "John Doe",
        username: "JohnDoe",
        email: "jodoe@gmail.com",
        role: "Business Analyst",
    },
    {
        name: "John Doe",
        username: "JohnDoe",
        email: "jodoe@gmail.com",
        role: "Admin",
    },
    {
        name: "John Doe",
        username: "JohnDoe",
        email: "jodoe@gmail.com",
        role: "Underwriter",
    },

]

type Employee = {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email?: string;
    roles?: string[];
};

async function getEmployees() {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employee`);

    if (!res.ok) {
        throw new Error("Failed to fetch employees");
    }
    const data = await res.json();
    console.log(data)

    return data;
}


function UserManagementTable(){

    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        getEmployees()
            .then(setEmployees)
            .catch(console.error);
    }, []);

    return (
        <>
            <div className="shadow-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="flex text-center items-center pl-[35px]">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.map((emp) => (
                        <TableRow key={emp.id}>
                            <TableCell className="font-medium">
                                <div className="flex gap-3 items-center">
                                    <UserCircleIcon size={25} strokeWidth={1.5}/>
                                    {emp.firstName} {emp.lastName}
                                </div>
                            </TableCell>

                            <TableCell>{emp.username}</TableCell>
                            <TableCell>{emp.email}</TableCell>
                            <TableCell>{emp.roles?.[0] ?? "No Roles"}</TableCell>

                            <TableCell className="flex items-center gap-3">
                                <Button variant = "outline" size = "icon">
                                    <Edit03Icon size={20} />
                                </Button>
                                <Button variant = "destructive" size = "icon">
                                    <Delete02Icon size={20} />
                                </Button>


                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
        </>
    )
}

export default UserManagementTable;