import AddLinksForm from '@/components/editlinksform.tsx'
import Linkstable from "@/components/linkstable.tsx";

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
                    <AddLinksForm
                        type = "Add Link"
                        name = "Name"
                        link="www.example.com"
                        description="What is the link used for"
                        size ={true}
                    />
                </div>
            </div>
            <div className="px-10 py-20 ">
                <Linkstable />
            </div>
        </>
    )
}

export default Settings;
