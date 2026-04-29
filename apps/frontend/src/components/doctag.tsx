import {type ReactNode} from "react";

type DocTagProps = {
    children: ReactNode
    background: string
}

function DocTag(props: DocTagProps) {
    return (
        <>
            <div className={`max-w-[130px] ${props.background} rounded-2xl px-2 py-0.5 whitespace-normal text-xs text-black/75 break-words`}>
                {props.children}
            </div>
        </>
    )
}

export default DocTag;