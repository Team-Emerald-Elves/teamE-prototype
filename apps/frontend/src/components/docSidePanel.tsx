import {type ReactElement, useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {type Document} from "@/components/docCols.tsx"
import DocTag from "@/components/doctag.tsx"
import FavoriteStar from "@/components/favoriteStar.tsx";
import ContentForm from "@/components/contentForm.tsx";
import CenterDiv from "@/components/center-div.tsx";

type DocSidePanelProps = {
    className?: string;
    doc?: Document
}

function DocSidePanel(props: DocSidePanelProps): ReactElement {
    const [tagList, setTagList] = useState<string[]>([]);
    const [allowSave, setAllowSave] = useState(false);
    const [currDoc, setCurrDoc] = useState<Document>({
        ...props.doc!
    });

    useEffect(() => {
        if (props.doc) {
            setCurrDoc(props.doc)
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
                    {tagList.map((tag) => (
                        <DocTag>{tag}</DocTag>
                    ))}
                    { /* Needs click behavior */}
                    <Button variant="default" >+</Button>
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
                    <ContentForm
                        type="Edit"
                        currentID={currDoc.id}
                        currentName={currDoc.name}
                        currentURL={currDoc.url}
                        currentContentOwner={currDoc.content_owner}
                        currentRole={currDoc.assigned_role}
                        currentExpirationDate={currDoc.expiration_date}
                        currentExpirationTime={currDoc.expiration_date}
                        currentStatus={currDoc.document_status}
                        size={false}
                        lock={currDoc.lock_name}
                    />
                </div>
                <FavoriteStar doc={currDoc}
                              onToggleOn={() => {
                                  setCurrDoc((prev) => ({...prev, favorite: true}))
                              }}
                              onToggleOff={() => {
                                  setCurrDoc((prev) => ({...prev, favorite: false}))
                              }}
                              className="float-right"
                />
                <br/>
                <CenterDiv>
                    <Button disabled={!allowSave}>Save</Button>
                </CenterDiv>
            </div>
        </>
    )
}

export default DocSidePanel;