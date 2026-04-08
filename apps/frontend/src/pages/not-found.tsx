import {useEffect, type ReactNode, type CSSProperties, useMemo} from "react";
import frown from "../assets/frown.svg"

interface NfProps {
    children?: ReactNode
    style?: CSSProperties
}

function CenterDiv(props: NfProps) {
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

function NotFound() {
    useEffect(() => {
        document.body.style.backgroundColor = '#00355f';
        return () => {
            document.body.style.backgroundColor = '';
        };
    })
    return (
        <>
            <CenterDiv style={{
                color: '#f5f5f5',
                fontSize: 'clamp(2rem, 20vw, 20rem)',
                fontWeight: 'bold',
            }}>
                <div id="404-text">404</div>
            </CenterDiv>
            <CenterDiv style={{
                color: '#f5f5f5',
                fontSize: 'clamp(1rem, 4vw, 10rem)',
            }}>
                <div id="not-found">Page not found</div>
            </CenterDiv>
            <CenterDiv>
                <img src={frown} alt="frown" width="80vw"/>
            </CenterDiv>
        </>
    )
}

export default NotFound;