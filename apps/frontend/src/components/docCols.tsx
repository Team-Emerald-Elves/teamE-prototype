"use client"
import type {ColumnDef} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react"
import { Button } from './ui/button.tsx'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import mime from 'mime'
import DocumentViewer from "@/components/docViewer.tsx";
import {TableCell} from "@/components/ui/table.tsx";
import DocTag from "@/components/doctag.tsx";
import DocSidePanel from "@/components/docSidePanel.tsx";

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
    lock_name: string;
    meta_tags: string[];
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
                    className = "justify-start px-0 min-w-[250px]"
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
                    <DialogTrigger className="max-w-[250px] truncate whitespace-nowrap overflow-hidden hover:underline text-left">{doc.name}</DialogTrigger>

                    <DialogContent className="2xl:max-w-7xl h-[90vh] flex flex-col overflow-hidden">
                        <DialogClose className="absolute right-4 top-4 text-xl z-10">
                            ✕
                        </DialogClose>
                        <div className="flex-1 overflow-auto flex justify-center">
                            <div className="w-full max-w-[min(1400px,80%)] h-full">
                                <DocumentViewer doc={doc} />
                            </div>
                            <DocSidePanel doc={doc} />
                        </div>

                    </DialogContent>
                </Dialog>
            );
        },
    },
    {
        accessorKey: "expiration_date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className = "justify-start px-0"
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
                <p>{date.toLocaleString()}</p>
            );
        },
    },

    {
        accessorKey: "document_status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className = "justify-start px-0"
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
                    className = "justify-start px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Content Owner
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
                    className = "justify-start px-0"
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
                <p>{date.toLocaleString()}</p>
            );
        },
    },
    {
        accessorKey: "tags",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className = "justify-start px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tags
                    <ArrowUpDown className="ml-2 h-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const doc = row.original;
            const type = doc.mime_type
            const roles = doc.assigned_role;
            const status = doc.document_status.replaceAll("not_started", "Not Started").replaceAll("done", "Done").replaceAll("in_progress", "In Progress").replaceAll("needs_review", "Needs Review");
            let statusBackground = "bg-gray-300"
            const typeBackground = "bg-neutral-200"
            let roleBackground = "bg-gray-200"
            const customBackground = "bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300"
            switch (status) {
                case 'Not Started':
                    statusBackground = "bg-red-200";
                    break;
                case 'In Progress':
                    statusBackground = "bg-yellow-300";
                    break;
                case 'Needs Review':
                    statusBackground = "bg-orange-300";
                    break;
                case 'Done':
                    statusBackground = "bg-green-300";
                    break;
            }
            switch (roles) {
                case 'Administrator':
                    roleBackground = "bg-purple-700";
                    break;
                case 'BusinessAnalyst':
                    roleBackground = "bg-red-300";
                    break;
                case 'UnderWriter':
                    roleBackground = "bg-pink-400";
                    break;
                case 'ExcelOperator':
                    roleBackground = "bg-emerald-400";
                    break;
                case 'BusinessOperator':
                    roleBackground = "bg-amber-500";
                    break;
                case 'ActuarialAnalyst':
                    roleBackground = "bg-yellow-200";
                    break;
            }

            return (
                <div className="flex flex-wrap gap-1">
                    <DocTag background={typeBackground}>{mime.getExtension(type)}</DocTag>
                    <DocTag background={roleBackground}>{roles}</DocTag>
                    <DocTag background={statusBackground}>{status}</DocTag>
                    {doc.meta_tags.map(tag => (
                        <DocTag background={customBackground}>{tag}</DocTag>
                    ))}
                </div>
            );
        },
    }
]