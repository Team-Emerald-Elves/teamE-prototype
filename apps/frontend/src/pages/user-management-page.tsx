import '../App.css'

import UserManagementTable from  '../components/user-management-table';
import CreateEmployeeForm from "@/components/createEmployeeForm.tsx";

function UserManagementPage(){
    return (
        <>
            <h1 className = "text-primary">User Management</h1>
            <CreateEmployeeForm />
            <div className="px-10 py-20 ">
                <UserManagementTable />
            </div>

        </>
    )
}

export default UserManagementPage;