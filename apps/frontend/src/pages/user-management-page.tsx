import "../App.css";

import UserManagementTable from "../components/user-management-table";
import PageHeader from "@/components/page-header.tsx";
import { columns } from "../components/employeeCols.tsx";
import {useEffect} from "react";

function UserManagementPage() {


    return (
        <>
            <PageHeader
                title="User Management"
                description="View users, add new users, delete existing users, and update current user accounts. Admin access only."
            />
            <div>
                <UserManagementTable columns={columns} />
            </div>
        </>
    );
}

export default UserManagementPage;
