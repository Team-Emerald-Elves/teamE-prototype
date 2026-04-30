import LinksTable from "@/components/linkstable.tsx";
import {useAuth} from "@clerk/react";
import PageHeader from "../components/page-header.tsx"
import { columns, type Links } from "../components/linksCols.tsx"
import {useEffect, useState} from "react";
import qmgr from "@/lib/querymgr.ts";


// const linkContext = createContext <(() => Promise<void>) | null>(null);
// export const useLinks = () => {
//     const context= useContext(linkContext);
//     if (!context) console.error("uselinks() called outside Documents");
//     return context;
// };

function LinksPage() {
    const [roles, setRoles] = useState<string[]>([]);
    const {  isSignedIn } = useAuth();

    useEffect(() => {
        if (!isSignedIn) {
            return;
        }

        qmgr.wait(() => {
            qmgr.getMe( async (res) => {
                if (!res.success) {
                    throw new Error("Unable to get me");
                }
                const data = res.data!;
                setRoles((data.roles as string[]).map((role: string) => role.toLowerCase()))
            })
        })
        }, []);
        
        // async function getLinks() {
        //     const token = await getToken();
        //
        //     const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/links`, {
        //         method: "GET",
        //         headers: {
        //             Authorization: `Bearer ${token}`
        //         }
        //     });
        //
        //     if (!res.ok) {
        //         throw new Error("Failed to fetch links");
        //     }
        //     const data = await res.json();
        //     setLinks(data)
        //     return data;
        // }
        //
        // useEffect(() => {
        //     getLinks();
        // }, []);




    return (
        <>
            <PageHeader title="Links" description="View your links or modify them by adding, deleting, or updating existing ones."/>
            <div className="relative w-full flex items-center">


            </div>
            {/*<linkContext.Provider value={getLinks}>*/}
                <div>
                    <LinksTable columns={columns} />
                </div>
            {/*</linkContext.Provider>*/}
        </>
    )
}

export default LinksPage;