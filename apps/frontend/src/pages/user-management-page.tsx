import '../App.css'

import UserManagementTable from  '../components/user-management-table';
import PageHeader from "@/components/page-header.tsx";
import {useEffect, useState} from "react";

import { columns, type Employee } from "../components/employeeCols.tsx"


async function getEmployees() {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employee`);

    if ((res.status === 401 || res.status === 403) && !window.location.href.endsWith("/employee-management")) {
        window.location.replace("/");
    }

    if (!res.ok) {
        throw new Error("Failed to fetch employees");
    }
    const data = await res.json();
    console.log(data)

    return data;
}



function UserManagementPage(){
    const [, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        getEmployees()
            .then(setEmployees)
            .catch(console.error);
    }, []);
    return (
        <>
            <PageHeader title="User Management" description="View users, add new users, delete existing users, and update current user accounts. Admin access only."/>
            <div>
                <UserManagementTable columns={columns}/>
            </div>

        </>
    )
}

export default UserManagementPage;