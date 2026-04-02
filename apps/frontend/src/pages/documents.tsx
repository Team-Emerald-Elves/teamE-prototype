import DocumentCard from '../components/docCard.tsx'
import ContentForm from '../components/contentForm.tsx'
import {SearchBar} from '../components/searchbar.tsx'
type docProps = {
    role: string;
}
function Documents(props: docProps) {
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

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    <DocumentCard name="Underwriting Rules" type="Reference" />
                    <DocumentCard name="Approved Filings" type="Reference" />
                    <DocumentCard name="State Guidelines" type="Reference"/>
                    <DocumentCard name="Use Cases" type="Reference"/>

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

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    <DocumentCard name="Business Requirements" type="Workflow" />
                    <DocumentCard name="System Requirements" type="Workflow"/>
                    <DocumentCard name="Process Flow Diagrams" type="Workflow"/>
                    <DocumentCard name="ACT Guide" type="Workflow"/>
                    <DocumentCard name="Traceability Matrix" type="Workflow"/>


                </div>


            </>
        )
    }
}
export default Documents;