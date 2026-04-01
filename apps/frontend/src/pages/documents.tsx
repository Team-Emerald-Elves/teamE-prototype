import DocumentCard from '../components/docCard.tsx'
import ContentForm from '../components/contentForm.tsx'

function Documents() {
    return (
        <>
            <h1>Documents</h1>
            <ContentForm
                type="Create"
                currentName="Name..."
                currentURL="www.example.com"
                currentContentOwner="Select Content Owner"
                currentRole="Select Role"
                currentExpirationDate={undefined}
                currentExpirationTime="10:30:00"
                currentStatus="Select Status"
            />
            <DocumentCard name="Underwriting Rules" />

        </>
    )
}
export default Documents;