import {type ReactNode} from "react";

type DocTagProps = {
    children: ReactNode
}

function DocTag(props: DocTagProps) {
    return (
        <>
            <div className = "text-[10px] bg-gray-100 rounded px-1.5 py-0.5 whitespace-nowrap">
                {props.children}
            </div>
        </>
    )
}

export default DocTag;