"use client"
import * as React from "react"
import mime from 'mime'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { Button } from './ui/button.tsx'
import { SlidersHorizontalIcon, File01Icon, X, Folder01Icon, UserGroupIcon, PencilEdit02Icon, DocumentValidationIcon} from "@hugeicons/core-free-icons";
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
import { useEffect, useState} from "react";
import {getToken, useAuth} from "@clerk/react";
import FavoriteStar from "@/components/favoriteStar.tsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {Download01Icon} from "@hugeicons/core-free-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
type Document = {
    id: number;
    url: string;
    name: string;
    last_modified: string;
    lock: string;
    expiration_date: Date;
    mime_type: string;
    document_type: string;
    assigned_role: string;
    content_owner: string;
    document_status: string;
    favorite: boolean;
    lock_name: string;
    meta_tags: string[];
    created_at: string;
};

const handleDownload = async (doc: Document) => {
    try {
        createNotif(doc, "downloaded");
        const response = await fetch(doc.url);

        if (!response.ok) {
            throw new Error("Failed to fetch file");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = doc.name || "download";
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error(err);
    }
};

async function createNotif(doc: Document, action: string) {
    const token = await getToken();

    const res1 = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const me = await res1.json();
    console.log(me);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifs/create-notification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            public: true,
            targetRoles: [doc.assigned_role, "Administrator"],
            title: `${me.first_name} ${me.last_name} ${action} ${doc.name.substring(0, 12) + (doc.name.length >= 12 ? '...' : '')}`,
        })
    })

    if (!res.ok) {
        throw new Error("failed to create view notification")
    }
    console.log(await res.json());
}

async function setDocumentLock(sessionToken: string | null, documentID: number, status: boolean, setReload: (any) => void): Promise<string> {


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
    setReload(prev => !prev);
    return String(data);
}

interface DocProps<TData extends Document, TValue> {
    columns: ColumnDef<TData, TValue>[]
    reload: () => void
}

type FilterItem = {
    key: string;
    value: string;
    id: string;
    state: boolean;
};


function getTagFilters(docs: Document[],): FilterItem[] {
    const uniqueTags = Array.from(
        new Set(docs.flatMap(doc => doc.meta_tags ?? []))
    );

    return uniqueTags.map(tag => {
        return {
            key: "meta_tags",
            value: tag,
            id: tag,
            state: false
        };
    });
}


export function DocumentsTable<TData extends Document, TValue>({
                                             columns,
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
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [filters, setFilters] = useState<{key: string; value: string; id: string; state: boolean;}[]>([]);
    const[empID, setEmpID] = useState("");
    const[reload, setReload] = useState<boolean>(false);
    const [isTagOpen, setIsTagOpen] = useState(false);

    const [docFilters, setDocFilters] =  useState([
        {key: 'document_type', value: 'Reference', id: 'Reference', state: false},
        {key: 'document_type', value: 'Workflow', id: 'Workflow', state: false},
    ]);

    const [fileFilters, setFileFilters] =  useState([
        {key: 'mime_type', value: mime.getType('docx'), id: '.docx', state: false},
        {key: 'mime_type', value: mime.getType('jpg'), id: '.jpg', state: false},
        {key: 'mime_type', value: mime.getType('pdf'), id: '.pdf', state: false},
        {key: 'mime_type', value: mime.getType('png'), id: '.png', state: false},
        {key: 'mime_type', value: mime.getType('pptx'), id: '.pptx', state: false},
        {key: 'mime_type', value: mime.getType('txt'), id: '.txt', state: false},
        {key: 'mime_type', value: mime.getType('xlsx'), id: '.xlsx', state: false},
    ]);

    const [roleFilters, setRoleFilters] =  useState( [
        {key: 'assigned_role', value: 'ActuarialAnalyst', id: 'Actuarial Analyst', state: false},
        {key: 'assigned_role', value: 'BusinessAnalyst', id: 'Business Analyst', state: false},
        {key: 'assigned_role', value: 'BusinessOperator', id: 'Business Operator', state: false},
        {key: 'assigned_role', value: 'ExcelOperator', id: 'Excel Operator', state: false},
        {key: 'assigned_role', value: 'UnderWriter', id: 'Underwriter', state: false},
    ]);

    const [statusFilters, setStatusFilters] =  useState([
        {key: 'document_status', value: 'not_started', id: 'Not Started', state: false},
        {key: 'document_status', value: 'done', id: 'Done', state: false},
        {key: 'document_status', value: 'in_progress', id: 'In Progress', state: false},
        {key: 'document_status', value: 'needs_review', id: 'Needs Review', state: false},
    ])

    const [tagFilters, setTagFilters] =  useState<FilterItem[]>([]);

    const [tab, setTab] = useState("All");


    async function getDocumentsAdmin() {
        const token = await getToken();
        const payload: Record<string, string[]> = {};

        const docs = filters.filter(item => item.key === 'document_type');
        const files = filters.filter(item => item.key === 'mime_type');
        const roles = filters.filter(item => item.key === 'assigned_role');
        const tags = filters.filter(item => item.key === 'meta_tags');
        const statuses = filters.filter(item => item.key === 'document_status');

        if (docs.length > 0) {
            payload['document_type'] = docs.map(d => d.value);
        }
        if (files.length > 0) {
            payload['mime_type'] = files.map(d => d.value);
        }
        if (roles.length > 0 && tab == "All") {
            payload['assigned_role'] = roles.map(d => d.value);
        }
        if (tab !== "All") {
            payload['assigned_role'] = [tab];
        }
        if (tags.length > 0) {
            payload['meta_tags'] = tags.map(t => t.value);
        }
        if (statuses.length > 0) {
            payload['document_status'] = statuses.map(t => t.value);
        }
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/supabase/list-documents`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });
        
        if (!res.ok) {
            throw new Error("Failed to fetch docs")
        }
        const data = await res.json()
        return data
    }
    useEffect(() => {
        getDocumentsAdmin()
            .then((data) => {
                if (docs.length === 0) {
                    setTagFilters(getTagFilters(data));
                }
                setDocs(data);
            })
            .catch(console.error);
    }, [filters, reload]);

    useEffect(() => {
        if (!isSignedIn) {
            setMe(null);
            return;
        }

            async function load() {
                if(!isSignedIn) {
                    return;
                }
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
    }, []);


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
        }
        else {
            setFilters((filter) => filter.filter((item) => item.id !== option.id));
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
        setTagFilters(tgFilters =>
            tgFilters.map(filter =>
                filter.id === id ? { ...filter, state: !filter.state } : filter
            )
        );
        setStatusFilters(stFilters =>
            stFilters.map(filter =>
                filter.id === id ? { ...filter, state: !filter.state } : filter
            )
        );
    }
    useEffect(() => {
        setFilters(prev => {
            const withoutRoles = prev.filter(f => f.key !== "assigned_role");

            if (tab === "All") return withoutRoles;
            const selectedRole = roleFilters.find(f => f.value === tab);

            if (!selectedRole) return withoutRoles;
            return [...withoutRoles, selectedRole];
        });
    }, [tab]);
    if(roles.includes("administrator")) {
        return (
            <>
                <Tabs value={tab} onValueChange={setTab}>
                <div className="max-w-10xl mx-auto px-10 w-fulll py-10">
                    <div className="bg-white rounded-xl shadow-sm border p-4">
                        <div className="flex flex-col">
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
                                                                if(isTagOpen) {
                                                                    setIsTagOpen(!isTagOpen)
                                                                }
                                                                if(isStatusOpen) {
                                                                    setIsStatusOpen(!isStatusOpen)
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
                                                                if(isTagOpen) {
                                                                    setIsTagOpen(!isTagOpen)
                                                                }
                                                                if(isStatusOpen) {
                                                                    setIsStatusOpen(!isStatusOpen)
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
                                                    {tab === "All" ?
                                                    <div className="flex gap-x-0.5">
                                                        <button
                                                            onClick={() => {
                                                                if (isTypeOpen) {
                                                                    setIsTypeOpen(!isTypeOpen)
                                                                }
                                                                if (isDocumentOpen) {
                                                                    setIsDocumentOpen(!isDocumentOpen)
                                                                }
                                                                if(isTagOpen) {
                                                                    setIsTagOpen(!isTagOpen)
                                                                }
                                                                if(isStatusOpen) {
                                                                    setIsStatusOpen(!isStatusOpen)
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
                                                    </div> : null}

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
                                                                if (isRoleOpen) {
                                                                    setIsRoleOpen(!isRoleOpen)
                                                                }
                                                                if(isStatusOpen) {
                                                                    setIsStatusOpen(!isStatusOpen)
                                                                }
                                                                setIsTagOpen(!isTagOpen);
                                                            }}
                                                            className="flex px-4 py-1 ml-2 justify-center items-center  text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36"
                                                        >
                                                            <div className="pr-1"><HugeiconsIcon size={16} icon={PencilEdit02Icon}/></div>
                                                            Custom Tags
                                                        </button>
                                                        <button onClick={() => setIsTagOpen(false)} className="text-black">
                                                            <div className="ml-3"><HugeiconsIcon size={16} icon={X}/></div>
                                                        </button>
                                                    </div>

                                                    {isTagOpen && (
                                                        <div className="flex flex-col gap-2 absolute left-full top-0 z-10 mt-2 ml-3.5 w-40 bg-white shadow-lg rounded-md">
                                                            <div className="py-1">
                                                                {tagFilters.map((option) => (
                                                                    <div key={option.id} className="flex items-center justify-between">
                                                                        <label className="text-sm ml-2">{option.id}</label>
                                                                        <input
                                                                            id={option.id}
                                                                            type="checkbox"
                                                                            checked={option.state}
                                                                            onChange={(e) => handleCheckbox(e, option)}
                                                                            className="mr-3"
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
                                                                if (isRoleOpen) {
                                                                    setIsRoleOpen(!isRoleOpen)
                                                                }
                                                                if(isTagOpen) {
                                                                    setIsTagOpen(!isTagOpen)
                                                                }
                                                                setIsStatusOpen(!isStatusOpen);
                                                            }}
                                                            className="flex px-4 py-1 ml-2 justify-center items-center  text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36"
                                                        ><div className="pr-1"><HugeiconsIcon size={16} icon={DocumentValidationIcon}/></div>
                                                            Status
                                                        </button>
                                                        <button onClick={() => setIsTagOpen(false)} className="text-black">
                                                            <div className="ml-3"><HugeiconsIcon size={16} icon={X}/></div>
                                                        </button>
                                                    </div>

                                                    {isStatusOpen && (
                                                        <div className="flex flex-col gap-2 absolute left-full top-0 z-10 mt-2 ml-3.5 w-40 bg-white shadow-lg rounded-md">
                                                            <div className="py-1">
                                                                {statusFilters.map((option) => (
                                                                    <div key={option.id} className="flex items-center justify-between">
                                                                        <label className="text-sm ml-2">{option.id}</label>
                                                                        <input
                                                                            id={option.id}
                                                                            type="checkbox"
                                                                            checked={option.state}
                                                                            onChange={(e) => handleCheckbox(e, option)}
                                                                            className="mr-3"
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
                                <div className="relative inline-block text-left">
                                    <Button type="button" onClick={() => setReload(prev => !prev)} className="flex px-4 py-4 ml-2 "> Refresh </Button>
                                </div>
                                <div className="flex justify-end ml-auto">
                                    <ContentForm
                                        type="Create"
                                        currentID={Math.trunc((Math.random() * 10000) % 10000)}
                                        currentName=""
                                        currentURL=""
                                        currentContentOwner="Select Content Owner"
                                        currentRole="Select Role"
                                        currentExpirationDate={new Date()}
                                        currentExpirationTime="10:30:00"
                                        currentStatus="Select Status"
                                        size={true}
                                        lock="none"
                                        refresh={setReload}
                                        roles={roles}
                                    />
                                </div>
                            </div>
                            <div className="flex ">
                                <TabsList>
                                    <TabsTrigger value="All">All</TabsTrigger>
                                    <TabsTrigger value="ActuarialAnalyst">Actuarial Analyst</TabsTrigger>
                                    <TabsTrigger value="BusinessAnalyst">Business Analyst</TabsTrigger>
                                    <TabsTrigger value="BusinessOperator">Business Operator</TabsTrigger>
                                    <TabsTrigger value="ExcelOperator">Excel Operator</TabsTrigger>
                                    <TabsTrigger value="UnderWriter">Under Writer</TabsTrigger>
                                </TabsList>
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
                                        setTagFilters(tgFilters =>
                                            tgFilters.map(filter =>
                                                filter.id === option.id ? { ...filter, state: !filter.state } : filter
                                            )
                                        );
                                        setStatusFilters(stFilters =>
                                            stFilters.map(filter =>
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
                                        <TableHead className=" text-[#0b4461] text-left px-5"> Favorite </TableHead>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead className=" text-[#0b4461] text-left px-5" key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                        <TableHead className="text-[#0b4461] px-5 text-right">Actions</TableHead>
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.map((row) => {
                                    const doc = row.original;

                                    return (
                                        (doc.lock === "none" || doc.lock === empID) ? (
                                        <TableRow key={row.id}>
                                            <FavoriteStar
                                                doc={doc}
                                                onToggleOn={(doc) => toggleFavorite(doc, false)}
                                                onToggleOff={(doc) => toggleFavorite(doc, true)}
                                            />

                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="px-5 py-0.5 text-left whitespace-normal">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                            {doc.lock === "none"?(
                                            <TableCell>
                                                <div className="flex items-center gap-1 justify-end">
                                                    {/*<a*/}
                                                    {/*    href={doc.url}*/}
                                                    {/*    target="_blank"*/}
                                                    {/*    rel="noopener noreferrer"*/}
                                                    {/*    className="hover:underline"*/}
                                                    {/*    download*/}
                                                    {/*>*/}
                                                    {/*    <HugeiconsIcon icon={Download01Icon} />*/}
                                                    {/*</a>*/}
                                                    <Button onClick={async () => await handleDownload(doc)}>
                                                        <HugeiconsIcon icon={Download01Icon} />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground" onClick={async () => {
                                                        const token = await getToken();
                                                        await setDocumentLock(token, doc.id, true, setReload)
                                                    }}><Lock /></Button>
                                                </div>
                                            </TableCell>
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
                                                        currentExpirationTime={"10:30:00"}
                                                        currentStatus={doc.document_status}
                                                        size={false}
                                                        lock={doc.lock}
                                                        refresh={setReload}
                                                        roles={roles}
                                                    />
                                                )}
                                                    <DeleteConfirmationPopup target={doc} refresh={setReload}/>
                                                    {/*<a*/}
                                                    {/*    href={doc.url}*/}
                                                    {/*    target="_blank"*/}
                                                    {/*    rel="noopener noreferrer"*/}
                                                    {/*    className="hover:underline"*/}
                                                    {/*    download*/}
                                                    {/*>*/}
                                                    {/*    <HugeiconsIcon icon={Download01Icon} />*/}
                                                    {/*</a>*/}
                                                    <Button onClick={async () => await handleDownload(doc)}>
                                                        <HugeiconsIcon icon={Download01Icon} />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground" onClick={async () => {
                                                        const token = await getToken();
                                                        await setDocumentLock(token, doc.id, false, setReload)
                                                    }}><LockOpen /></Button>

                                                </div>
                                            </TableCell>
                                                    ):(
                                                    <TableCell><p>{doc.lock_name}</p></TableCell> )
                                            }
                                        </TableRow> ) : (
                                            <TableRow key={row.id} className="bg-[#e6e8e8]">
                                                <FavoriteStar
                                                    doc={doc}
                                                    onToggleOn={(doc) => toggleFavorite(doc, false)}
                                                    onToggleOff={(doc) => toggleFavorite(doc, true)}
                                                />
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id} className="px-5 py-0.5 text-left whitespace-normal">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                                <TableCell>
                                                    <div className="flex items-center justify-end gap-3">

                                                        <div className="flex flex-col text-right">
                                                            <p className="text-xs">Checked out by:</p>
                                                            <p className="text-sm font-medium">{doc.lock_name}</p>
                                                        </div>

                                                        {/*<a*/}
                                                        {/*    href={doc.url}*/}
                                                        {/*    target="_blank"*/}
                                                        {/*    rel="noopener noreferrer"*/}
                                                        {/*    className="hover:underline"*/}
                                                        {/*    download*/}
                                                        {/*>*/}
                                                        {/*    <HugeiconsIcon icon={Download01Icon} />*/}
                                                        {/*</a>*/}
                                                        <Button onClick={async () => await handleDownload(doc)}>
                                                            <HugeiconsIcon icon={Download01Icon} />
                                                        </Button>

                                                    </div>
                                                </TableCell>
                                            </TableRow>

                                        )
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
                </Tabs>
            </>
        )
    }
    else{
        return(
            <>
                <Tabs value={tab} onValueChange={setTab}>
                <div className="max-w-10xl mx-auto px-10 w-full py-10">
                    <div className="bg-white rounded-xl shadow-sm border p-4">
                        <div className="flex flex-col">
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
                                                                if(isTagOpen) {
                                                                    setIsTagOpen(!isTagOpen)
                                                                }
                                                                if(isStatusOpen) {
                                                                    setIsStatusOpen(!isStatusOpen)
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
                                                                if(isTagOpen) {
                                                                    setIsTagOpen(!isTagOpen)
                                                                }
                                                                if(isStatusOpen) {
                                                                    setIsStatusOpen(!isStatusOpen)
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
                                                    {tab === "All" ?
                                                    <div className="flex gap-x-0.5">
                                                        <button
                                                            onClick={() => {
                                                                if (isTypeOpen) {
                                                                    setIsTypeOpen(!isTypeOpen)
                                                                }
                                                                if (isDocumentOpen) {
                                                                    setIsDocumentOpen(!isDocumentOpen)
                                                                }
                                                                if(isTagOpen) {
                                                                    setIsTagOpen(!isTagOpen)
                                                                }
                                                                if(isStatusOpen) {
                                                                    setIsStatusOpen(!isStatusOpen)
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
                                                    </div> : null}

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
                                                                if (isRoleOpen) {
                                                                    setIsRoleOpen(!isRoleOpen)
                                                                }
                                                                if(isStatusOpen) {
                                                                    setIsStatusOpen(!isStatusOpen)
                                                                }
                                                                setIsTagOpen(!isTagOpen);
                                                            }}
                                                            className="flex px-4 py-1 ml-2 justify-center items-center  text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36">
                                                        <div className="pr-1"><HugeiconsIcon size={16} icon={PencilEdit02Icon}/></div>
                                                    Custom Tags
                                                        </button>
                                                        <button onClick={() => setIsTagOpen(false)} className="text-black">
                                                            <div className="ml-3"><HugeiconsIcon size={16} icon={X}/></div>
                                                        </button>
                                                    </div>

                                                    {isTagOpen && (
                                                        <div className="flex flex-col gap-2 absolute left-full top-0 z-10 mt-2 ml-3.5 w-40 bg-white shadow-lg rounded-md">
                                                            <div className="py-1">
                                                                {tagFilters.map((option) => (
                                                                    <div key={option.id} className="flex items-center justify-between">
                                                                        <label className="text-sm ml-2">{option.id}</label>
                                                                        <input
                                                                            id={option.id}
                                                                            type="checkbox"
                                                                            checked={option.state}
                                                                            onChange={(e) => handleCheckbox(e, option)}
                                                                            className="mr-3"
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
                                                                if (isRoleOpen) {
                                                                    setIsRoleOpen(!isRoleOpen)
                                                                }
                                                                if(isTagOpen) {
                                                                    setIsTagOpen(!isTagOpen)
                                                                }
                                                                setIsStatusOpen(!isStatusOpen);
                                                            }}
                                                            className="flex px-4 py-1 ml-2 justify-center items-center  text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36"
                                                        ><div className="pr-1"><HugeiconsIcon size={16} icon={DocumentValidationIcon}/></div>
                                                            Status
                                                        </button>
                                                        <button onClick={() => setIsTagOpen(false)} className="text-black">
                                                            <div className="ml-3"><HugeiconsIcon size={16} icon={X}/></div>
                                                        </button>
                                                    </div>

                                                    {isStatusOpen && (
                                                        <div className="flex flex-col gap-2 absolute left-full top-0 z-10 mt-2 ml-3.5 w-40 bg-white shadow-lg rounded-md">
                                                            <div className="py-1">
                                                                {statusFilters.map((option) => (
                                                                    <div key={option.id} className="flex items-center justify-between">
                                                                        <label className="text-sm ml-2">{option.id}</label>
                                                                        <input
                                                                            id={option.id}
                                                                            type="checkbox"
                                                                            checked={option.state}
                                                                            onChange={(e) => handleCheckbox(e, option)}
                                                                            className="mr-3"
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
                                    <Button type="button" onClick={() => setReload(prev => !prev)}> Refresh </Button>
                                    <ContentForm
                                        type="Create"
                                        currentID={Math.trunc((Math.random() * 10000) % 10000)}
                                        currentName=""
                                        currentURL=""
                                        currentContentOwner="Select Content Owner"
                                        currentRole="Select Role"
                                        currentExpirationDate={new Date()}
                                        currentExpirationTime="10:30:00"
                                        currentStatus="Select Status"
                                        size={true}
                                        lock="none"
                                        refresh={setReload}
                                        roles={roles}
                                    />
                                </div>
                            </div>
                            <div className="flex ">
                                <TabsList>
                                    <TabsTrigger value="All">All</TabsTrigger>
                                    <TabsTrigger value="ActuarialAnalyst">Actuarial Analyst</TabsTrigger>
                                    <TabsTrigger value="BusinessAnalyst">Business Analyst</TabsTrigger>
                                    <TabsTrigger value="BusinessOperator">Business Operator</TabsTrigger>
                                    <TabsTrigger value="ExcelOperator">Excel Operator</TabsTrigger>
                                    <TabsTrigger value="UnderWriter">Under Writer</TabsTrigger>
                                </TabsList>
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
                                        setTagFilters(tgFilters =>
                                            tgFilters.map(filter =>
                                                filter.id === option.id ? { ...filter, state: !filter.state } : filter
                                            )
                                        );
                                        setStatusFilters(stFilters =>
                                            stFilters.map(filter =>
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
                            <TableHeader className="bg-[#ecf4f9] text-[#0b4461] text-left">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        <TableHead className=" text-[#0b4461] text-left px-5"> Favorite </TableHead>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead className=" text-[#0b4461] text-left px-5" key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                        <TableHead className="text-[#0b4461] px-5 text-right pr-30">Actions</TableHead>
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.map((row) => {
                                    const doc = row.original;

                                    const canEdit =
                                        ((roles.includes("underwriter") && doc.assigned_role === "UnderWriter")) ||
                                        ((roles.includes("businessanalyst") && doc.assigned_role === "BusinessAnalyst")) ||
                                        ((roles.includes("actuarialanalyst") && doc.assigned_role === "ActuarialAnalyst")) ||
                                        ((roles.includes("exceloperator") && doc.assigned_role === "ExcelOperator")) ||
                                        ((roles.includes("businessoperator") && doc.assigned_role === "BusinessOperator"))

                                    return (
                                        (doc.lock === "none" || doc.lock === empID) ? (
                                        <TableRow key={row.id}>
                                            <FavoriteStar
                                                doc={doc}
                                                onToggleOn={(doc) => toggleFavorite(doc, false)}
                                                onToggleOff={(doc) => toggleFavorite(doc, true)}
                                            />
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="px-5 py-0.5 text-left whitespace-normal">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                            {!canEdit ? (
                                                <TableCell>
                                                    <div className="flex items-center justify-end gap-2">
                                                        {/*<a*/}
                                                        {/*    href={doc.url}*/}
                                                        {/*    target="_blank"*/}
                                                        {/*    rel="noopener noreferrer"*/}
                                                        {/*    className="hover:underline"*/}
                                                        {/*    download*/}
                                                        {/*>*/}
                                                        {/*    <HugeiconsIcon icon={Download01Icon}/>*/}
                                                        {/*</a>*/}
                                                        <Button onClick={async () => await handleDownload(doc)}>
                                                            <HugeiconsIcon icon={Download01Icon} />
                                                        </Button>
                                                    </div>
                                                </TableCell> ) :
                                            doc.lock === "none" ? (
                                                        <TableCell>
                                                            <div className="flex items-center justify-end gap-2">
                                                                {/*<a*/}
                                                                {/*    href={doc.url}*/}
                                                                {/*    target="_blank"*/}
                                                                {/*    rel="noopener noreferrer"*/}
                                                                {/*    className="hover:underline"*/}
                                                                {/*    download*/}
                                                                {/*>*/}
                                                                {/*    <HugeiconsIcon icon={Download01Icon}/>*/}
                                                                {/*</a>*/}
                                                                <Button onClick={async () => await handleDownload(doc)}>
                                                                    <HugeiconsIcon icon={Download01Icon} />
                                                                </Button>
                                                                <Button variant="outline" size="icon"
                                                                        className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground"
                                                                        onClick={async () => {
                                                                            const token = await getToken();
                                                                            await setDocumentLock(token, doc.id, true, setReload)
                                                                        }}><Lock/></Button>
                                                            </div>
                                                        </TableCell>
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
                                                                    currentExpirationTime="10:30:00"
                                                                    currentStatus={doc.document_status}
                                                                    size={false}
                                                                    lock={doc.lock}
                                                                    refresh={setReload}
                                                                    roles={roles}
                                                                />
                                                            )}

                                                            {canEdit && (
                                                                <DeleteConfirmationPopup target={doc} refresh={setReload} />
                                                            )}
                                                            {/*<a*/}
                                                            {/*    href={doc.url}*/}
                                                            {/*    target="_blank"*/}
                                                            {/*    rel="noopener noreferrer"*/}
                                                            {/*    className="hover:underline"*/}
                                                            {/*    download*/}
                                                            {/*>*/}
                                                            {/*    <HugeiconsIcon icon={Download01Icon} />*/}
                                                            {/*</a>*/}
                                                            <Button onClick={async () => await handleDownload(doc)}>
                                                                <HugeiconsIcon icon={Download01Icon} />
                                                            </Button>
                                                            <Button variant="outline" size="icon" className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground" onClick={async () => {
                                                                const token = await getToken();
                                                                await setDocumentLock(token, doc.id, false, setReload)
                                                            }}><LockOpen /></Button>
                                                        </div>
                                                    </TableCell>) : (
                                                    <div className="flex flex-col text-right">
                                                        <p className="text-xs">Checked out by:</p>
                                                        <p className="text-sm font-medium">{doc.lock_name}</p>
                                                    </div>)
                                            }
                                        </TableRow>
                                            ): (
                                                <TableRow key={row.id} className="bg-[#e6e8e8]">
                                                    <FavoriteStar
                                                        doc={doc}
                                                        onToggleOn={(doc) => toggleFavorite(doc, false)}
                                                        onToggleOff={(doc) => toggleFavorite(doc, true)}
                                                    />
                                                    {row.getVisibleCells().map((cell) => (
                                                        <TableCell key={cell.id} className="px-5 py-0.5 text-left whitespace-normal">
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </TableCell>
                                                    ))}
                                                    <TableCell>
                                                        <div className="flex items-center justify-end gap-3">

                                                            <div className="flex flex-col text-right">
                                                                <p className="text-xs">Checked out by:</p>
                                                                <p className="text-sm font-medium">{doc.lock_name}</p>
                                                            </div>

                                                            {/*<a*/}
                                                            {/*    href={doc.url}*/}
                                                            {/*    target="_blank"*/}
                                                            {/*    rel="noopener noreferrer"*/}
                                                            {/*    className="hover:underline"*/}
                                                            {/*    download*/}
                                                            {/*>*/}
                                                            {/*    <HugeiconsIcon icon={Download01Icon} />*/}
                                                            {/*</a>*/}
                                                            <Button onClick={async () => await handleDownload(doc)}>
                                                                <HugeiconsIcon icon={Download01Icon} />
                                                            </Button>

                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                        )
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
                </Tabs>
            </>
        )
    }
}