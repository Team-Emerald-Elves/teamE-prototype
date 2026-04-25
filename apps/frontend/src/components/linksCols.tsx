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
import DocumentViewer from "@/components/docViewer.tsx";
import {TableCell} from "@/components/ui/table.tsx";
import DocTag from "@/components/doctag.tsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {Download01Icon} from "@hugeicons/core-free-icons";
import * as React from "react";

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

export type Links = {
    id: string;
    link_name: string;
    url: string;
    owner: string;
    favorite: boolean;
    created_at: string;
    updated_at: string;
};


export const columns: ColumnDef<Links>[] = [
    {
        accessorKey: "link_name",
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
    },

    {
        accessorKey: "url",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    URL
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const link = row.original;

            return (
                <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                >
                    {link.url}
                </a>
            );
        },
    },
    {
        accessorKey: "owner",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Role
                    <ArrowUpDown className="ml-2 h-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className = "justify-start px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const link = row.original;
            const date = new Date(link.created_at);

            return (
                <p>{date.toLocaleString()}</p>
            );
        },
    },
    {
        accessorKey: "updated_at",
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
            const link = row.original;
            const date = new Date(link.updated_at);

            return (
                <p>{date.toLocaleString()}</p>
            );
        },
    },
]