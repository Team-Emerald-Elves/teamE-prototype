import {
    useState,
    useEffect,
    useCallback,
    createContext,
    useContext,
} from "react";
import { getToken, useAuth } from "@clerk/react";
import { DocumentsTable } from "../components/documents-table.tsx";
import { columns, type Document } from "../components/docCols.tsx";
import PageHeader from "../components/page-header.tsx";

async function getDocumentsAdmin(token: string) {
    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/supabase/list-documents`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        },
    );

    if (!res.ok) {
        throw new Error("Failed to fetch docs");
    }
    const data = await res.json();
    return data;
}

const reloadContext = createContext<(() => Promise<void>) | null>(null);

// export const useReload = () => {
//     const context= useContext(reloadContext);
//     if (!context) console.error("useReload() called outside Documents");
//     return context;
// }

export default function Documents() {
    const { getToken, isSignedIn } = useAuth();
    const [roles, setRoles] = useState<string[]>([]);
    const [docs, setDocs] = useState<Document[]>([]);

    const refreshDocs = useCallback(async () => {
        if (!isSignedIn) return;
        const token = await getToken();
        if (!token) return;

        const docsData = await getDocumentsAdmin(token);
        setDocs(docsData);
    }, [getToken]);

    useEffect(() => {
        refreshDocs();
    }, [refreshDocs]);

    const [helpOpen, setHelpOpen] = useState(false);
    const helpSections = [
        {
            title: "Viewing Documents",
            body: "All uploaded documents are listed in the table below. You can sort and filter by dates, name, owner, and tags.",
        },
        {
            title: "Adding a Document",
            body: "Click the 'Add Document' button to upload a new file. Supported formats include PDF, DOCX, and more.",
        },
        {
            title: "Updating a Document",
            body: "Click the edit icon next to any document to update its name or replace the file.",
        },
        {
            title: "Deleting a Document",
            body: "Click the delete icon next to a document to permanently remove it.",
        },
        {
            title: "Searching",
            body: "Use the search bar at the top of the table to quickly find a document by name.",
        },
    ];

    return (
        <>
            {helpOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setHelpOpen(false)} // clicking outside closes it
                >
                    <div
                        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 flex flex-col gap-5 shadow-xl"
                        onClick={(e) => e.stopPropagation()} // stops click from closing when clicking inside
                    >
                        <h2 className="text-xl font-bold text-gray-900">
                            How to Use Documents
                        </h2>
                        {helpSections.map((section) => (
                            <div key={section.title}>
                                <p className="font-semibold text-gray-800 mb-1">
                                    {section.title}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    {section.body}
                                </p>
                            </div>
                        ))}
                        <button
                            onClick={() => setHelpOpen(false)}
                            className="mt-2 text-sm text-gray-400 hover:text-gray-600 transition-colors self-center"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="mx-5 pt-6 text-left flex flex-start flex-col pl-5">
                <h1 className="text-left pb-2">Documents</h1>
                <div className="bg-[#F4A258] w-30 h-[3px]" />
                <div className="flex items-center gap-1 pt-3">
                    <p className="header-subtext-color">
                        View your documents or modify them by adding, deleting,
                        or updating existing ones.
                    </p>
                    <button
                        onClick={() => setHelpOpen(true)}
                        className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold hover:bg-blue-200 transition-colors"
                        title="Help"
                    >
                        ?
                    </button>
                </div>
            </div>

            <div>
                <DocumentsTable columns={columns} />
            </div>
        </>
    );
}
