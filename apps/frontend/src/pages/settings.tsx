import EditLinksForm from '@/components/editlinksform.tsx'
import LinkCard from "@/components/linkCard.tsx";

function Settings() {
    return (
        <>
            <div className="text-center font-bold text-primary">
                <h1 className="font-mono">Settings</h1>
            </div>
            <div className="flex justify-center items-center">
                <div className="flex font-bold text-center items-center">
                    <h2>Edit Links</h2>
                </div>
                <div className=" p-4 items-center">
                    <EditLinksForm
                        type = "Add Link"
                        name = "Name"
                        link="www.example.com"
                        description="What is the link used for"
                        size ={true}
                    />
                </div>
            </div>
            <div className="flex items-center w-full p-4">
                <LinkCard name={"Alex Link"} description={"Fake description"}></LinkCard>
            </div>
        </>
    )
}

export default Settings;
