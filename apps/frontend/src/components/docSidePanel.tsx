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
    const [currDoc, setCurrDoc] = useState<documentContent>({
        ...props.doc!,
    });

    useEffect(() => {
        if (props.doc) {
            setCurrDoc(props.doc);
            setTagList(props.doc.meta_tags || []);
        }
    }, [props.doc]);

    if (!props.doc) {
        return (
            <div
                className={
                    "float-right inline w-60 mt-6 bg-(--dark-blue)" +
                    props.className
                        ? props.className
                        : ""
                }
            >
                No Data
            </div>
        );
    }

    return (
        <>
            <div
                className={
                    "float-right inline w-60 mt-6 rounded-xs " +
                    (props.className ? props.className : "")
                }
            >
                <div>
                    Tags
                    <br />
                    <TagInput
                        tags={tagList}
                        setTags={async (newTags) => {
                            setTagList(newTags);
                            await updateTags(
                                currDoc.id,
                                newTags as string[],
                            ).catch(console.error);
                        }}
                        remove={async (tagToRemove: string) => {
                            await removeTag(currDoc.id, tagToRemove);
                        }}
                        placeholder="Add tag..."
                    />
                </div>
                <br />
                <div>
                    Content Owner
                    <p>{currDoc.content_owner}</p>
                </div>
                <br />
                {currDoc.expiration_date ? (
                    <>
                        <br />
                        <div>
                            Expires
                            <p>
                                {new Date(
                                    currDoc.expiration_date!,
                                ).toLocaleString()}
                            </p>
                        </div>
                    </>
                ) : (
                    ""
                )}
                {currDoc.last_modified ? (
                    <>
                        <br />
                        <div>
                            Last Edited
                            <p>
                                {new Date(
                                    currDoc.last_modified!,
                                ).toLocaleString()}
                            </p>
                        </div>
                    </>
                ) : (
                    ""
                )}
                <div className="float-left"></div>
                <br />
                {/*<CenterDiv>*/}
                {/*    <Button disabled={!allowSave}>Save</Button>*/}
                {/*</CenterDiv>*/}
            </div>
        </>
    );
}

export default DocSidePanel;
