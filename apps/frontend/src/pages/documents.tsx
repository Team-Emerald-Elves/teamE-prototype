
import {useState, useEffect, useCallback, createContext, useContext} from "react";
import {getToken, useAuth} from "@clerk/react"
import {DocumentsTable} from "../components/documents-table.tsx"
import { columns, type Document } from "../components/docCols.tsx"
import PageHeader from "../components/page-header.tsx"




async function getDocuments(token: string):Promise<Document[]> {
    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/supabase/list-documents`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    )

    if (!res.ok) {
        throw new Error("Failed to fetch docs")
    }

    return await res.json()
}

async function getDocumentsAdmin(token: string) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/supabase/list-documents`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
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

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRoles((data.roles as string[]).map((r: string) => r.toLowerCase()));

        const docsData = await getDocumentsAdmin(token);
        setDocs(docsData);
    }, [isSignedIn, getToken]);

    useEffect(() => {
        refreshDocs();
    }, [refreshDocs]);


    return (
        <>
            <reloadContext.Provider value={refreshDocs} >
                <PageHeader title="Documents" description="View your documents or modify them by adding, deleting, or updating existing ones."/>
                    <div>

                        <DocumentsTable columns={columns} data={docs} reload={refreshDocs} />
                    </div>
            </reloadContext.Provider>
        </>
    )

}