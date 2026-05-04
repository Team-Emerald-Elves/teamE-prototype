import { type ReactElement, useEffect, useState } from "react";
import { TagInput } from "@/components/tagInput.tsx";
import type { documentContent } from "@repo/database/types";

type DocSidePanelProps = {
    className?: string;
    doc?: documentContent;
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

function formatStatus(status: string) {
    return status
        .replaceAll("not_started", "Not Started")
        .replaceAll("done", "Done")
        .replaceAll("in_progress", "In Progress")
        .replaceAll("needs_review", "Needs Review");
}

async function removeTag(docId: number, tag: string) {
    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/supabase/remove-document-tag`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: docId,
                meta_tag: tag,
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

    const doc = props.doc;
    const isUnlocked = doc.lock === "none";
    const isExpired = doc.expiration_date && new Date(doc.expiration_date).getTime() < Date.now();

    const isExpiringSoon =
        !isExpired &&
        doc.expiration_date &&
        new Date(doc.expiration_date).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000;

    const initials = doc.content_owner
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    console.log("meta_tags:", doc.meta_tags);
    return (
        <>
            <div
                className={
                    "float-right inline w-64 mt-2 rounded-xs text-sm " +
                    (props.className ? props.className : "")
                }
            >
                <div>
                    <p className="font-semibold text-base mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                        {doc.assigned_role && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-sm">
                            {doc.assigned_role}
                        </span>
                        )}
                        {doc.document_type && (
                            <span className="bg-cyan-100 text-cyan-800 text-xs px-2 py-0.5 rounded-sm">
                            {doc.document_type}
                        </span>
                        )}
                        {doc.document_status && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-sm">
                            {formatStatus(doc.document_status)}
                        </span>
                        )}
                    </div>
                    <TagInput
                        tags={tagList}
                        setTags={async (newTags) => {
                            setTagList(newTags);
                            await updateTags(
                                doc.id,
                                newTags as string[],
                            ).catch(console.error);
                        }}
                        remove={async (tagToRemove: string) => {
                            await removeTag(doc.id, tagToRemove);
                        }}
                        placeholder="Add tag..."
                    />
                </div>
                <div className="mt-4">
                    <p className="font-semibold text-base mb-1">Content Owner</p>
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
                            <p className={isExpired ? "text-red-600 font-medium" : isExpiringSoon ? "text-amber-600 font-medium" : ""}>
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
                        <p className="font-semibold text-base mb-1">Last Edited</p>
                        <p>{new Date(doc.last_modified).toLocaleString()}</p>
                    </div>
                )}
                <div className="mt-3">
                    <p className="font-semibold text-base mb-1">Status</p>
                    {isUnlocked ? (
                        <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5 font-medium">
                        Available
                    </span>
                    ) : (
                        <div className="flex flex-col gap-1">
                        <span className="text-xs bg-red-100 text-red-700 rounded-full px-2 py-0.5 font-medium w-fit">
                            Checked Out
                        </span>
                            <p className="text-xs text-muted-foreground">by {doc.lock_name}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default DocSidePanel;