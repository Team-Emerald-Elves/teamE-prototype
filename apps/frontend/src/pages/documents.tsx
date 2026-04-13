import ContentForm from '../components/contentForm.tsx'
import {SearchBar} from '../components/searchbar.tsx'
import {useState, useEffect} from "react";
import {getToken, useAuth} from "@clerk/react"
import {TestDoc} from "../components/testdoctable.tsx"
import { columns, type UserDocuments } from "../components/docCols.tsx"


type Document = {
    id: number;
    url: string;
    name: string;
    lastModified: string;
    expirationDate: string;
    mime_type: string;
    role: string;
    contentOwner: string;
    status: string;
};

const Data: Document[] = [];

const Doc1: Document = {
    id: 1,
    url: "www.testurl.com",
    name: "underwritingrole",
    lastModified: "01/02/2025",
    expirationDate: "01/02/2027",
    mime_type: "reference",
    role: "underwriter",
    contentOwner: "leah",
    status: "not_started",
};

const Doc2: Document = {
    id: 2,
    url: "www.testurl2.com",
    name: "businessanalystrole1",
    lastModified: "03/02/2025",
    expirationDate: "03/02/2027",
    mime_type: "reference",
    role: "businessanalyst",
    contentOwner: "john",
    status: "not_started",
};

Data.push(Doc1);
Data.push(Doc2);

async function getData(): Promise<UserDocuments[]> {
    // Fetch data from your API here.
    return [
        {
            id: 2,
            url: "www.testurl2.com",
            name: "businessanalystrole1",
            lastModified: "03/02/2025",
            expirationDate: "03/02/2027",
            mime_type: "reference",
            role: "businessanalyst",
            contentOwner: "john",
            status: "not_started",
        },
        // ...
    ]
}

async function getDocuments(token: string) {
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
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/content`,
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
            const isAdmin = roles.some(role =>
                role.toLowerCase().startsWith("admin")
            );

            const docsData = isAdmin
                ? await getDocumentsAdmin(sessionToken)
                : await getDocuments(sessionToken);

            setDocs(docsData);
        };

        fetchData();
    }, [sessionToken, roles]);



    if (roles.includes("u")) {
        return (
            <>
                <div className="text-center font-bold text-primary">
                    <h1 className="font-mono">Documents</h1>
                </div>
                <div className="flex items-center w-full p-4">
                    <div className="flex-1 flex ">
                        <SearchBar />
                    </div>


                    <div className="ml-auto  p-4">
                        <ContentForm
                            type="Create"
                            currentID={Math.trunc((Math.random() * 10000) % 10000)}
                            currentName="Name..."
                            currentURL="www.example.com"
                            currentContentOwner="Select Content Owner"
                            currentRole="Select Role"
                            currentExpirationDate={(new Date(Date.now() + 1)).toISOString()}
                            currentExpirationTime="10:30:00"
                            currentStatus="Select Status"
                            size={true}
                        />
                    </div>

                </div>

            </>
        )
    }
    else {
        return (
            <>
                <div className="text-center font-bold text-primary">
                    <h1 className="font-mono">Documents</h1>
                </div>
                <div>
                    <TestDoc columns={columns} data={Data} />
                </div>

            </>
        )
    }
}