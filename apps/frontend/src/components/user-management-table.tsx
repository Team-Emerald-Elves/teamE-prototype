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
import {getToken, useAuth, useUser} from "@clerk/react";
import FavoriteStar from "@/components/favoriteStar.tsx";
import AddLinksForm from "@/components/addlinksform.tsx";
import Editlinksform from "@/components/editlinksform.tsx";
import DeletePopupConfirmationLinks from "@/components/deletePopupConfirmationLinks.tsx";
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
    data: TData[]
}


export default function EmployeeTable<TData extends Employee, TValue>({
                                                                    columns,
                                                                    data,
                                                                }: EmployeeProps<TData, TValue>) {
    const [roles, setRoles] = useState<string[]>([]);
    const { getToken, isSignedIn } = useAuth();
    const [me, setMe] = useState(null);
    const[employees, setEmployees] = useState<Employee[]>([]);
    const [token, setToken] = useState<string>();

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

    }, [isSignedIn]);
    useEffect(() => {
        setEmployees(data);
    }, [data]);

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
                            <div className="flex justify-end ml-auto">
                                <CreateEmployeeForm />
                            </div>
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
                                                    <EmployeeForm employee={emp}/>

                                                    <EmployeeConfirmationPopup target={emp.id} />
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