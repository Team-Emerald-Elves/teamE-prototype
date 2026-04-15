"use client"
import type {ColumnDef} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react"
import { Button } from './ui/button.tsx'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import DocumentViewer from "@/components/docViewer.tsx";
import {TableCell} from "@/components/ui/table.tsx";

export type Document = {
    id: number;
    url: string;
    name: string;
    last_modified: string;
    expiration_date: string;
    lock: boolean;
    mime_type: string;
    document_type: string;
    assigned_role: string;
    content_owner: string;
    document_status: string;
    favorite: boolean;
};


export const columns: ColumnDef<Document>[] = [
    // {
    //     accessorKey: "favorite",
    //     header: "Favorite",

    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const doc = row.original;

            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="max-w-[180px] truncate whitespace-nowrap overflow-hidden hover:underline text-left">
                            {doc.name}
                        </button>
                    </DialogTrigger>

                    <DialogContent className="2xl:max-w-2xl h-[90vh] flex flex-col overflow-hidden">
                        <DialogClose className="absolute right-4 top-4 text-xl z-10">
                            ✕
                        </DialogClose>

                        <div className="flex-1 overflow-auto flex justify-center">
                            <div className="w-full max-w-[1400px] h-full">
                                <DocumentViewer doc={doc} />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            );
        },
    },
    {
        accessorKey: "document_type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Content Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },

    },
    {
        accessorKey: "expiration_date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Expiration Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const doc = row.original;
            const date = new Date(doc.expiration_date);

            return (
                <TableCell>
                    <p>{date.toLocaleString()}</p>
                </TableCell>
            );
        },
    },

    {
        accessorKey: "document_status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "content_owner",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Content Owner
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "assigned_role",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "last_modified",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last Modified
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const doc = row.original;
            const date = new Date(doc.last_modified);

            return (
                <TableCell>
                    <p>{date.toLocaleString()}</p>
                </TableCell>
            );
        },
    }
]