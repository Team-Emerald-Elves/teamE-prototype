import { useEffect } from "react";
import frown from "../assets/frown.svg";
import CenterDiv from "../components/center-div.tsx";

function NotFound() {
    useEffect(() => {
        document.body.style.backgroundColor = "#00355f";
        return () => {
            document.body.style.backgroundColor = "";
        };
    });
    return (
        <>
            <CenterDiv
                style={{
                    color: "#f5f5f5",
                    fontSize: "clamp(2rem, 20vw, 20rem)",
                    fontWeight: "bold",
                }}
            >
                <div id="404-text">404</div>
            </CenterDiv>
            <CenterDiv
                style={{
                    color: "#f5f5f5",
                    fontSize: "clamp(1rem, 4vw, 10rem)",
                }}
            >
                <div id="not-found">Page not found</div>
            </CenterDiv>
            <CenterDiv>
                <img src={frown} alt="frown" width="80vw" draggable={false}/>
            </CenterDiv>
        </>
    );
}

export default NotFound;
