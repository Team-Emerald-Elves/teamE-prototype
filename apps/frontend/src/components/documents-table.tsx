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

import { Search, Lock, LockOpen } from "lucide-react"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import ContentForm from "@/components/contentForm.tsx";
import DeleteConfirmationPopup from "@/components/deletePopupConfirmation.tsx";
import {useEffect, useState} from "react";
import {useAuth} from "@clerk/react";
import FavoriteStar from "@/components/favoriteStar.tsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {Download01Icon} from "@hugeicons/core-free-icons";

type Document = {
    id: number;
    url: string;
    name: string;
    last_modified: string;
    lock: string;
    expiration_date: string;
    mime_type: string;
    document_type: string;
    assigned_role: string;
    content_owner: string;
    document_status: string;
    favorite: boolean;
};

async function setDocumentLock(sessionToken: string | null, documentID: number, status: boolean): Promise<string> {


    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/update-lock`, {
        headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json"
        },
        method: "PUT",
        body: JSON.stringify({
            id: documentID,
            status: status
        })
    })
    if (!res.ok) {
        throw new Error("Failed to fetch document.");
    }
    const data = await res.json();

    return String(data);
}

interface DocProps<TData extends Document, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}


export function DocumentsTable<TData extends Document, TValue>({
                                             columns,
                                             data,
                                         }: DocProps<TData, TValue>) {
    const [roles, setRoles] = useState<string[]>([]);
    const { getToken, isSignedIn } = useAuth();
    const [me, setMe] = useState(null);
    const[docs, setDocs] = useState<Document[]>([]);
    const [token, setToken] = useState<string>();
    const[empID, setEmpID] = useState("");

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
            setEmpID(data.id);
            setToken(token as string)
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
        data: docs,
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



    if(roles.includes("administrator")) {
        return (
            <>
                <div className="max-w-10xl mx-auto px-10 py-10">
                    <div className="bg-white rounded-xl shadow-sm border p-4">
                        <div className="flex items-center mb-4">
                            <InputGroup className="flex-1 max-w-2xl h-8 border-2 shadow-md hover:shadow-xl transition-all duration-100 bg-white">
                                <InputGroupInput
                                    placeholder="Search"
                                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                    onChange={(event) =>
                                        table.getColumn("name")?.setFilterValue(event.target.value)
                                    }
                                    className="w-full"
                                />
                                <InputGroupAddon>
                                    <Search />
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
                                    lock="none"
                                />
                            </div>
                        </div>

                        <Table className="border rounded-lg overflow-hidden">
                            <TableHeader className="bg-[#ecf4f9] text-[#0b4461]">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        <TableHead className=" text-[#0b4461] text-center"> Favorite </TableHead>
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
                                {table.getRowModel().rows.map((row) => {
                                    const doc = row.original;

                                    return (
                                        <TableRow key={row.id}>
                                            <FavoriteStar
                                                doc={doc}
                                                onToggle={async (doc) => {
                                                    const newValue = !doc.favorite;
                                                    try {
                                                        const res = await fetch(
                                                            `${import.meta.env.VITE_BACKEND_URL}/update-favorite`,
                                                            {
                                                                method: "POST",
                                                                headers: {
                                                                    Accept: "application/json",
                                                                    "Content-Type": "application/json",
                                                                },
                                                                body: JSON.stringify({
                                                                    id: doc.id,
                                                                    favorite: doc.favorite,
                                                                }),
                                                            }
                                                        );

                                                        if (!res.ok) {
                                                            throw new Error("Failed to update favorite");
                                                        }
                                                        setDocs((prev) =>
                                                            prev.map((d) =>
                                                                d.id === doc.id ? { ...d, favorite: newValue } : d
                                                            )
                                                        );

                                                    } catch (err) {
                                                        console.error(err);
                                                    }
                                                }}
                                            />

                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="px-1 py-0.5 text-center">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                            {doc.lock === "none"?(
                                                <div className="flex items-center gap-1 justify-end">
                                            <TableCell>
                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:underline"
                                                >
                                                    <HugeiconsIcon icon={Download01Icon} />
                                                </a>
                                                <Button variant="outline" size="icon" className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground" onClick={async () => {
                                                    const token = await getToken();
                                                    await setDocumentLock(token, doc.id, true)
                                                }}><Lock /></Button>
                                            </TableCell>
                                                </div>
                                                ):
                                                doc.lock === empID ?(
                                            <TableCell>
                                                <div className="flex gap-2 justify-end">
                                                    {doc.lock != "none" && (
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
                                                        size={false}
                                                        lock={doc.lock}
                                                    />
                                                )}
                                                    <DeleteConfirmationPopup target={doc.id}/>
                                                    <a
                                                        href={doc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline"
                                                    >
                                                        <HugeiconsIcon icon={Download01Icon} />
                                                    </a>
                                                    <Button variant="outline" size="icon" className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground" onClick={async () => {
                                                        const token = await getToken();
                                                        await setDocumentLock(token, doc.id, false)
                                                    }}><LockOpen /></Button>

                                                </div>
                                            </TableCell>
                                                    ):(
                                                    <TableCell><p>empID</p></TableCell> )
                                            }
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
    else{
        return(
            <>
                <div className="max-w-10xl mx-auto px-10 py-10">
                    <div className="bg-white rounded-xl shadow-sm border p-4">
                        <div className="flex items-center mb-4">
                            <InputGroup className="flex-1 max-w-2xl h-8 border-2 shadow-md hover:shadow-xl transition-all duration-100 bg-white">
                                <InputGroupInput
                                    placeholder="Search"
                                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                    onChange={(event) =>
                                        table.getColumn("name")?.setFilterValue(event.target.value)
                                    }
                                    className="w-full"
                                />
                                <InputGroupAddon>
                                    <Search />
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
                                    lock="none"
                                />
                            </div>
                        </div>
                    <Table className="border rounded-lg overflow-hidden">
                        <TableHeader className="bg-[#ecf4f9] text-[#0b4461] text-center">
                        {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    <TableHead className=" text-[#0b4461] text-center"> Favorite </TableHead>
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
                            {table.getRowModel().rows.map((row) => {
                                const doc = row.original;

                                const canEdit =
                                    (roles.includes("underwriter") && doc.assigned_role === "UnderWriter") && (doc.lock != "none")||
                                    (roles.includes("businessanalyst") && doc.assigned_role === "BusinessAnalyst") && (doc.lock != "none")
                                return (
                                    <TableRow key={row.id}>
                                        <FavoriteStar
                                            doc={doc}
                                            onToggle={async (doc) => {
                                                const newValue = !doc.favorite;

                                                try {
                                                    const res = await fetch(
                                                        `${import.meta.env.VITE_BACKEND_URL}/update-favorite`,
                                                        {
                                                            method: "POST",
                                                            headers: {
                                                                Accept: "application/json",
                                                                "Content-Type": "application/json",
                                                            },
                                                            body: JSON.stringify({
                                                                id: doc.id,
                                                                favorite: doc.favorite,
                                                            }),
                                                        }
                                                    );

                                                    if (!res.ok) {
                                                        throw new Error("Failed to update favorite");
                                                    }
                                                    setDocs((prev) =>
                                                        prev.map((d) =>
                                                            d.id === doc.id ? { ...d, favorite: newValue } : d
                                                        )
                                                    );

                                                } catch (err) {
                                                    console.error(err);
                                                }
                                            }}
                                        />
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="px-1 py-0.5 text-center">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                        {doc.lock === "none"?(
                                            <div className="flex items-center justify-end gap-2">
                                            <TableCell>
                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:underline"
                                                >
                                                    <HugeiconsIcon icon={Download01Icon} />
                                                </a>
                                                <Button variant="outline" size="icon" className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground" onClick={async () => {
                                                    const token = await getToken();
                                                    await setDocumentLock(token, doc.id, true)
                                                }}><Lock /></Button>
                                            </TableCell>
                                            </div>
                                            ):
                                            doc.lock === empID ?(
                                        <TableCell>
                                            <div className="flex gap-2 justify-end">
                                                {canEdit && (
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
                                                        size={false}
                                                        lock={doc.lock}
                                                    />
                                                )}

                                                {canEdit && (
                                                    <DeleteConfirmationPopup target={doc.id} />
                                                )}
                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:underline"
                                                >
                                                    <HugeiconsIcon icon={Download01Icon} />
                                                </a>
                                                <Button variant="outline" size="icon" className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground" onClick={async () => {
                                                    const token = await getToken();
                                                    await setDocumentLock(token, doc.id, false)
                                                }}><LockOpen /></Button>
                                            </div>
                                        </TableCell> ):(
                                                <TableCell><p>{empID}</p></TableCell> )
                                        }
                                    </TableRow>
                                );
                            })}
                            </TableBody>
                    </Table>
                    </div>
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
            </>
        )
    }
}