import '../App.css'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Delete02Icon } from 'hugeicons-react';
import { Button } from "@/components/ui/button"
import EditLinksForm from '@/components/editlinksform.tsx'
import ConfirmationPopup from "@/components/deletePopupConfirmation.tsx";

const users = [
    {
        name: "John Doe",
        link: "https://example.com",
        description: "JohnDoe"
    },
    {
        name: "John Doe",
        link: "https://example.com",
        description: "JohnDoe"
    },
    {
        name: "John Doe",
        link: "https://example.com",
        description: "JohnDoe"
    },
    {
        name: "John Doe",
        link: "https://example.com",
        description: "JohnDoe"
    },
    {
        name: "John Doe",
        link: "https://example.com",
        description: "JohnDoe"
    },
    {
        name: "John Doe",
        link: "https://example.com",
        description: "JohnDoe"
    },

]

function LinksTable(){
    return (
        <>
            <div className="shadow-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead></TableHead>
                            <TableHead className="flex text-center items-center pl-[35px]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((users) => (
                            <TableRow key={users.name}>


                                <TableCell>{users.name}</TableCell>
                                <TableCell>{users.description}</TableCell>

                                <TableCell className="flex items-center gap-3">
                                    <EditLinksForm
                                        type= "add link"
                                        name = {users.name}
                                        link = {users.link}
                                        description={users.description}
                                        size={true}
                                    />
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

export default LinksTable;