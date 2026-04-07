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
import { Button } from "@/components/ui/button"

const users = [
    {
        name: "John Doe",
        description: "JohnDoe"
    },
    {
        name: "John Doe",
        description: "JohnDoe"
    },
    {
        name: "John Doe",
        description: "JohnDoe"
    },
    {
        name: "John Doe",
        description: "JohnDoe"
    },
    {
        name: "John Doe",
        description: "JohnDoe"
    },
    {
        name: "John Doe",
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
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((users) => (
                            <TableRow key={users.name}>

                                <TableCell>{users.name}</TableCell>
                                <TableCell>{users.description}</TableCell>

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

export default LinksTable;