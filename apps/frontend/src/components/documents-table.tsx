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
import ContentForm from "@/components/contentForm.tsx";
import DeleteConfirmationPopup from "@/components/deletePopupConfirmation.tsx";
import {useEffect, useState} from "react";
import {useAuth, useUser} from "@clerk/react";

type Document = {
    id: number;
    url: string;
    name: string;
    last_modified: string;
    expiration_date: string;
    mime_type: string;
    document_type: string;
    assigned_role: string;
    content_owner: string;
    document_status: string;
    favorite: boolean;
};


interface DocProps<TData extends Document, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DocumentsTable<TData extends Document, TValue>({
                                             columns,
                                             data,
                                         }: DocProps<TData, TValue>) {
    const [roles, setRoles] = useState<string[]>([]);
    const {user} = useUser()
    const { getToken, isSignedIn } = useAuth();
    const [me, setMe] = useState(null);
    const[docs, setDocs] = useState<Document[]>([]);


    useEffect(() => {
        if (!isSignedIn) {
            setMe(null);
            return;
        }

        async function load() {
            const token = await getToken();

            const res = await fetch("http://localhost:3000/api/tests/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            setMe(data);
            setRoles((data.roles as string[]).map((role: string) => role.toLowerCase()))
        }
        load();

    }, [isSignedIn]);
    useEffect(() => {
        setDocs(data);
    }, [data]);

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const table = useReactTable({
        data,
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
    console.log(docs)
    console.log(typeof docs)
    console.log(Array.isArray(docs))
    if (roles.includes("underwriter")) {
        return (
            <>
            <div className="max-w-10xl mx-auto px-6 py-6">
                <div className="bg-white rounded-xl shadow-sm border p-4">
                    <div className="flex items-center mb-4">
                        <InputGroup
                            className="max-w-md h-8 py-4 border-2 shadow-md hover:shadow-xl transition-all duration-100 cursor-pointer bg-white">
                            <InputGroupInput
                                placeholder="Search"
                                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("name")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                            <InputGroupAddon>
                                <Search/>
                            </InputGroupAddon>
                        </InputGroup>
                        <div className="flex justify-end ml-auto">
                            <ContentForm
                                type="Create"
                                currentID={Math.trunc((Math.random() * 10000) % 10000)}
                                currentName="Name..."
                                currentURL="www.example.com"
                                currentContentOwner="Select Content Owner"
                                currentRole="Select Role"
                                currentExpirationDate="Tomorrow"
                                currentExpirationTime="10:30:00"
                                currentStatus="Select Status"
                                size={true}
                            />
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
                                    <TableHead className="text-[#0b4461]">Actions</TableHead>
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {docs.filter((doc) => doc.assigned_role === "underwriter").map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell className="text-[#0b4461] font-medium">
                                        <div className="flex gap-3 items-center">
                                            {doc.favorite}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">{doc.name}</TableCell>
                                    <TableCell className="text-center">{doc.mime_type}</TableCell>
                                    <TableCell className="text-center">{doc.expiration_date}</TableCell>
                                    <TableCell className="text-center">{doc.document_status}</TableCell>
                                    <TableCell className="text-center">{doc.content_owner}</TableCell>
                                    <TableCell className="text-center">{doc.last_modified}</TableCell>
                                    <TableCell className="flex items-center gap-3">
                                        <div className="flex justify-end">
                                            <ContentForm
                                                type="Edit"
                                                currentID={doc.id}
                                                currentName={doc.name}
                                                currentURL={doc.url}
                                                currentContentOwner={doc.content_owner}
                                                currentRole={doc.assigned_role}
                                                currentExpirationDate={doc.expiration_date}
                                                currentExpirationTime={doc.expiration_date}
                                                currentStatus={doc.document_status}
                                                size={true}
                                            />
                                        </div>
                                        <DeleteConfirmationPopup target={"null"}/>
                                    </TableCell>
                                </TableRow>))}
                            {docs.filter((doc) => doc.assigned_role === "businessanalyst").map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell className="text-[#0b4461] font-medium">
                                        <div className="flex gap-3 items-center">
                                            {doc.favorite}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">{doc.name}</TableCell>
                                    <TableCell className="text-center">{doc.mime_type}</TableCell>
                                    <TableCell className="text-center">{doc.expiration_date}</TableCell>
                                    <TableCell className="text-center">{doc.document_status}</TableCell>
                                    <TableCell className="text-center">{doc.content_owner}</TableCell>
                                    <TableCell className="text-center">{doc.last_modified}</TableCell>

                                </TableRow>))}
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
    if (roles.includes("businessanalyst")) {
        return (
            <>
                <div className="max-w-10xl mx-auto px-6 py-6">
                    <div className="bg-white rounded-xl shadow-sm border p-4">
                        <div className="flex items-center mb-4">
                            <InputGroup
                                className="max-w-md h-8 py-4 border-2 shadow-md hover:shadow-xl transition-all duration-100 cursor-pointer bg-white">
                                <InputGroupInput
                                    placeholder="Search"
                                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                    onChange={(event) =>
                                        table.getColumn("name")?.setFilterValue(event.target.value)
                                    }
                                    className="max-w-sm"
                                />
                                <InputGroupAddon>
                                    <Search/>
                                </InputGroupAddon>
                            </InputGroup>
                            <div className="flex justify-end ml-auto">
                                <ContentForm
                                    type="Create"
                                    currentID={Math.trunc((Math.random() * 10000) % 10000)}
                                    currentName="Name..."
                                    currentURL="www.example.com"
                                    currentContentOwner="Select Content Owner"
                                    currentRole="Select Role"
                                    currentExpirationDate="Tomorrow"
                                    currentExpirationTime="10:30:00"
                                    currentStatus="Select Status"
                                    size={true}
                                />
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
                                        <TableHead className="text-[#0b4461]">Actions</TableHead>
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {docs.filter((doc) => doc.assigned_role === "businessanalyst").map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="text-[#0b4461] font-medium">
                                            <div className="flex gap-3 items-center">
                                                {doc.favorite}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">{doc.name}</TableCell>
                                        <TableCell className="text-center">{doc.mime_type}</TableCell>
                                        <TableCell className="text-center">{doc.expiration_date}</TableCell>
                                        <TableCell className="text-center">{doc.document_status}</TableCell>
                                        <TableCell className="text-center">{doc.content_owner}</TableCell>
                                        <TableCell className="text-center">{doc.last_modified}</TableCell>
                                        <TableCell className="flex items-center gap-3">
                                            <div className="flex justify-end">
                                                <ContentForm
                                                    type="Edit"
                                                    currentID={doc.id}
                                                    currentName={doc.name}
                                                    currentURL={doc.url}
                                                    currentContentOwner={doc.content_owner}
                                                    currentRole={doc.assigned_role}
                                                    currentExpirationDate={doc.expiration_date}
                                                    currentExpirationTime={doc.expiration_date}
                                                    currentStatus={doc.document_status}
                                                    size={true}
                                                />
                                            </div>
                                            <DeleteConfirmationPopup target={"null"}/>
                                        </TableCell>
                                    </TableRow>))}
                                {docs.filter((doc) => doc.assigned_role === "underwriter").map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="text-[#0b4461] font-medium">
                                            <div className="flex gap-3 items-center">
                                                {doc.favorite}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">{doc.name}</TableCell>
                                        <TableCell className="text-center">{doc.mime_type}</TableCell>
                                        <TableCell className="text-center">{doc.expiration_date}</TableCell>
                                        <TableCell className="text-center">{doc.document_status}</TableCell>
                                        <TableCell className="text-center">{doc.content_owner}</TableCell>
                                        <TableCell className="text-center">{doc.last_modified}</TableCell>

                                    </TableRow>))}
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
    else {
        return (
            <>
                <div className="max-w-10xl mx-auto px-6 py-6">
                    <div className="bg-white rounded-xl shadow-sm border p-4">
                        <div className="flex items-center mb-4">
                            <InputGroup
                                className="max-w-md h-8 py-4 border-2 shadow-md hover:shadow-xl transition-all duration-100 cursor-pointer bg-white">
                                <InputGroupInput
                                    placeholder="Search"
                                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                    onChange={(event) =>
                                        table.getColumn("name")?.setFilterValue(event.target.value)
                                    }
                                    className="max-w-sm"
                                />
                                <InputGroupAddon>
                                    <Search/>
                                </InputGroupAddon>
                            </InputGroup>
                            <div className="flex justify-end ml-auto">
                                <ContentForm
                                    type="Create"
                                    currentID={Math.trunc((Math.random() * 10000) % 10000)}
                                    currentName="Name..."
                                    currentURL="www.example.com"
                                    currentContentOwner="Select Content Owner"
                                    currentRole="Select Role"
                                    currentExpirationDate="Tomorrow"
                                    currentExpirationTime="10:30:00"
                                    currentStatus="Select Status"
                                    size={true}
                                />
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
                                        <TableHead className="text-[#0b4461]">Actions</TableHead>
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {docs.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="text-[#0b4461] font-medium">
                                            <div className="flex gap-3 items-center">
                                                {doc.favorite}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">{doc.name}</TableCell>
                                        <TableCell className="text-center">{doc.mime_type}</TableCell>
                                        <TableCell className="text-center">{doc.expiration_date}</TableCell>
                                        <TableCell className="text-center">{doc.document_status}</TableCell>
                                        <TableCell className="text-center">{doc.content_owner}</TableCell>
                                        <TableCell className="text-center">{doc.last_modified}</TableCell>
                                        <TableCell className="flex items-center gap-3">
                                            <div className="flex justify-end">
                                                <ContentForm
                                                    type="Edit"
                                                    currentID={doc.id}
                                                    currentName={doc.name}
                                                    currentURL={doc.url}
                                                    currentContentOwner={doc.content_owner}
                                                    currentRole={doc.assigned_role}
                                                    currentExpirationDate={doc.expiration_date}
                                                    currentExpirationTime={doc.expiration_date}
                                                    currentStatus={doc.document_status}
                                                    size={true}
                                                />
                                            </div>
                                            <DeleteConfirmationPopup target={"null"}/>
                                        </TableCell>
                                    </TableRow>))}

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
}