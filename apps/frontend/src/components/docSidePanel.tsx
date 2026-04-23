import {type ReactElement, useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {type Document} from "@/components/docCols.tsx"
import DocTag from "@/components/doctag.tsx"
import FavoriteStar from "@/components/favoriteStar.tsx";
import ContentForm from "@/components/contentForm.tsx";
import CenterDiv from "@/components/center-div.tsx";
import {TagInput} from "@/components/tagInput.tsx"

type DocSidePanelProps = {
    className?: string;
    doc?: Document
}

async function updateTags(docId: number, tags: string[]) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/supabase/update-document-tags`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: docId,
            meta_tags: tags,
        }),
    });

    if (!res.ok) {
        throw new Error("Failed to update tags");
    }

    return res.json();
}
async function removeTag(docId: number, tag: string) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/supabase/remove-document-tag`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: docId,
            meta_tag: tag,
        }),
    });

    if (!res.ok) {
        throw new Error("Failed to update tags");
    }

    return res.json();
}

function DocSidePanel(props: DocSidePanelProps): ReactElement {
    const [tagList, setTagList] = useState<string[]>([]);
    const [allowSave, setAllowSave] = useState(false);
    const [currDoc, setCurrDoc] = useState<Document>({
        ...props.doc!
    });

    useEffect(() => {
        if (props.doc) {
            setCurrDoc(props.doc);
            setTagList(props.doc.meta_tags || []);
            setAllowSave(false);
        }
    }, [props.doc]);

    if (!props.doc) {
        return (
            <div className={"float-right inline w-60 mt-6 bg-(--dark-blue)" + props.className ? props.className : ""}>No Data</div>
        )
    }

    return (
        <>
            <div className={"float-right inline w-60 mt-6 bg-muted/20 rounded-xs " + (props.className ? props.className : "")}>
                <div>
                    Tags
                    <br/>
                    <TagInput
                        tags={tagList}
                        setTags={async (newTags) => {
                            setTagList(newTags);
                            await updateTags(currDoc.id, newTags as string[]).catch(console.error);
                        }}
                        remove={async (tagToRemove: string) => {
                            await removeTag(currDoc.id, tagToRemove);
                        }}
                        placeholder="Add tag..."
                    />
                </div>
                <br/>
                <div>
                    Content Owner
                    <p>{currDoc.content_owner}</p>
                </div>
                <br/>
                {currDoc.expiration_date ? (
                    <>
                        <br/>
                        <div>
                            Expires
                            <p>{new Date(currDoc.expiration_date!).toLocaleString()}</p>
                        </div>
                    </>
                ) : ""}
                {currDoc.last_modified ? (
                    <>
                        <br/>
                        <div>
                            Last Edited
                            <p>{new Date(currDoc.last_modified!).toLocaleString()}</p>
                        </div>
                    </>
                ) : ""}
                <div className="float-left">

                </div>
                <br/>
                {/*<CenterDiv>*/}
                {/*    <Button disabled={!allowSave}>Save</Button>*/}
                {/*</CenterDiv>*/}
            </div>
        </>
    )
}

export default DocSidePanel;