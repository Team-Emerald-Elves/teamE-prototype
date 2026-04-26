import {type ReactNode} from "react";

type DocTagProps = {
    children: ReactNode
}

function DocTag(props: DocTagProps) {
    return (
        <>
            <div className="max-w-[130px] text-[10px] bg-gray-100 rounded px-1.5 py-0.5 whitespace-normal break-words">
                {props.children}
            </div>
        </>
    )
}

export default DocTag;