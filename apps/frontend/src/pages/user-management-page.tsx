import '../App.css'
import UserManagementTable from  '../components/user-management-table';

function UserManagementPage(){
    return (
        <>
            <h1 className = "text-primary">User Management</h1>
            <div className="px-10 py-20 ">
                <UserManagementTable />
            </div>

        </>
    )
}

export default UserManagementPage;