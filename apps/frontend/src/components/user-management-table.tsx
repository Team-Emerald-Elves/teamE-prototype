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
import {SlidersHorizontalIcon, UserCircleIcon, X} from '@hugeicons/core-free-icons';
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
    imageUrl: string;
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
    const [roleFilters, setRoleFilters] =  useState( [
        {key: 'assigned_role', value: 'BusinessAnalyst', id: 'Business Analyst', state: false},
        {key: 'assigned_role', value: 'UnderWriter', id: 'Underwriter', state: false},
    ]);
    const [filters, setFilters] = useState<{key: string; value: string; id: string; state: boolean;}[]>([]);
    const [isRoleOpen, setIsRoleOpen] = useState(false);

    const getActive = () => {
        const payload: Record<string, string[]> = {};

        if (filters.length > 0) {
            payload['assigned_role'] = filters.map(d => d.value);
        }

        return JSON.stringify(payload);
    };
    useEffect(() => {
        getEmployees()
            .then(setEmployees)
            .catch(console.error);
    }, []);

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>, option: { key: string; value: string; id: string; state: boolean }) => {
        const {id, checked} = e.target;

        if (checked) {
            setFilters((filter) => [...filter, option])
            console.log(filters)
        }
        else {
            setFilters((filter) => filter.filter((item) => item.id !== option.id));
            console.log(filters)
        }

        setRoleFilters(rlFilters =>
            rlFilters.map(filter =>
                filter.id === id ? { ...filter, state: !filter.state } : filter
            )
        );
    }
    return (
        <>
            <div className="max-w-10xl mx-auto px-6 py-6">
                <div className="bg-white rounded-xl shadow-sm border p-4">
                    <div className="flex items-center mb-4 ml-auto">
                        <div className="relative text-left justify-start flex items-center">
                        <button
                            onClick={() => setIsRoleOpen(!isRoleOpen)}
                            className="flex px-4 py-1 ml-2 bg-gray-400 text-white rounded-md hover:bg-gray-600">
                            <div className="pr-1"><HugeiconsIcon icon={SlidersHorizontalIcon}/></div>
                            Filter </button>
                            {isRoleOpen && (
                                <div className="absolute left-0 mt-22 z-10 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                    <div className="py-1">
                                        {roleFilters.map((option) => (
                                            <div key={option.id}
                                                 className="flex items-center justify-between">
                                                <label htmlFor={option.id}
                                                       className="text-sm font-medium text-gray-800 cursor-pointer ml-2 ">{option.id}</label>
                                                <input
                                                    id={option.id}
                                                    type="checkbox"
                                                    checked={option.state}
                                                    onChange={(e) => handleCheckbox(e, option)}
                                                    className="h-4 w-4 rounded border-gray-300 hover:bg-gray-600 focus:bg-gray-600 cursor-pointer mr-3"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="py-1 ml-2 flex flex-row flex-wrap gap-2">
                                {filters.map((option) => (
                                    <div key={option.id} className=" flex  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 ">
                                        <p className=" px-2 py-1 text-gray-800 rounded-md text-xs "> {option.id}</p>
                                        <button onClick={() => {
                                            setFilters((filter) => filter.filter((filterId) => filterId !== option));

                                            setRoleFilters(rlFilters =>
                                                rlFilters.map(filter =>
                                                    filter.id === option.id ? { ...filter, state: !filter.state } : filter
                                                )
                                            );
                                        }} className="text-black pr-2">
                                            <div className="ml-1"><HugeiconsIcon size={16} icon={X}/></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    <div className="flex items-center mb-4 ml-auto justify-end">
                        <CreateEmployeeForm />
                    </div>
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
                                    <img className="size-8 rounded-full" src={emp.imageUrl}/>
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