
import {useState, useEffect} from "react";
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


export default function Documents() {
    const [roles, setRoles] = useState<string[]>([]);
    const[docs, setDocs] = useState<Document[]>([]);
    const { getToken, isSignedIn } = useAuth();
    const [me, setMe] = useState(null);

    useEffect(() => {
        if (!isSignedIn) {
            setMe(null);
            return;
        }

        async function load() {
            const token = await getToken();

            const res = await fetch("http://localhost:3000/api/tests/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            setMe(data);
            setRoles((data.roles as string[]).map((role: string) => role.toLowerCase()))
        }

        load();
    }, [isSignedIn]);

    const [sessionToken, setSessionToken] = useState("")

    useEffect(() => {
        getToken().then(t => setSessionToken(t ?? ""))
    }, [])


    useEffect(() => {
        if (!sessionToken || roles.length === 0) return;

        const fetchData = async () => {
            // const isAdmin = roles.some(role =>
            //     role.toLowerCase().startsWith("admin")
            // );

            const docsData = await getDocumentsAdmin(sessionToken)

            setDocs(docsData);
            console.log(docs);
        };

        fetchData();
    }, [sessionToken, roles]);

        return (
            <>
                <PageHeader title="Documents" description="View your documents or modify them by adding, deleting, or updating existing ones."/>
                <div>
                    <DocumentsTable columns={columns} data={docs} />
                </div>

            </>
        )

}