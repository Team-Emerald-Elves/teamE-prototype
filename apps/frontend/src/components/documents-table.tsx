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
import { SlidersHorizontalIcon, File01Icon, X, Folder01Icon, UserGroupIcon} from "@hugeicons/core-free-icons";
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
import {getToken, useAuth, useUser} from "@clerk/react";
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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDocumentOpen, setIsDocumentOpen] = useState(false);
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [filters, setFilters] = useState<{key: string; value: string; id: string; state: boolean;}[]>([]);
    const[empID, setEmpID] = useState("");

    const [docFilters, setDocFilters] =  useState([
        {key: 'document_type', value: 'Workflow', id: 'Workflow', state: false},
        {key: 'document_type', value: 'Reference', id: 'Reference', state: false},
    ]);

    const [fileFilters, setFileFilters] =  useState([
        {key: 'mime_type', value: 'pdf', id: '.pdf', state: false},
        {key: 'mime_type', value: 'docx', id: '.docx', state: false},
        {key: 'mime_type', value: 'xlsx', id: '.xlsx', state: false},
        {key: 'mime_type', value: 'txt', id: '.txt', state: false},
        {key: 'mime_type', value: 'pptx', id: '.pptx', state: false},
        {key: 'mime_type', value: 'png', id: '.png', state: false},
    ]);

    const [roleFilters, setRoleFilters] =  useState( [
        {key: 'assigned_role', value: 'BusinessAnalyst', id: 'Business Analyst', state: false},
        {key: 'assigned_role', value: 'UnderWriter', id: 'Underwriter', state: false},
    ]);

    const getActive = () => {
        const payload: Record<string, string[]> = {};

        const docs = filters.filter(item => item.key === 'document_type');
        const files = filters.filter(item => item.key === 'mime_type');
        const roles = filters.filter(item => item.key === 'assigned_role');

        if (docs.length > 0) {
            payload['document_type'] = docs.map(d => d.value);
        }
        if (files.length > 0) {
            payload['mime_type'] = files.map(d => d.value);
        }
        if (roles.length > 0) {
            payload['assigned_role'] = roles.map(d => d.value);
        }

        return JSON.stringify(payload);
    };
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
    const toggleFavorite = async (doc: Document, nextValue: boolean) => {
        try {
            const token = await getToken();

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/update-favorite`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        id: doc.id,
                        favorite: nextValue,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to update favorite");
            }

            setDocs((prev) =>
                prev.map((d) =>
                    d.id === doc.id ? { ...d, favorite: nextValue } : d
                )
            );
        } catch (err) {
            console.error(err);
        }
    };


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
        setDocFilters(dcFilters =>
            dcFilters.map(filter =>
                filter.id === id ? { ...filter, state: !filter.state } : filter
            )
        );
        setFileFilters(fiFilters =>
            fiFilters.map(filter =>
                filter.id === id ? { ...filter, state: !filter.state } : filter
            )
        );
        setRoleFilters(rlFilters =>
            rlFilters.map(filter =>
                filter.id === id ? { ...filter, state: !filter.state } : filter
            )
        );
    }
    if(roles.includes("Administrator")) {
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
                            <div className="relative inline-block text-left">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex px-4 py-1 ml-2 bg-gray-400 text-white rounded-md hover:bg-gray-600"
                                >
                                    <div className="pr-1"><HugeiconsIcon icon={SlidersHorizontalIcon}/></div>
                                    Filter
                                </button>

                                {isDropdownOpen && (
                                    <div
                                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                        <div className="py-1">
                                            <div className="relative inline-block text-left">
                                                <div className="flex gap-x-0.5">
                                                    <button
                                                        onClick={() => {
                                                            if (isTypeOpen) {
                                                                setIsTypeOpen(!isTypeOpen)
                                                            }
                                                            if (isRoleOpen) {
                                                                setIsRoleOpen(!isRoleOpen)
                                                            }
                                                            setIsDocumentOpen(!isDocumentOpen)
                                                        }}
                                                        className="flex px-4 py-1 ml-2  text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36">
                                                        <div className="pr-1"><HugeiconsIcon size={16} icon={File01Icon}/></div>
                                                        Document Type
                                                    </button>
                                                    <button onClick={() => {
                                                        if (isDocumentOpen) {
                                                            setIsDocumentOpen(!isDocumentOpen)
                                                        }
                                                    }}
                                                            className="text-black">
                                                        <div className="ml-3"><HugeiconsIcon size={16} icon={X}/></div>
                                                    </button>
                                                </div>

                                                {isDocumentOpen && (
                                                    <div
                                                        className=" flex flex-col gap-4 absolute left-full top-0 z-10 mt-2 ml-3.5 w-33 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                                        <div className="py-1">
                                                            {docFilters.map((option) => (
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

                                            <div className="relative inline-block text-left">
                                                <div className="flex gap-x-0.5">
                                                    <button

                                                        onClick={() => {
                                                            if (isDocumentOpen) {
                                                                setIsDocumentOpen(!isDocumentOpen)
                                                            }
                                                            if (isRoleOpen) {
                                                                setIsRoleOpen(!isRoleOpen)
                                                            }
                                                            setIsTypeOpen(!isTypeOpen)
                                                        }}
                                                        className="flex px-4 py-1 ml-2 justify-center items-center  text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36"
                                                    >
                                                        <div className="pr-1"><HugeiconsIcon size={16} icon={Folder01Icon}/></div>
                                                        File Type
                                                    </button>
                                                    <button onClick={() => {
                                                        if (isTypeOpen) {
                                                            setIsTypeOpen(!isTypeOpen)
                                                        }
                                                    }}
                                                            className="text-black">
                                                        <div className="ml-3"><HugeiconsIcon size={16} icon={X}/></div>
                                                    </button>
                                                </div>

                                                {isTypeOpen && (
                                                    <div
                                                        className=" flex flex-col gap-4 absolute left-full top-0 z-10 mt-2 ml-3.5 w-33 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                                        <div className="py-1">
                                                            {fileFilters.map((option) => (
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
                                            <div className="relative inline-block text-left">
                                                <div className="flex gap-x-0.5">
                                                    <button
                                                        onClick={() => {
                                                            if (isTypeOpen) {
                                                                setIsTypeOpen(!isTypeOpen)
                                                            }
                                                            if (isDocumentOpen) {
                                                                setIsDocumentOpen(!isDocumentOpen)
                                                            }
                                                            setIsRoleOpen(!isRoleOpen)
                                                        }}
                                                        className="flex px-4 py-1 ml-2 justify-center items-center  text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36"
                                                    >
                                                        <div className="pr-1"><HugeiconsIcon size={16} icon={UserGroupIcon}/>
                                                        </div>
                                                        Role
                                                    </button>
                                                    <button onClick={() => {
                                                        if (isRoleOpen) {
                                                            setIsRoleOpen(!isRoleOpen)
                                                        }
                                                    }}
                                                            className="text-black">
                                                        <div className="ml-3"><HugeiconsIcon size={16} icon={X}/></div>
                                                    </button>
                                                </div>

                                                {isRoleOpen && (

                                                    <div
                                                        className=" flex flex-col gap-4 absolute left-full top-0 z-10 mt-2 ml-3.5 w-46 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
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
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="py-1 mb-2 flex flex-row flex-wrap gap-2">
                                {filters.map((option) => (
                                    <div key={option.id} className=" flex  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 ">
                                        <p className=" px-2 py-1 text-gray-800 rounded-md text-xs "> {option.id}</p>
                                        <button onClick={() => {
                                            setFilters((filter) => filter.filter((filterId) => filterId !== option));
                                            setDocFilters(dcFilters =>
                                                dcFilters.map(filter =>
                                                    filter.id === option.id ? { ...filter, state: !filter.state } : filter
                                                )
                                            );
                                            setFileFilters(fiFilters =>
                                                fiFilters.map(filter =>
                                                    filter.id === option.id ? { ...filter, state: !filter.state } : filter
                                                )
                                            );
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
                                                onToggleOn={(doc) => toggleFavorite(doc, false)}
                                                onToggleOff={(doc) => toggleFavorite(doc, true)}
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
                                                    <TableCell><p>{empID}</p></TableCell> )
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
                            <InputGroup
                                className="flex-1 max-w-2xl h-8 border-2 shadow-md hover:shadow-xl transition-all duration-100 bg-white">
                                <InputGroupInput
                                    placeholder="Search"
                                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                    onChange={(event) =>
                                        table.getColumn("name")?.setFilterValue(event.target.value)
                                    }
                                    className="w-full"
                                />
                                <InputGroupAddon>
                                    <Search/>
                                </InputGroupAddon>
                            </InputGroup>
                            <div className="relative inline-block text-left">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex px-4 py-1 ml-2 bg-gray-400 text-white rounded-md hover:bg-gray-600"
                                >
                                    <div className="pr-1"><HugeiconsIcon icon={SlidersHorizontalIcon}/></div>
                                    Filter
                                </button>

                                {isDropdownOpen && (
                                    <div
                                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                        <div className="py-1">
                                            <div className="relative inline-block text-left">
                                                <div className="flex gap-x-0.5">
                                                    <button
                                                        onClick={() => {
                                                            if (isTypeOpen) {
                                                                setIsTypeOpen(!isTypeOpen)
                                                            }
                                                            if (isRoleOpen) {
                                                                setIsRoleOpen(!isRoleOpen)
                                                            }
                                                            setIsDocumentOpen(!isDocumentOpen)
                                                        }}
                                                        className="flex px-4 py-1 ml-2  text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36">
                                                        <div className="pr-1"><HugeiconsIcon size={16} icon={File01Icon}/></div>
                                                        Document Type
                                                    </button>
                                                    <button onClick={() => {
                                                        if (isDocumentOpen) {
                                                            setIsDocumentOpen(!isDocumentOpen)
                                                        }
                                                    }}
                                                            className="text-black">
                                                        <div className="ml-3"><HugeiconsIcon size={16} icon={X}/></div>
                                                    </button>
                                                </div>

                                                {isDocumentOpen && (
                                                    <div
                                                        className=" flex flex-col gap-4 absolute left-full top-0 z-10 mt-2 ml-3.5 w-33 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                                        <div className="py-1">
                                                            {docFilters.map((option) => (
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

                                            <div className="relative inline-block text-left">
                                                <div className="flex gap-x-0.5">
                                                    <button

                                                        onClick={() => {
                                                            if (isDocumentOpen) {
                                                                setIsDocumentOpen(!isDocumentOpen)
                                                            }
                                                            if (isRoleOpen) {
                                                                setIsRoleOpen(!isRoleOpen)
                                                            }
                                                            setIsTypeOpen(!isTypeOpen)
                                                        }}
                                                        className="flex px-4 py-1 ml-2 justify-center items-center  text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36"
                                                    >
                                                        <div className="pr-1"><HugeiconsIcon size={16} icon={Folder01Icon}/></div>
                                                        File Type
                                                    </button>
                                                    <button onClick={() => {
                                                        if (isTypeOpen) {
                                                            setIsTypeOpen(!isTypeOpen)
                                                        }
                                                    }}
                                                            className="text-black">
                                                        <div className="ml-3"><HugeiconsIcon size={16} icon={X}/></div>
                                                    </button>
                                                </div>

                                                {isTypeOpen && (
                                                    <div
                                                        className=" flex flex-col gap-4 absolute left-full top-0 z-10 mt-2 ml-3.5 w-33 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                                        <div className="py-1">
                                                            {fileFilters.map((option) => (
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
                                            <div className="relative inline-block text-left">
                                                <div className="flex gap-x-0.5">
                                                    <button
                                                        onClick={() => {
                                                            if (isTypeOpen) {
                                                                setIsTypeOpen(!isTypeOpen)
                                                            }
                                                            if (isDocumentOpen) {
                                                                setIsDocumentOpen(!isDocumentOpen)
                                                            }
                                                            setIsRoleOpen(!isRoleOpen)
                                                        }}
                                                        className="flex px-4 py-1 ml-2 justify-center items-center  text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36"
                                                    >
                                                        <div className="pr-1"><HugeiconsIcon size={16} icon={UserGroupIcon}/>
                                                        </div>
                                                        Role
                                                    </button>
                                                    <button onClick={() => {
                                                        if (isRoleOpen) {
                                                            setIsRoleOpen(!isRoleOpen)
                                                        }
                                                    }}
                                                            className="text-black">
                                                        <div className="ml-3"><HugeiconsIcon size={16} icon={X}/></div>
                                                    </button>
                                                </div>

                                                {isRoleOpen && (

                                                    <div
                                                        className=" flex flex-col gap-4 absolute left-full top-0 z-10 mt-2 ml-3.5 w-46 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
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
                                        </div>
                                    </div>
                                )}
                            </div>
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
                        <div className="py-1 mb-2 flex flex-row flex-wrap gap-2">
                            {filters.map((option) => (
                                <div key={option.id} className=" flex  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 ">
                                    <p className=" px-2 py-1 text-gray-800 rounded-md text-xs "> {option.id}</p>
                                    <button onClick={() => {
                                        setFilters((filter) => filter.filter((filterId) => filterId !== option));
                                        setDocFilters(dcFilters =>
                                            dcFilters.map(filter =>
                                                filter.id === option.id ? { ...filter, state: !filter.state } : filter
                                            )
                                        );
                                        setFileFilters(fiFilters =>
                                            fiFilters.map(filter =>
                                                filter.id === option.id ? { ...filter, state: !filter.state } : filter
                                            )
                                        );
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
                                        (roles.includes("underwriter") && doc.assigned_role === "UnderWriter") && (doc.lock != "none") ||
                                        (roles.includes("businessanalyst") && doc.assigned_role === "BusinessAnalyst") && (doc.lock != "none")
                                    return (
                                        <TableRow key={row.id}>
                                            <FavoriteStar
                                                doc={doc}
                                                onToggleOn={(doc) => toggleFavorite(doc, false)}
                                                onToggleOff={(doc) => toggleFavorite(doc, true)}
                                            />
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="px-1 py-0.5 text-center">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                            {doc.lock === "none" ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <TableCell>
                                                            <a
                                                                href={doc.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="hover:underline"
                                                            >
                                                                <HugeiconsIcon icon={Download01Icon}/>
                                                            </a>
                                                            <Button variant="outline" size="icon"
                                                                    className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground"
                                                                    onClick={async () => {
                                                                        const token = await getToken();
                                                                        await setDocumentLock(token, doc.id, true)
                                                                    }}><Lock/></Button>
                                                        </TableCell>
                                                    </div>
                                                ) :
                                                doc.lock === empID ? (
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
                                                                <DeleteConfirmationPopup target={doc.id}/>
                                                            )}
                                                            <a
                                                                href={doc.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="hover:underline"
                                                            >
                                                                <HugeiconsIcon icon={Download01Icon}/>
                                                            </a>
                                                            <Button variant="outline" size="icon"
                                                                    className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground"
                                                                    onClick={async () => {
                                                                        const token = await getToken();
                                                                        await setDocumentLock(token, doc.id, false)
                                                                    }}><LockOpen/></Button>
                                                        </div>
                                                    </TableCell>) : (
                                                    <TableCell><p>{empID}</p></TableCell>)
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