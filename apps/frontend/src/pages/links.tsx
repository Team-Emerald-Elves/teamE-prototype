import LinksTable from "@/components/linkstable.tsx";
import { useAuth } from "@clerk/react";
import PageHeader from "../components/page-header.tsx";
import { columns, type Links } from "../components/linksCols.tsx";
import { useEffect, useState } from "react";

// const linkContext = createContext <(() => Promise<void>) | null>(null);
// export const useLinks = () => {
//     const context= useContext(linkContext);
//     if (!context) console.error("uselinks() called outside Documents");
//     return context;
// };

function Links() {

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

export default Links;
