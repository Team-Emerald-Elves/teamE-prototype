import DocViewer, { DocViewerRenderers } from "@iamjariwala/react-doc-viewer";
import "@iamjariwala/react-doc-viewer/dist/index.css";

type DocViewerProps = {
    doc: any;
};

function extFrom(value: string | undefined): string | undefined {
    if (!value) return undefined;
    const path = value.split("?")[0].split("#")[0];
    const last = path.split("/").pop() ?? path;
    if (!last.includes(".")) return undefined;
    return last.split(".").pop()?.toLowerCase();
}

function inferFileType(doc: any): string | undefined {
    const ext = extFrom(doc?.url) ?? extFrom(doc?.name);
    if (ext) return ext;
    if (doc?.mime_type && doc.mime_type !== "text/plain") return doc.mime_type;
    return undefined;
}

export default function DocumentViewer(props: DocViewerProps) {
    const fileType = inferFileType(props.doc);
    const docs = [
        {
            uri: props.doc.url,
            fileName: props.doc.name,
            ...(fileType ? { fileType } : {}),
        },
    ];

    return (
        <DocViewer
            documents={docs}
            pluginRenderers={DocViewerRenderers}
            prefetchMethod="GET"
            config={{
                fullscreen: { enableFullscreen: true },
                pdfVerticalScrollByDefault: true,
            }}
        />
    );
}
