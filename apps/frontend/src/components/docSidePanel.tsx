import { type ReactElement, useEffect, useState } from "react";
import { Tag } from "lucide-react";
import { TagInput } from "@/components/tagInput.tsx";
import DocTag from "@/components/docTag.tsx";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { tagColor } from "@/lib/tagColor.ts";
import type { documentContent } from "@repo/database/types";

type DocSidePanelProps = {
    className?: string;
    doc?: documentContent;
    allTags?: string[];
};

async function updateTags(docId: number, tags: string[]) {
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
function DocSidePanel(props: DocSidePanelProps): ReactElement {
    const [tagList, setTagList] = useState<string[]>([]);
    const [filter, setFilter] = useState("");
    const [currDoc, setCurrDoc] = useState<documentContent>({
        ...props.doc!,
    });

    useEffect(() => {
        if (props.doc) {
            setTagList(props.doc.meta_tags || []);
        }
    }, [props.doc]);

    if (!props.doc) {
        return (
            <div
                className={
                    "float-right inline w-60 mt-6 bg-(--dark-blue) " +
                    (props.className ? props.className : "")
                }
            >
                No Data
            </div>
        );
    }

    const suggestions = (props.allTags ?? [])
        .filter(
            (t) =>
                !tagList.includes(t) &&
                t.toLowerCase().includes(filter.toLowerCase()),
        )
        .sort();

    const addTag = async (tag: string) => {
        if (!tag || tagList.includes(tag)) return;
        const newTags = [...tagList, tag];
        setTagList(newTags);
        await updateTags(currDoc.id, newTags).catch(console.error);
    };

    const doc = props.doc;
    const isExpired =
        !!doc.expiration_date &&
        new Date(doc.expiration_date).getTime() < Date.now();
    const isExpiringSoon =
        !isExpired &&
        !!doc.expiration_date &&
        new Date(doc.expiration_date).getTime() - Date.now() <
            30 * 24 * 60 * 60 * 1000;
    const initials = doc.content_owner
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <>
            <div
                className={
                    "float-right inline w-64 mt-2 rounded-xs text-sm " +
                    (props.className ? props.className : "")
                }
            >
                <div>
                    Tags
                    <div className="mt-1 flex flex-wrap gap-1 text-(--tab-text)">
                        {tagList.map((tag) => (
                            <DocTag key={tag} background={tagColor(tag)}>
                                {tag}
                            </DocTag>
                        ))}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-5 ml-1 px-1.5 py-0 gap-1 leading-none flex items-center justify-center text-[11px] rounded-sm text-muted-foreground hover:text-foreground"
                                >
                                    <Tag className="h-3 w-3" />
                                    <span>Tag</span>
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
                                            currDoc.id,
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
                </div>
                <div className="mt-4">
                    <p className="font-semibold text-base mb-1">
                        Content Owner
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-medium shrink-0">
                            {initials}
                        </div>
                        <p>{doc.content_owner}</p>
                    </div>
                </div>
                {doc.expiration_date && (
                    <div className="mt-3">
                        <p className="font-semibold text-base mb-1">Expires</p>
                        <div className="flex items-center gap-2">
                            <p
                                className={
                                    isExpired
                                        ? "text-red-600 font-medium"
                                        : isExpiringSoon
                                          ? "text-amber-600 font-medium"
                                          : ""
                                }
                            >
                                {new Date(doc.expiration_date).toLocaleString()}
                            </p>
                            {isExpired && (
                                <span className="text-xs bg-red-100 text-red-700 rounded-full px-2 py-0.5 font-medium">
                                    Expired
                                </span>
                            )}
                            {isExpiringSoon && (
                                <span className="text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 font-medium">
                                    Soon
                                </span>
                            )}
                        </div>
                    </div>
                )}
                {doc.last_modified && (
                    <div className="mt-3">
                        <p className="font-semibold text-base mb-1">
                            Last Edited
                        </p>
                        <p>{new Date(doc.last_modified).toLocaleString()}</p>
                    </div>
                )}
                <div className="float-left"></div>
                <br />
            </div>
        </>
    );
}

export default DocSidePanel;
