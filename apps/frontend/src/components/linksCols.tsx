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
import {TagInput} from "@/components/tagInput.tsx";
import {useState} from "react";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"

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
    meta_tags: string[];
};

async function updateTags(lId: string, tags: string[]) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/update-link-tags`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: lId,
            meta_tags: tags,
        }),
    });

    if (!res.ok) {
        throw new Error("Failed to update tags");
    }

    return res.json();
}
async function removeTag(lId: string, tag: string) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/delete-link-tag`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: lId,
            meta_tag: tag,
        }),
    });

    if (!res.ok) {
        throw new Error("Failed to update tags");
    }

    return res.json();
}


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
        cell: ({ row }) => {
            const role = row.original.owner
            let roleBackground = "bg-gray-200"

            switch (role) {
                case 'Administrator':
                    roleBackground = "bg-purple-700";
                    break;
                case 'BusinessAnalyst':
                    roleBackground = "bg-blue-300";
                    break;
                case 'UnderWriter':
                    roleBackground = "bg-pink-300";
                    break;
                case 'ExcelOperator':
                    roleBackground = "bg-teal-400";
                    break;
                case 'BusinessOperator':
                    roleBackground = "bg-violet-300";
                    break;
                case 'ActuarialAnalyst':
                    roleBackground = "bg-fuchsia-300";
                    break;
            }

            return (
                <div className="text-center justify-items-center">
                    <DocTag background={roleBackground}>{role}</DocTag>
                </div>
            )
        }
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
            const link = row.original;
            const tags = link.meta_tags;
            const [tagList, setTagList] = useState<string[]>(link.meta_tags);

            return (
                <div>
                    {tags.map((item) => (
                        <div className="text-center" key={item}><DocTag background="bg-gray-200">{item}</DocTag></div>
                    ))}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">+</Button>
                        </PopoverTrigger>
                        <PopoverContent align="start">
                            <PopoverHeader>
                                <PopoverTitle>Add Tags</PopoverTitle>

                            </PopoverHeader>
                            <TagInput
                                tags={tagList}
                                setTags={async (newTags) => {
                                    setTagList(newTags);
                                    await updateTags(link.id, newTags as string[]).catch(console.error);
                                }}
                                remove={async (tagToRemove: string) => {
                                    await removeTag(link.id, tagToRemove);
                                }}
                                placeholder="Add tag..."
                            />
                        </PopoverContent>
                    </Popover>

                </div>

            );
        },
    }
]