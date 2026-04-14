import '../App.css'

import UserManagementTable from  '../components/user-management-table';
import PageHeader from "@/components/page-header.tsx";

function UserManagementPage(){
    return (
        <>
            <PageHeader title="User Management" description="View users, add new users, delete existing users, and update current user accounts. Admin access only."/>
            <div className="px-10 py-20 ">
                <UserManagementTable />
            </div>

        </>
    )
}

export default UserManagementPage;