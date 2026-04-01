import DocumentCard from '../components/docCard.tsx'
import ContentForm from '../components/contentForm.tsx'

function Documents() {
    return (
        <>
            <div className="text-center">
                <h1 className="font-mono">Documents</h1>
            </div>
            <div className="flex flex-col w-full p-4">
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

            <DocumentCard name="Underwriting Rules" />

        </>
    )
}
export default Documents;