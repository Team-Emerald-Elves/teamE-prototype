import {type ReactNode} from "react";

type DocTagProps = {
    children: ReactNode
}

function DocTag(props: DocTagProps) {
    return (
        <>
            <div style={{
                borderRadius: "15em",
                padding: "0.5em",
                borderColor: "#00355f",
                borderStyle: "solid",
                borderWidth: "medium",
            }}>
                {props.children}
            </div>
        </>
    )
}

export default DocTag;