import {type ReactElement, useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {type Document} from "@/components/docCols.tsx"
import DocTag from "@/components/doctag.tsx"

type DocSidePanelProps = {
    className?: string;
    doc?: Partial<Document>
}

function DocSidePanel(props: DocSidePanelProps): ReactElement {
    const [tagList, setTagList] = useState<string[]>([]);
    const [currDoc, setCurrDoc] = useState<Partial<Document>>({})

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
            <div className={"float-right inline w-60 mt-6 bg-(--dark-blue)" + props.className ? props.className : ""}>
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
            </div>
        </>
    )
}

export default DocSidePanel;