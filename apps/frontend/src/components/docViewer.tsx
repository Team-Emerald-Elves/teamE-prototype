import DocViewer, { DocViewerRenderers } from "@iamjariwala/react-doc-viewer";
import "@iamjariwala/react-doc-viewer/dist/index.css";



type DocViewerProps ={
    doc: any
}

export default function DocumentViewer(props: DocViewerProps) {
    const docs = [
        { uri: props.doc.url },
    ];

    return <DocViewer documents={docs} pluginRenderers={DocViewerRenderers}  config={{
        fullscreen: { enableFullscreen: true },
    }}/>;
}