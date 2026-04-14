import '../App.css'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {HugeiconsIcon} from "@hugeicons/react";
import { UserCircleIcon } from '@hugeicons/core-free-icons';
import {useEffect, useState} from "react";
import EmployeeForm from "@/components/employeeForm.tsx";
import {EmployeeConfirmationPopup} from "@/components/deletePopupConfirmationEmployee.tsx";
import CreateEmployeeForm from "@/components/createEmployeeForm.tsx";
import * as React from "react";


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

    if ((res.status === 401 || res.status === 403) && !window.location.href.endsWith("/employee-management")) {
        window.location.replace("/");
    }

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
            <div className="max-w-10xl mx-auto px-6 py-6">
                <div className="bg-white rounded-xl shadow-sm border p-4">
                    <div className="flex items-center mb-4 justify-end ml-auto">
                        <CreateEmployeeForm />
                    </div>
            <Table className="border rounded-lg overflow-hidden">
                <TableHeader className="bg-[#ecf4f9] text-[#0b4461]">
                    <TableRow>
                        <TableHead className=" text-[#0b4461] text-center">Name</TableHead>
                        <TableHead className=" text-[#0b4461] text-center">Username</TableHead>
                        <TableHead className=" text-[#0b4461] text-center">Email</TableHead>
                        <TableHead className=" text-[#0b4461] text-center">Role</TableHead>
                        <TableHead className="text-[#0b4461]  flex text-center items-center pl-[35px]">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.map((emp) => (
                        <TableRow key={emp.id}>
                            <TableCell className="font-medium text-center">
                                <div className="flex gap-3 text-center items-center">
                                    <HugeiconsIcon icon={UserCircleIcon} size={25} strokeWidth={1.5}/>
                                    {emp.first_name} {emp.last_name}
                                </div>
                            </TableCell>

                            <TableCell className="text-center">{emp.uname}</TableCell>
                            <TableCell className="text-center">{emp.email}</TableCell>
                            <TableCell className="text-center">{emp.roles?.at(0) ?? "No Roles" }</TableCell>

                            <TableCell className="flex items-center text-center gap-3">
                                <div className="flex justify-end">
                                    <EmployeeForm employee={emp}/>
                                </div>

                                <EmployeeConfirmationPopup target={emp.id} />

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
            </div>
        </>
    )
}

export default UserManagementTable;