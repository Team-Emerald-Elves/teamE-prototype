import {type ReactElement, type DragEvent, useState, useEffect} from "react";
import CenterDiv from "./center-div.tsx";
import fileImg from "../assets/file.svg";
import "./fupload.css";

interface FileUploadProps {
    // Drag n' drop files
    dnd: boolean;
    show?: boolean;
    onUpload: (files: File[]) => void;
}

function FileUpload(props: FileUploadProps): ReactElement {

    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
       props.onUpload(files);
    }, [files])

    const dragHandler = (e: DragEvent) => {
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

    const dropHandler = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const tFiles = e.dataTransfer.files;

        if (tFiles && tFiles.length > 0) {
            setFiles(Array.from(tFiles));
        }
    }

    const fileInput = <input type="file" id="dropZone" style={{width: "100%", height: "100%"}} onDragOver={dragHandler} onDrop={dropHandler}/>
    return ( props.show ?
        <>
            <CenterDiv style={{
                borderRadius: "2rem",
                width: "80%",
            }}>
                <div className="fupload">
                    {fileInput}
                    <img src={fileImg} width="50rem" draggable="false" alt="file_image"/>
                </div>
                <p>Files:</p>
                <p>{fileInput.props.toString()}</p>
                <br/>
            </CenterDiv>
        </> : <div hidden/>
    )
}

export default FileUpload;