"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Plus ,Tag} from "lucide-react";

import { Button } from "./ui/button.tsx";
import DocTag from "@/components/docTag.tsx";
import { TagInput } from "@/components/tagInput.tsx";
import { tagColor } from "@/lib/tagColor.ts";
import { useEffect, useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover";
import qmgr from "@/lib/querymgr.ts";

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
    created_at: string;
    updated_at: string;
};

async function addHitCount(link: Links) {
    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/supabase/add-hit-count`,
        {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                id: link.id,
                type: "LINK",
            }),
        },
    );
    if (!res.ok) {
        throw new Error("failed to add doc hit count");
    }
}

async function updateTags(lId: string, tags: string[]) {
    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/update-link-tags`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: lId,
                meta_tags: tags,
            }),
        },
    );

    if (!res.ok) {
        throw new Error("Failed to update tags");
    }

    return res.json();
}
async function createNotif(link: Links, action: string) {
    qmgr.wait(() => {
        qmgr.getMe(async (res1) => {
            if (!res1.success) {
                throw new Error("Unable to get me");
            }
            const me = res1.data!;
            console.log(me);

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/notifs/create-notification`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${qmgr.getToken()}`,
                    },
                    body: JSON.stringify({
                        public: true,
                        targetRoles: [link.owner, "Administrator"],
                        title: `${me.first_name} ${me.last_name} ${action} ${link.link_name.substring(0, 12) + (link.link_name.length >= 12 ? "..." : "")}`,
                    }),
                },
            );

            if (!res.ok) {
                throw new Error("failed to create view notification");
            }
            console.log(await res.json());
        });
    });
}

export const columns: ColumnDef<Links>[] = [
    {
        accessorKey: "link_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },

    {
        accessorKey: "url",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    URL
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const link = row.original;

            return (
                <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    onClick={async () => {
                        createNotif(link, "opened");
                        addHitCount(link);
                    }}
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
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Role
                    <ArrowUpDown className="ml-2 h-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const role = row.original.owner;
            let roleBackground = "bg-gray-200";

            switch (role) {
                case "Administrator":
                    roleBackground = "bg-purple-400";
                    break;
                case "BusinessAnalyst":
                    roleBackground = "bg-blue-300";
                    break;
                case "UnderWriter":
                    roleBackground = "bg-pink-300";
                    break;
                case "ExcelOperator":
                    roleBackground = "bg-teal-400";
                    break;
                case "BusinessOperator":
                    roleBackground = "bg-violet-300";
                    break;
                case "ActuarialAnalyst":
                    roleBackground = "bg-fuchsia-300";
                    break;
            }

            return (
                <div className="text-center justify-items-center">
                    <DocTag background={roleBackground}>{role}</DocTag>
                </div>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="justify-start px-0"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const link = row.original;
            const date = new Date(link.created_at);

            return <p>{date.toLocaleString()}</p>;
        },
    },
    {
        accessorKey: "updated_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="justify-start px-0"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Last Modified
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const link = row.original;
            const date = new Date(link.updated_at);

            return <p>{date.toLocaleString()}</p>;
        },
    },
    {
        accessorKey: "tags",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="justify-start px-0"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Tags
                    <ArrowUpDown className="ml-2 h-4" />
                </Button>
            );
        },
        cell: ({ row, table }) => {
            const link = row.original;
            const [tagList, setTagList] = useState<string[]>(link.meta_tags);
            const [filter, setFilter] = useState("");

            // TanStack reuses cell instances across data changes, so sync
            // local state when the row's underlying tags change (e.g. after
            // a filter refetch swaps the link in this row position).
            useEffect(() => {
                setTagList(link.meta_tags ?? []);
            }, [link.id, link.meta_tags]);

            const allTags = Array.from(
                new Set(
                    table
                        .getCoreRowModel()
                        .rows.flatMap((r) => {
                            const other = r.original as Links;
                            return other.id === link.id
                                ? tagList
                                : (other.meta_tags ?? []);
                        }),
                ),
            ).sort();
            const suggestions = allTags.filter(
                (t) => !tagList.includes(t) && t.toLowerCase().includes(filter.toLowerCase()),
            );

            const addTag = async (tag: string) => {
                if (!tag || tagList.includes(tag)) return;
                const newTags = [...tagList, tag];
                setTagList(newTags);
                await updateTags(link.id, newTags).catch(console.error);
            };

            return (
                <div className="flex flex-wrap items-center gap-1 w-full">
                    {tagList.map((item) => (
                        <div className="text-center shrink-0" key={item}>
                            <DocTag background={tagColor(item)}>{item}</DocTag>
                        </div>
                    ))}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-5 w-5 ml-1 p-0 leading-none flex items-center justify-center text-center"
                            >
                                <Tag className="h-3 w-3" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start">
                            <PopoverHeader>
                                <PopoverTitle>Add Tags</PopoverTitle>
                            </PopoverHeader>
                            <TagInput
                                tags={tagList}
                                setTags={async (newTags) => {
                                    setTagList(newTags);
                                    await updateTags(
                                        link.id,
                                        newTags as string[],
                                    ).catch(console.error);
                                }}
                                remove={() => {}}
                                placeholder="Add tag..."
                                onInputChange={setFilter}
                            />
                            <div className="mt-2 flex flex-wrap gap-1">
                                {suggestions.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => {
                                            addTag(tag);
                                            setFilter("");
                                        }}
                                        className={`border text-xs px-2 h-5 rounded-sm cursor-pointer hover:opacity-80 ${tagColor(tag)}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            );
        },
    },
];
