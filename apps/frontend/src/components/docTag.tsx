import { type ReactNode } from "react";

type DocTagProps = {
    children: ReactNode;
    background: string;
};

function DocTag(props: DocTagProps) {
    return (
        <>
            <div
                className={`max-w-[130px] ${props.background} rounded px-1.5 py-0.5 whitespace-normal text-(--tab-text) break-words`}
            >
                {props.children}
            </div>
        </>
    );
}

export default DocTag;
