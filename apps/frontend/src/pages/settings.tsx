import AddLinksForm from '@/components/addlinksform.tsx'
import Linkstable from "@/components/linkstable.tsx";
type settingsProps = {
    me: any
}
function Settings(props: settingsProps) {
    return (
        <>
            <div className="text-center font-bold text-primary">
                <h1 className="font-mono">Links</h1>
            </div>


            <div className="relative w-full flex items-center">


                <div className="ml-auto pr-6">
                    <AddLinksForm
                        type="Add Link"
                        name="Name"
                        url="www.example.com"
                        description="What is the link used for"
                        size={true}
                        me={props.me}
                    />
                </div>
            </div>
            <div className="px-10 py-20 ">
                <Linkstable me={props.me}/>
            </div>
        </>
    )
}

export default Settings;