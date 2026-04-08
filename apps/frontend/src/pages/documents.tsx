import DocumentCard from '../components/docCard.tsx'
import ContentForm from '../components/contentForm.tsx'
import {SearchBar} from '../components/searchbar.tsx'
import {useState, useEffect} from "react";

type docProps = {
    role: string;
    doc: Document[]
}

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


async function getDocuments() {
    console.log("adwdwaddwdawdadwdadawdda")
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/supabase/list-files`)

    if (!res.ok) {
        throw new Error("Failed to fetch docs");
    }
    const docs = await res.json();
     console.log(docs);
    return docs;
}

function Documents(props: docProps) {
    const [documents, setDocuments] = useState<Document[]>([]);

    useEffect(() => {
        getDocuments()
            .then((docs) => {
                console.log("Docs received in useEffect:", docs);
                setDocuments(docs);
            }).catch(console.error);
    }, []);



    if (props.role === "u") {
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
                            currentName="Name..."
                            currentURL="www.example.com"
                            currentContentOwner="Select Content Owner"
                            currentRole="Select Role"
                            currentExpirationDate={undefined}
                            currentExpirationTime="10:30:00"
                            currentStatus="Select Status"
                            size={true}
                        />
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {documents.map((doc:Document) => (
                        <div key={doc.id}>
                            <DocumentCard name={doc.name} type="Reference" />
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
                            currentName="Name..."
                            currentURL="www.example.com"
                            currentContentOwner="Select Content Owner"
                            currentRole="Select Role"
                            currentExpirationDate={undefined}
                            currentExpirationTime="10:30:00"
                            currentStatus="Select Status"
                            size={true}
                        />
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {documents.map((doc:Document) => (
                        <DocumentCard name={doc.name} type="Reference" />
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