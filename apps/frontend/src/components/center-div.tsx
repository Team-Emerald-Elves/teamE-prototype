import {type CSSProperties, type ReactNode, useMemo} from "react";

interface CdProps {
    children?: ReactNode
    style?: CSSProperties
}

function CenterDiv(props: CdProps) {
    const centerStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    const style = useMemo(() => ({
        ...centerStyle, ...props.style
    }), [props.style])
    return (
        <div style={{...style, ...props.style}}>{props.children}</div>
    )
}

export default CenterDiv;