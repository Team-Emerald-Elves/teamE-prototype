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
                                    <HugeiconsIcon icon={UserCircleIcon} size={25} strokeWidth={1.5}/>
                                    {emp.first_name} {emp.last_name}
                                </div>
                            </TableCell>

                            <TableCell>{emp.uname}</TableCell>
                            <TableCell>{emp.email}</TableCell>
                            <TableCell>{emp.roles?.at(0) ?? "No Roles" }</TableCell>

                            <TableCell className="flex items-center gap-3">
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
        </>
    )
}

export default UserManagementTable;