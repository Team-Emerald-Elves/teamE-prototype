import {type ReactElement, useState} from "react";
import {Button} from "@/components/ui/button.tsx";

type DocSidePanelProps = {
    className?: string;
}

function DocSidePanel(props: DocSidePanelProps): ReactElement {
    const [owner, setOwner] = useState("");

    return (
        <>
            <div className={"float-right inline w-60 mt-6" + props.className ? props.className : ""}>
                <div>
                    Tags
                    <br/>
                    { /* Needs click behavior */}
                    <Button variant="default" >+</Button>
                </div>
                <br/>
                <div>
                    Content Owner
                    <p>{owner}</p>
                </div>
            </div>
        </>
    )
}

export default DocSidePanel;