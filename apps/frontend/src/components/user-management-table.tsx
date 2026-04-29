// import '../App.css'
//
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"
//
// import {HugeiconsIcon} from "@hugeicons/react";
// import { UserCircleIcon } from '@hugeicons/core-free-icons';
// import {useEffect, useState} from "react";
// import EmployeeForm from "@/components/employeeForm.tsx";
// import {EmployeeConfirmationPopup} from "@/components/deletePopupConfirmationEmployee.tsx";
// import CreateEmployeeForm from "@/components/createEmployeeForm.tsx";
// import * as React from "react";
//
//
// type Employee = {
//     id: string;
//     first_name: string;
//     last_name: string;
//     uname: string;
//     email?: string;
//     roles?: string[];
//     imageUrl: string;
// };
//
// async function getEmployees() {
//     const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employee`);
//
//     if ((res.status === 401 || res.status === 403) && !window.location.href.endsWith("/employee-management")) {
//         window.location.replace("/");
//     }
//
//     if (!res.ok) {
//         throw new Error("Failed to fetch employees");
//     }
//     const data = await res.json();
//     console.log(data)
//
//     return data;
// }
//
//
// function UserManagementTable(){
//
//     const [employees, setEmployees] = useState<Employee[]>([]);
//
//     useEffect(() => {
//         getEmployees()
//             .then(setEmployees)
//             .catch(console.error);
//     }, []);
//
//
//     return (
//         <>
//             <div className="max-w-10xl mx-auto px-6 py-6">
//                 <div className="bg-white rounded-xl shadow-sm border p-4">
//                     <div className="flex items-center mb-4 justify-end ml-auto">
//                         <CreateEmployeeForm />
//                     </div>
//             <Table className="border rounded-lg overflow-hidden">
//                 <TableHeader className="bg-[#ecf4f9] text-[#0b4461]">
//                     <TableRow>
//                         <TableHead className=" text-[#0b4461] text-center">Name</TableHead>
//                         <TableHead className=" text-[#0b4461] text-center">Username</TableHead>
//                         <TableHead className=" text-[#0b4461] text-center">Email</TableHead>
//                         <TableHead className=" text-[#0b4461] text-center">Role</TableHead>
//                         <TableHead className="text-[#0b4461]  flex text-center items-center pl-[35px]">Action</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {employees.map((emp) => (
//                         <TableRow key={emp.id}>
//                             <TableCell className="font-medium text-center">
//                                 <div className="flex gap-3 text-center items-center">
//                                     <img className="size-8 rounded-full" src={emp.imageUrl}/>
//                                     {emp.first_name} {emp.last_name}
//                                 </div>
//                             </TableCell>
//
//                             <TableCell className="text-center">{emp.uname}</TableCell>
//                             <TableCell className="text-center">{emp.email}</TableCell>
//                             <TableCell className="text-center">{emp.roles?.at(0) ?? "No Roles" }</TableCell>
//
//                             <TableCell className="flex items-center text-center gap-3">
//                                 <div className="flex justify-end">
//                                     <EmployeeForm employee={emp}/>
//                                 </div>
//
//                                 <EmployeeConfirmationPopup target={emp.id} />
//
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//             </div>
//             </div>
//         </>
//     )
// }
//
// export default UserManagementTable;


"use client"
import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { Button } from './ui/button.tsx'

import {HugeiconsIcon} from "@hugeicons/react";
import {SlidersHorizontalIcon, X} from '@hugeicons/core-free-icons';
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    useReactTable,
    type SortingState,
    getSortedRowModel,
} from "@tanstack/react-table"

import { Search } from "lucide-react"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import {useEffect, useState} from "react";
import {useAuth} from "@clerk/react";
import CreateEmployeeForm from "@/components/createEmployeeForm.tsx";
import EmployeeConfirmationPopup from "@/components/deletePopupConfirmationEmployee.tsx";
import EmployeeForm from "@/components/employeeForm.tsx";

type Employee = {
    id: string;
    first_name: string;
    last_name: string;
    uname: string;
    email?: string;
    roles?: string[];
    imageUrl: string;
};

interface EmployeeProps<TData extends Employee, TValue> {
    columns: ColumnDef<TData, TValue>[]
}

export default function EmployeeTable<TData extends Employee, TValue>({
                                                                    columns,
                                                                }: EmployeeProps<TData, TValue>) {
    const [, setRoles] = useState<string[]>([]);
    const { getToken, isSignedIn } = useAuth();
    const [, setMe] = useState(null);
    const [token, setToken] = useState<string>();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [roleFilters, setRoleFilters] =  useState( [
        {key: 'roles', value: 'ActuarialAnalyst', id: 'Actuarial Analyst', state: false},
        {key: 'roles', value: 'Administrator', id: 'Administrator', state: false},
        {key: 'roles', value: 'BusinessAnalyst', id: 'Business Analyst', state: false},
        {key: 'roles', value: 'BusinessOperator', id: 'Business Operator', state: false},
        {key: 'roles', value: 'ExcelOperator', id: 'Excel Operator', state: false},
        {key: 'roles', value: 'UnderWriter', id: 'Underwriter', state: false},

    ]);
    const [filters, setFilters] = useState<{key: string; value: string; id: string; state: boolean;}[]>([]);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [reload, setReload] = useState<boolean>(false);

    async function getEmployees() {
        const payload: Record<string, string[]> = {};

        if (filters.length > 0) {
            payload['roles'] = filters.map(d => [d.value]);
        }
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employee`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });

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



    useEffect(() => {
        if (!isSignedIn) {
            setMe(null);
            return;
        }

        async function load() {
            const token = await getToken();

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            setMe(data);
            setToken(token as string)
            setRoles((data.roles as string[]).map((role: string) => role.toLowerCase()))
        }
        load();

    }, []);
    useEffect(() => {
        getEmployees()
            .then(setEmployees)
            .catch(console.error);
    }, [filters, reload]);


    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const table = useReactTable({
        data: employees,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },

    })


    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>, option: { key: string; value: string; id: string; state: boolean }) => {
        const {id, checked} = e.target;

        if (checked) {
            setFilters((filter) => [...filter, option])
        }
        else {
            setFilters((filter) => filter.filter((item) => item.id !== option.id));
        }

        setRoleFilters(rlFilters =>
            rlFilters.map(filter =>
                filter.id === id ? { ...filter, state: !filter.state } : filter
            )
        );
    }
        return (
            <>
                <div className="max-w-10xl mx-auto px-10 py-10">
                    <div className="bg-white rounded-xl shadow-sm border p-4">
                        <div className="flex items-center mb-4">
                            <InputGroup className="flex-1 max-w-2xl h-8 border-2 shadow-md hover:shadow-xl transition-all duration-100 bg-white">
                                <InputGroupInput
                                    placeholder="Search"
                                    value={(table.getColumn("full_name")?.getFilterValue() as string) ?? ""}
                                    onChange={(event) =>
                                        table.getColumn("full_name")?.setFilterValue(event.target.value)
                                    }
                                    className="w-full"
                                />
                                <InputGroupAddon>
                                    <Search />
                                </InputGroupAddon>
                            </InputGroup>
                            <div className="relative inline-block text-left">
                                <button
                                    onClick={() => setIsRoleOpen(!isRoleOpen)}
                                    className="flex px-4 py-1 ml-2 bg-gray-400 text-white rounded-md hover:bg-gray-600"
                                >
                                    <div className="pr-1"><HugeiconsIcon icon={SlidersHorizontalIcon}/></div>
                                    Filter
                                </button>
                                {isRoleOpen && (
                                    <div className="absolute right-0 mt-2 z-10 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
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
                            </div>
                            <div className="flex justify-end ml-auto">
                                <CreateEmployeeForm reload={setReload}/>
                            </div>
                            
                        </div>
                        <div className="py-1 mb-2 flex flex-row flex-wrap gap-2">
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
                        <Table className="border rounded-lg overflow-hidden">
                            <TableHeader className="bg-[#ecf4f9] text-[#0b4461]">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead className=" text-[#0b4461] text-center" key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                        <TableHead className="text-[#0b4461] text-center px-1">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.map((row) => {
                                    const emp = row.original;

                                    return (
                                        <TableRow key={row.id}>

                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="px-1 py-0.5 text-center">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}

                                            <TableCell className="px-1 py-0.5">
                                                <div className="flex gap-2 justify-center">
                                                    <EmployeeForm employee={emp} reload={setReload}/>

                                                    <EmployeeConfirmationPopup target={emp.id} reload={setReload}/>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        )
}