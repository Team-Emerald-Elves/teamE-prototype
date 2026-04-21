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
// import { Button } from "@/components/ui/button"
// import {useEffect, useState} from "react";
// import Editlinksform from "@/components/editlinksform.tsx";
// import DeletePopupConfirmationLinks from "@/components/deletePopupConfirmationLinks.tsx";
// import type { Links,
//               linksProps
// } from './types/linkstable.d.ts';
// import {useAuth} from "@clerk/react";
// import AddLinksForm from "@/components/addlinksform.tsx";
//
// async function getLinks() {
//     const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/links`);
//
//     if (!res.ok) {
//         throw new Error("Failed to fetch links");
//     }
//     const data = await res.json();
//     return data;
// }
//
// async function getRoleLinks(linkOwner: string) {
//
//     const reqData ={
//         owner: linkOwner
//     }
//     const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get-link-role`, { method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(reqData)
//     });
//
//     if (!res.ok) {
//         throw new Error("Failed to fetch links");
//     }
//     const data = await res.json();
//
//     return data;
// }
//
// function LinksTable(){
//     const [roles, setRoles] = useState<string[]>([]);
//     const { getToken, isSignedIn } = useAuth();
//     const [links, setLinks] = useState<Links[]>([]);
//     const [me, setMe] = useState(null);
//
//     useEffect(() => {
//         if (!isSignedIn) {
//             setMe(null);
//             return;
//         }
//
//         async function load() {
//             const token = await getToken();
//
//             const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/me`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//
//             const data = await res.json();
//             setMe(data);
//             setRoles((data.roles as string[]).map((role: string) => role.toLowerCase()))
//         }
//
//         load();
//     }, [isSignedIn]);
//
//     useEffect(() => {
//         if (roles.length === 0) return; // wait until roles are loaded
//
//         if (roles.includes("administrator")) {
//             getLinks()
//                 .then(setLinks)
//                 .catch(console.error);
//         } else {
//             getRoleLinks(me.roles.at(0))
//                 .then(setLinks)
//                 .catch(console.error);
//         }
//     }, [roles]);
//
//     return (
//         <>
//             <div className="max-w-10xl mx-auto px-6 py-6">
//                 <div className="bg-white rounded-xl shadow-sm border p-4">
//                     <div className="flex justify-end">
//                     <div className="pr-6 py-2 relative flex items-center">
//                         <AddLinksForm
//                             type="Add Link"
//                             name="Name"
//                             url="www.example.com"
//                             description="What is the link used for"
//                             size={true}
//                             me={me}
//                         />
//                     </div>
//                     </div>
//                 <Table className="border rounded-lg overflow-hidden">
//                     <TableHeader className="bg-[#ecf4f9] text-[#0b4461]">
//                         <TableRow >
//                             <TableHead className=" text-[#0b4461] text-left">Name</TableHead>
//                             <TableHead className=" text-[#0b4461] text-left">URL</TableHead>
//                             <TableHead className=" text-[#0b4461] text-left">Role</TableHead>
//                             <TableHead></TableHead>
//                             <TableHead className="flex text-left items-center pl-[35px] text-[#0b4461]">Action</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {links.map((l) => (
//                             <TableRow key={l.link_name}>
//                                 <TableCell>{l.link_name}</TableCell>
//                                 <TableCell><a href={l.url}>{l.url}</a></TableCell>
//                                 <TableCell>{l.owner}</TableCell>
//                                 <TableCell></TableCell>
//
//                                 <TableCell className="flex items-center gap-3">
//                                     <Editlinksform
//                                         id={l.id}
//                                         name ={l.link_name}
//                                         url ={l.url}
//                                         owner={roles.at(0)}
//                                     />
//                                     <Button variant = "destructive" size = "icon">
//                                        <DeletePopupConfirmationLinks link={l} />
//                                     </Button>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </div>
//             </div>
//         </>
//     )
// }
//
// export default LinksTable;

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
import {getToken, useAuth, useUser} from "@clerk/react";
import FavoriteStar from "@/components/favoriteStar.tsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {Download01Icon} from "@hugeicons/core-free-icons";
import AddLinksForm from "@/components/addlinksform.tsx";
import Editlinksform from "@/components/editlinksform.tsx";
import DeletePopupConfirmationLinks from "@/components/deletePopupConfirmationLinks.tsx";

type Links = {
   id: string;
   link_name: string;
   url: string;
   owner: string;
   favorite: boolean;
};

type Document = {
    id: number;
    url: string;
    name: string;
    last_modified: string;
    lock: boolean;
    expiration_date: string;
    mime_type: string;
    document_type: string;
    assigned_role: string;
    content_owner: string;
    document_status: string;
    favorite: boolean;
};

interface LinkProps<TData extends Links, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}


export default function LinksTable<TData extends Links, TValue>({
                                                                   columns,
                                                                   data,
                                                               }: LinkProps<TData, TValue>) {
    const [roles, setRoles] = useState<string[]>([]);
    const { getToken, isSignedIn } = useAuth();
    const [me, setMe] = useState(null);
    const[links, setLinks] = useState<Links[]>([]);
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
        setLinks(data);
    }, [data]);

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const table = useReactTable({
        data: links,
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
    const toggleFavorite = async (link: Document | Links, nextValue: boolean) => {
        try {
            const token = await getToken();

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/update-favorite-link`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        id: link.id,
                        favorite: nextValue,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to update favorite");
            }

            setLinks((prev) =>
                prev.map((l) =>
                    l.id === link.id ? { ...l, favorite: nextValue } : l
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    if(roles.includes("administrator")) {
        return (
            <>
                <div className="max-w-10xl mx-auto px-10 py-10">
                    <div className="bg-white rounded-xl shadow-sm border p-4">
                        <div className="flex items-center mb-4">
                            <InputGroup className="flex-1 max-w-2xl h-8 border-2 shadow-md hover:shadow-xl transition-all duration-100 bg-white">
                                <InputGroupInput
                                    placeholder="Search"
                                    value={(table.getColumn("link_name")?.getFilterValue() as string) ?? ""}
                                    onChange={(event) =>
                                        table.getColumn("link_name")?.setFilterValue(event.target.value)
                                    }
                                    className="w-full"
                                />
                                <InputGroupAddon>
                                    <Search />
                                </InputGroupAddon>
                            </InputGroup>
                            <div className="flex justify-end ml-auto">
                                <AddLinksForm
                                    type="Add Link"
                                    name="Name"
                                    url="www.example.com"
                                    size={true}
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
                                        <TableHead className="text-[#0b4461] text-center">Actions</TableHead>
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.map((row) => {
                                    const link = row.original;

                                    return (
                                        <TableRow key={row.id}>
                                            <FavoriteStar
                                                doc={link}
                                                onToggleOn={(link) => toggleFavorite(link, false)}
                                                onToggleOff={(link) => toggleFavorite(link, true)}
                                            />

                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="px-1 py-0.5 text-center">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}

                                            <TableCell className="px-1 py-0.5 text-center">
                                                <div className="flex gap-2 justify-end">
                                                    <Editlinksform
                                                        id={link.id}
                                                        name ={link.link_name}
                                                        url ={link.url}
                                                        owner={roles.at(0)}
                                                    />
                                                    <Button variant = "destructive" size = "icon">
                                                        <DeletePopupConfirmationLinks link={link} />
                                                    </Button>
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
    else{
        return(
            <>
                <div className="max-w-10xl mx-auto px-10 py-10">
                    <div className="bg-white rounded-xl shadow-sm border p-4">
                        <div className="flex items-center mb-4">
                            <InputGroup className="flex-1 max-w-2xl h-8 border-2 shadow-md hover:shadow-xl transition-all duration-100 bg-white">
                                <InputGroupInput
                                    placeholder="Search"
                                    value={(table.getColumn("link_name")?.getFilterValue() as string) ?? ""}
                                    onChange={(event) =>
                                        table.getColumn("link_name")?.setFilterValue(event.target.value)
                                    }
                                    className="w-full"
                                />
                                <InputGroupAddon>
                                    <Search />
                                </InputGroupAddon>
                            </InputGroup>
                            <div className="flex justify-end ml-auto">
                                <AddLinksForm
                                    type="Add Link"
                                    name="Name"
                                    url="www.example.com"
                                    size={true}
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
                                        <TableHead className="text-[#0b4461] text-center">Actions</TableHead>
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.map((row) => {
                                    const link = row.original;

                                    const canEdit =
                                        (roles.includes("underwriter") && link.owner === "UnderWriter") ||
                                        (roles.includes("businessanalyst") && link.owner === "BusinessAnalyst")
                                    return (
                                        <TableRow key={row.id}>
                                            <FavoriteStar
                                                doc={link}
                                                onToggleOn={(link) => toggleFavorite(link, false)}
                                                onToggleOff={(link) => toggleFavorite(link, true)}
                                            />
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="px-1 py-0.5 text-center">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}

                                            <TableCell className="px-1 py-0.5 text-center">
                                                <div className="flex gap-2 justify-end">
                                                    {canEdit && (
                                                        <Editlinksform
                                                            id={link.id}
                                                            name ={link.link_name}
                                                            url ={link.url}
                                                            owner={roles.at(0)}
                                                        />
                                                    )}

                                                    {canEdit && (
                                                        <Button variant = "destructive" size = "icon">
                                                            <DeletePopupConfirmationLinks link={link} />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
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