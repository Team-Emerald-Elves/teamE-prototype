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

function detectKind(doc: any): {
    kind: "pdf" | "image" | "video" | "audio" | "office" | "text" | "fallback";
    ext?: string;
} {
    const ext = extFrom(doc?.url) ?? extFrom(doc?.name);
    const mime: string = doc?.mime_type ?? "";

    if (ext === "pdf" || mime === "application/pdf")
        return { kind: "pdf", ext };

    if (
        [
            "png",
            "jpg",
            "jpeg",
            "gif",
            "webp",
            "bmp",
            "svg",
            "tif",
            "tiff",
        ].includes(ext ?? "") ||
        mime.startsWith("image/")
    ) {
        return { kind: "image", ext };
    }

    if (
        ["mp4", "mov", "webm", "ogg", "avi", "mkv"].includes(ext ?? "") ||
        mime.startsWith("video/")
    ) {
        return { kind: "video", ext };
    }

    if (
        ["mp3", "wav", "flac", "m4a", "aac"].includes(ext ?? "") ||
        mime.startsWith("audio/")
    ) {
        return { kind: "audio", ext };
    }

    if (
        [
            "doc",
            "docx",
            "xls",
            "xlsx",
            "ppt",
            "pptx",
            "odt",
            "ods",
            "odp",
        ].includes(ext ?? "")
    ) {
        return { kind: "office", ext };
    }

    if (
        ["txt", "md", "csv", "log", "json", "xml", "html", "htm"].includes(
            ext ?? "",
        ) ||
        mime.startsWith("text/")
    ) {
        return { kind: "text", ext };
    }

    return { kind: "fallback", ext };
}

export default function DocumentViewer(props: DocViewerProps) {
    const url: string | undefined = props.doc?.url;
    const name: string = props.doc?.name ?? "document";

    if (!url) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground">
                No document URL.
            </div>
        );
    }

    const { kind, ext } = detectKind(props.doc);

    if (kind === "pdf") {
        return (
            <object
                data={url}
                type="application/pdf"
                className="w-full h-full"
                aria-label={name}
            >
                <iframe
                    src={url}
                    title={name}
                    className="w-full h-full border-0"
                />
            </object>
        );
    }

    if (kind === "image") {
        return (
            <div className="w-full h-full flex items-center justify-center overflow-auto bg-muted/20">
                <img
                    src={url}
                    alt={name}
                    className="max-w-full max-h-full object-contain"
                />
            </div>
        );
    }

    if (kind === "video") {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black">
                <video src={url} controls className="max-w-full max-h-full" />
            </div>
        );
    }

    if (kind === "audio") {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <audio src={url} controls />
            </div>
        );
    }

    if (kind === "office") {
        const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            url,
        )}`;
        return (
            <iframe
                src={officeUrl}
                title={name}
                className="w-full h-full border-0"
            />
        );
    }

    const docs = [
        {
            uri: url,
            fileName: name,
            ...(ext ? { fileType: ext } : {}),
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
