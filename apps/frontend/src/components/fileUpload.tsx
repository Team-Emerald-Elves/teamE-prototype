import {type ReactElement, type DragEvent} from "react";
import CenterDiv from "./center-div.tsx";
import fileImg from "../assets/file.svg";
import "./fupload.css";

interface FileUploadProps {
    // Drag n' drop files
    dnd: boolean;
    show?: boolean;
}

function FileUpload(props: FileUploadProps): ReactElement {

    const fileInput = <input type="file" id="dropZone" style={{width: "100%", height: "100%"}}/>

    function dragHandler(e: DragEvent) {
        console.log(e.dataTransfer);
        const fileItems = [...e.dataTransfer!.items].filter(
            (item) => item.kind === "file",
        );
        if (fileItems.length > 0) {
            e.preventDefault();
            fileItems.forEach((item) => {
                if (item.type.startsWith("application") || item.type.startsWith("text")) {
                    e.dataTransfer!.dropEffect = "copy";
                    console.log("file size: ", item.getAsFile()?.size)
                    console.log("fi: ", item.getAsFile());
                } else {
                    e.dataTransfer!.dropEffect = "none";
                }
            })
        }
    }
    return ( props.show ?
        <>
            <CenterDiv style={{
                borderRadius: "2rem",
                width: "80%",
            }}>
                <div className="fupload">
                    {fileInput}
                    <img src={fileImg} onDragOver={dragHandler} width="500rem" draggable="false" alt="file_image"/>
                </div>
                <br/>
                <button>Submit</button>
            </CenterDiv>
        </> : <div hidden/>
    )
}

export default FileUpload;