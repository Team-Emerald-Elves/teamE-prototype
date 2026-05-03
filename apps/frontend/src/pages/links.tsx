import LinksTable from "@/components/linkstable.tsx";
import { useAuth } from "@clerk/react";
import PageHeader from "../components/page-header.tsx";
import { columns } from "../components/linksCols.tsx";
import { useEffect, useState } from "react";
import qmgr from "@/lib/querymgr.ts";

// const linkContext = createContext <(() => Promise<void>) | null>(null);
// export const useLinks = () => {
//     const context= useContext(linkContext);
//     if (!context) console.error("uselinks() called outside Documents");
//     return context;
// };

function LinksPage() {
    const { isSignedIn } = useAuth();
    const [helpOpen, setHelpOpen] = useState(false);

    const helpSections = [
        {
            title: "Viewing Links",
            body: "All saved links are listed in the table below. You can sort and filter by dates, name, role, and tags.",
        },
        {
            title: "Adding a Link",
            body: "Click the 'Add Link' button to save a new link.",
        },
        {
            title: "Updating a Link",
            body: "Click the edit icon next to any link to update its name or URL.",
        },
        {
            title: "Deleting a Link",
            body: "Click the delete icon next to a link to permanently remove it.",
        },
        {
            title: "Searching",
            body: "Use the search bar at the top of the table to quickly find a link by name.",
        },
    ];

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
            {helpOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setHelpOpen(false)} // clicking outside closes it
                >
                    <div
                        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 flex flex-col gap-5 shadow-xl"
                        onClick={(e) => e.stopPropagation()} // stops click from closing when clicking inside
                    >
                        <h2 className="text-xl font-bold text-gray-900">How to Use Links</h2>
                        {helpSections.map((section) => (
                            <div key={section.title}>
                                <p className="font-semibold text-gray-800 mb-1">{section.title}</p>
                                <p className="text-gray-600 text-sm">{section.body}</p>
                            </div>
                        ))}
                        <button
                            onClick={() => setHelpOpen(false)}
                            className="mt-2 text-sm text-gray-400 hover:text-gray-600 transition-colors self-center"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="mx-5 pt-6 text-left flex flex-start flex-col pl-5">
                <h1 className="text-left pb-2">Links</h1>
                <div className="bg-[#F4A258] w-30 h-[3px]" />
                <div className="flex items-center gap-1 pt-3">
                    <p className="header-subtext-color">View your links or modify them by adding, deleting, or updating existing ones.</p>
                    <button
                        onClick={() => setHelpOpen(true)}
                        className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold hover:bg-blue-200 transition-colors"
                        title="Help"
                    >
                        ?
                    </button>
                </div>
            </div>
            <div className="relative w-full flex items-center"></div>

            <div>
                <LinksTable columns={columns} />
            </div>
        </>
    );
}

export default LinksPage;
