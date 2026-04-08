import '../App.css'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Delete02Icon } from 'hugeicons-react';
import { UserCircleIcon } from 'hugeicons-react';
import { Button } from "@/components/ui/button";

import {useEffect, useState} from "react";


import EmployeeForm from "@/components/employeeForm.tsx";


type Employee = {
    id: string;
    first_name: string;
    last_name: string;
    uname: string;
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
                                    {emp.first_name} {emp.last_name}
                                </div>
                            </TableCell>

                            <TableCell>{emp.uname}</TableCell>
                            <TableCell>{emp.email}</TableCell>
                            <TableCell>{emp.roles?.[0] ?? "No Roles"}</TableCell>

                            <TableCell className="flex items-center gap-3">
                                <div className="flex justify-end">
                                    <EmployeeForm/>
                                </div>

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