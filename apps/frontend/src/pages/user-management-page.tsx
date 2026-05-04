import "../App.css";
import { useState } from "react";

import UserManagementTable from "../components/user-management-table";
import PageHeader from "@/components/page-header.tsx";
import { columns } from "../components/employeeCols.tsx";
import {useEffect} from "react";

const helpSections = [
    {
        title: "Viewing Users",
        body: "All users are listed in the table below. You can sort and filter by name, email, role, and date.",
    },
    {
        title: "Adding a User",
        body: "Click the 'Add User' button to create a new user account.",
    },
    {
        title: "Updating a User",
        body: "Click the edit icon next to any user to update their name, email, or role.",
    },
    {
        title: "Deleting a User",
        body: "Click the delete icon next to a user to permanently remove their account.",
    },
    {
        title: "Searching & Filtering",
        body: "Use the search bar to find a user by name or email. Use the filter options to narrow by role.",
    },
];

function UserManagementPage() {
    const [helpOpen, setHelpOpen] = useState(false);


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
                        <h2 className="text-xl font-bold text-gray-900">How to Use User Management</h2>
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
                <h1 className="text-left pb-2">User Management</h1>
                <div className="bg-[#F4A258] w-30 h-[3px]" />
                <div className="flex items-center gap-1 pt-3">
                    <p className="header-subtext-color">View users, add new users, delete existing users, and update current user accounts. Admin access only.</p>
                    <button
                        onClick={() => setHelpOpen(true)}
                        className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold hover:bg-blue-200 transition-colors"
                        title="Help"
                    >
                        ?
                    </button>
                </div>
            </div>

            <div>
                <UserManagementTable columns={columns} />
            </div>
        </>
    );
}

export default UserManagementPage;
