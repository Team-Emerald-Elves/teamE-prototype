import DocumentCard from '../components/docCard.tsx'
import ContentForm from '../components/contentForm.tsx'
import {SearchBar} from '../components/searchbar.tsx'
import {useState, useEffect} from "react";
import {getToken, useAuth} from "@clerk/react"


type Document = {
    name: string,
    url: string,
    id: number,
    bucketID: string,
    lastModified: string,
    expirationDate: string,
    mimeType: string,
    documentStatus: number,

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


function Documents() {
    const [roles, setRoles] = useState<string[]>([]);
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

    const [documents, setDocuments] = useState([]);
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

            setDocuments(docsData);
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                    {documents.map((doc:Document) => (
                        <div key={doc.id}>
                            <DocumentCard document={doc} name={doc.name} type="Reference" />
                        </div>

                    ))}
                    {/*<DocumentCard name="Underwriting Rules" type="Reference" />*/}
                    {/*<DocumentCard name="Approved Filings" type="Reference" />*/}
                    {/*<DocumentCard name="State Guidelines" type="Reference"/>*/}
                    {/*<DocumentCard name="Use Cases" type="Reference"/>*/}

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
                            currentExpirationDate="Tomorrow"
                            currentExpirationTime="10:30:00"
                            currentStatus="Select Status"
                            size={true}
                        />
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {documents.map((doc:Document) => (
                        <DocumentCard document={doc} name={doc.name} type="Reference" />
                    ))}
                    {/*<DocumentCard name="Business Requirements" type="Workflow" />*/}
                    {/*<DocumentCard name="System Requirements" type="Workflow"/>*/}
                    {/*<DocumentCard name="Process Flow Diagrams" type="Workflow"/>*/}
                    {/*<DocumentCard name="ACT Guide" type="Workflow"/>*/}
                    {/*<DocumentCard name="Traceability Matrix" type="Workflow"/>*/}


                </div>


            </>
        )
    }
}
export default Documents;