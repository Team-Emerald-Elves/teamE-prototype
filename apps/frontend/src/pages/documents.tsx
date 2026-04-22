
import {useState, useEffect, useCallback, createContext, useContext} from "react";
import {getToken, useAuth} from "@clerk/react"
import {DocumentsTable} from "../components/documents-table.tsx"
import { columns, type Document } from "../components/docCols.tsx"
import PageHeader from "../components/page-header.tsx"

async function getDocumentsAdmin(token: string) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/supabase/list-documents`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    )

    if (!res.ok) {
        throw new Error("Failed to fetch docs")
    }
    const data = await res.json()
    return data
}

const reloadContext= createContext <(() => Promise<void>) | null>(null);

export const useReload = () => {
    const context= useContext(reloadContext);
    if (!context) console.error("useReload() called outside Documents");
    return context;
}

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


    return (
        <>
            <reloadContext.Provider value={refreshDocs} >
                <PageHeader title="Documents" description="View your documents or modify them by adding, deleting, or updating existing ones."/>
                    <div>

                        <DocumentsTable columns={columns} reload={refreshDocs} />
                    </div>
            </reloadContext.Provider>
        </>
    )

}