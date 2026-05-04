import {
    type ReactElement,
    type DragEvent,
    useState,
    useEffect,
    type ChangeEvent,
} from "react";
import CenterDiv from "./center-div.tsx";
import UploadImg from "../assets/upload.svg";
import "./fupload.css";

interface FileUploadProps {
    // Drag n' drop files
    dnd: boolean;
    show?: boolean;
    onUpload: (files: File[]) => void;
}

function FileUploadChatBot(props: FileUploadProps): ReactElement {
    const [files, setFiles] = useState<File[]>([]);
    const [fileNames, setFileNames] = useState<string[]>([]);

    useEffect(() => {
        console.log("Uploaded: ", files);
        updateFileNames();
        props.onUpload(files);
    }, [files]);

    function updateFileNames() {
        setFileNames([]);
        files.forEach((f) => {
            setFileNames((prev) => prev.concat(f.name));
        });
    }

    const dragHandler = (e: DragEvent) => {
        console.log(e.dataTransfer);
        const fileItems = [...e.dataTransfer!.items].filter(
            (item) => item.kind === "file",
        );
        if (fileItems.length > 0) {
            e.preventDefault();
            fileItems.forEach((item) => {
                if (
                    item.type.startsWith("application") ||
                    item.type.startsWith("text")
                ) {
                    e.dataTransfer!.dropEffect = "copy";
                    console.log("file size: ", item.getAsFile()?.size);
                    console.log("fi: ", item.getAsFile());
                } else {
                    e.dataTransfer!.dropEffect = "none";
                }
            });
        }
    };

    const dropHandler = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const tFiles = Array.from(e.dataTransfer.files);
        console.log("Dropped");
        if (tFiles && tFiles.length > 0) {
            setFiles(tFiles);
        } else {
            console.error("0 Files dropped");
        }
    };

    const changeHandler = (e: ChangeEvent): void => {
        const target = e.target as HTMLInputElement;

        console.log("Changing");

        // .files is a FileList (array-like), not a true array
        if (target.files && target.files.length > 0) {
            setFiles(Array.from(target.files));
            console.log("TFiles: ", files);
        } else {
            console.error("Invalid files selected");
        }
    };

    const fileInput: React.JSX.Element = (
        <input
            type="file"
            id="dropZone"
            style={{ width: "100%", height: "100%" }}
            onDragOver={dragHandler}
            onChange={changeHandler}
            onDrop={dropHandler}
        />
    );

    return props.show ? (
        <>
            <div className="flex items-center justify-center flex-col">

                <div className="fupload">
                    {fileInput}
                    <img
                        src={UploadImg}
                        width="25rem"
                        draggable="false"
                        alt="file_image"
                    />
                </div>
                <p>Files:</p>
                <p>{fileNames.map(n => n.length > 10 ? n.slice(0, 10) + "..." : n).join(", ")}</p>
                <br />
            </div>
        </>
    ) : (
        <div hidden />
    );
}

export default FileUploadChatBot;
