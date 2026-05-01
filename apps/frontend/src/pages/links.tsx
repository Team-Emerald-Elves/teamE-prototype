import LinksTable from "@/components/linkstable.tsx";
import { useAuth } from "@clerk/react";
import PageHeader from "../components/page-header.tsx";
import { columns } from "../components/linksCols.tsx";
import { useEffect } from "react";
import qmgr from "@/lib/querymgr.ts";

// const linkContext = createContext <(() => Promise<void>) | null>(null);
// export const useLinks = () => {
//     const context= useContext(linkContext);
//     if (!context) console.error("uselinks() called outside Documents");
//     return context;
// };

function LinksPage() {
    const { isSignedIn } = useAuth();

    useEffect(() => {
        if (!isSignedIn) {
            return;
        }

        qmgr.wait(() => {
            qmgr.getMe(async (res) => {
                if (!res.success) {
                    throw new Error("Unable to get me");
                }
            });
        });
    }, []);

    return (
        <>
            <PageHeader
                title="Links"
                description="View your links or modify them by adding, deleting, or updating existing ones."
            />
            <div className="relative w-full flex items-center"></div>
            {/*<linkContext.Provider value={getLinks}>*/}
            <div>
                <LinksTable columns={columns} />
            </div>
            {/*</linkContext.Provider>*/}
        </>
    );
}

export default LinksPage;
