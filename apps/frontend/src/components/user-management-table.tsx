import '../App.css'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Edit03Icon } from 'hugeicons-react';
import { Delete02Icon } from 'hugeicons-react';
import { UserCircleIcon } from 'hugeicons-react';
import { Button } from "@/components/ui/button"

const users = [
    {
        name: "John Doe",
        username: "JohnDoe",
        email: "jodoe@gmail.com",
        role: "Business Analyst",
    },
    {
        name: "John Doe",
        username: "JohnDoe",
        email: "jodoe@gmail.com",
        role: "Underwriter",
    },
    {
        name: "John Doe",
        username: "JohnDoe",
        email: "jodoe@gmail.com",
        role: "Underwriter",
    },
    {
        name: "John Doe",
        username: "JohnDoe",
        email: "jodoe@gmail.com",
        role: "Business Analyst",
    },
    {
        name: "John Doe",
        username: "JohnDoe",
        email: "jodoe@gmail.com",
        role: "Admin",
    },
    {
        name: "John Doe",
        username: "JohnDoe",
        email: "jodoe@gmail.com",
        role: "Underwriter",
    },

]

function UserManagementTable(){
    return (
        <>
            <div className="shadow-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="flex text-center items-center pl-[35px]">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((users) => (
                        <TableRow key={users.name}>
                            <TableCell className="font-medium">
                                <div className="flex gap-3 items-center">
                                    <UserCircleIcon size={25} strokeWidth={1.5}/>
                                    {users.name}
                                </div>
                            </TableCell>

                            <TableCell>{users.username}</TableCell>
                            <TableCell>{users.email}</TableCell>
                            <TableCell>{users.role}</TableCell>

                            <TableCell className="flex items-center gap-3">
                                <Button variant = "outline" size = "icon">
                                    <Edit03Icon size={20} />
                                </Button>
                                <Button variant = "destructive" size = "icon">
                                    <Delete02Icon size={20} />
                                </Button>


                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
        </>
    )
}

export default UserManagementTable;