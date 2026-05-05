"use client";

import { useEffect, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Tag } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover.tsx";
import mime from "mime";
import DocumentViewer from "@/components/docViewer.tsx";
import DocTag from "@/components/docTag.tsx";
import DocSidePanel from "@/components/docSidePanel.tsx";
import { TagInput } from "@/components/tagInput.tsx";
import { tagColor } from "@/lib/tagColor.ts";
import { getToken } from "@clerk/react";
import qmgr from "@/lib/querymgr.ts";
import type { documentContent } from "@repo/database/types";

async function updateDocumentTags(docId: number, tags: string[]) {
    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/supabase/update-document-tags`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: docId,
                meta_tags: tags,
            }),
        },
    );

    if (!res.ok) {
        throw new Error("Failed to update tags");
    }

    return res.json();
}

async function addHitCount(doc: documentContent) {
    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/supabase/add-hit-count`,
        {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                id: doc.id,
                type: "DOCUMENT",
            }),
        },
    );

    if (!res.ok) {
        throw new Error("failed to add doc hit count");
    }
}

async function createNotif(doc: documentContent) {
    const token = await getToken();

    qmgr.wait(() => {
        qmgr.getMe(async (res1) => {
            if (!res1.success) {
                throw new Error("Unable to get me");
            }

            const me = res1.data!;

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/notifs/create-notification`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        public: true,
                        targetRoles: [
                            doc.assigned_role,
                            "Administrator",
                        ].filter(Boolean),
                        title: `${me.first_name} ${me.last_name} accessed ${
                            doc.name.substring(0, 12) +
                            (doc.name.length >= 12 ? "..." : "")
                        }`,
                    }),
                },
            );

            if (!res.ok) {
                throw new Error("failed to create view notification");
            }
        });
    });
}

function formatStatus(status: string) {
    return status
        .replaceAll("not_started", "Not Started")
        .replaceAll("done", "Done")
        .replaceAll("in_progress", "In Progress")
        .replaceAll("needs_review", "Needs Review");
}

export const columns: ColumnDef<documentContent>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="justify-start px-0 min-w-[250px]"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row, table }) => {
            const doc = row.original;
            const allTags = Array.from(
                new Set(
                    table
                        .getCoreRowModel()
                        .rows.flatMap(
                            (r) =>
                                (r.original as documentContent).meta_tags ??
                                [],
                        ),
                ),
            );

            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    await Promise.all([
                                        createNotif(doc),
                                        addHitCount(doc),
                                    ]);
                                } catch (err) {
                                    console.error(err);
                                }
                            }}
                            className="max-w-[250px] truncate whitespace-nowrap overflow-hidden hover:underline text-left"
                        >
                            {doc.name}
                        </button>
                    </DialogTrigger>

                    <DialogContent className="lg:max-w-5xl h-[90vh] flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-auto flex justify-center">
                            <div className="w-full max-w-[min(1400px,80%)] h-full">
                                <DocumentViewer doc={doc} />
                            </div>

                            <DocSidePanel
                                className="ml-2"
                                doc={doc}
                                allTags={allTags}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
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
            const doc = row.original;
            const date = new Date(doc.created_at);

            return <p>{date.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}</p>;
        },
    },
    {
        accessorKey: "expiration_date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="justify-start px-0"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Expiration Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const doc = row.original;
            const date = new Date(doc.expiration_date);

            return <p>{date.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}</p>;
        },
    },
    {
        accessorKey: "content_owner",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="justify-start px-0"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Content Owner
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "last_modified",
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
            const doc = row.original;
            const date = new Date(doc.last_modified);

            return <p>{date.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}</p>;
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
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row, table }) => {
            const doc = row.original;
            const [tagList, setTagList] = useState<string[]>(
                doc.meta_tags ?? [],
            );
            const [filter, setFilter] = useState("");

            // TanStack reuses cell instances across data changes, so sync
            // local state when the row's underlying tags change (e.g. after
            // a filter refetch swaps the doc in this row position).
            useEffect(() => {
                setTagList(doc.meta_tags ?? []);
            }, [doc.id, doc.meta_tags]);

            const allTags = Array.from(
                new Set(
                    table.getCoreRowModel().rows.flatMap((r) => {
                        const other = r.original as documentContent;
                        return other.id === doc.id
                            ? tagList
                            : (other.meta_tags ?? []);
                    }),
                ),
            ).sort();
            const suggestions = allTags.filter(
                (t) =>
                    !tagList.includes(t) &&
                    t.toLowerCase().includes(filter.toLowerCase()),
            );

            const addTag = async (tag: string) => {
                if (!tag || tagList.includes(tag)) return;
                const newTags = [...tagList, tag];
                setTagList(newTags);
                await updateDocumentTags(doc.id, newTags).catch(console.error);
            };

            const type = doc.mime_type;
            const roles = doc.assigned_role ?? "No Role";
            const docType = doc.document_type ?? "No Type";
            const status = formatStatus(doc.document_status);

            const typeBackground = "bg-neutral-200";
            const docBackground = "bg-cyan-200";

            let statusBackground = "bg-slate-400";
            let roleBackground = "bg-gray-200";

            switch (status) {
                case "Not Started":
                    statusBackground = "bg-red-200";
                    break;
                case "In Progress":
                    statusBackground = "bg-yellow-300";
                    break;
                case "Needs Review":
                    statusBackground = "bg-orange-300";
                    break;
                case "Done":
                    statusBackground = "bg-green-300";
                    break;
            }

            switch (roles) {
                case "Administrator":
                    roleBackground = "bg-purple-700";
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
                <div className="flex flex-wrap items-center gap-1 text-(--tab-text)">
                    <DocTag background={typeBackground}>
                        {mime.getExtension(type) ?? "file"}
                    </DocTag>

                    <DocTag background={roleBackground}>{roles}</DocTag>

                    <DocTag background={docBackground}>{docType}</DocTag>

                    <DocTag background={statusBackground}>{status}</DocTag>

                    {tagList.map((tag) => (
                        <DocTag key={tag} background={tagColor(tag)}>
                            {tag}
                        </DocTag>
                    ))}

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-6 w-6 ml-1 p-0 leading-none flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground shrink-0"
                            >
                                <Tag className="h-4 w-4" strokeWidth={2.25} />
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
                                    await updateDocumentTags(
                                        doc.id,
                                        newTags as string[],
                                    ).catch(console.error);
                                }}
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
