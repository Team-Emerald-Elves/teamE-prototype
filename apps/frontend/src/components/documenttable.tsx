import '../App.css'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {HugeiconsIcon} from "@hugeicons/react";
import { UserCircleIcon } from '@hugeicons/core-free-icons';

import {useEffect, useState} from "react";


import ContentForm from './contentForm.tsx';
import ConfirmationPopup from "@/components/deletePopupConfirmation.tsx";

type Document = {
    name: string,
    url: string,
    id: number,
    bucketID: string,
    lastModified: string,
    expirationDate: string,
    mimeType: string,
    documentStatus: number,
}
type documentTableProps = {
    document: Document
    name: string
    type: string
}

async function getDocument() {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/content`);

    if (!res.ok) {
        throw new Error("Failed to fetch content");
    }
    const data = await res.json();
    console.log(data)

    return data;
}


function DocumentTable(props: documentTableProps) {

    const [document, setDocument] = useState<Document[]>([]);

    useEffect(() => {
        getDocument()
            .then(setDocument)
            .catch(console.error);
    }, []);

    return (
        <>
            <div className="shadow-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Last Modified</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {document.map((doc) => (
                            <TableRow key={doc.id}>
                                <TableCell className="font-medium">
                                    <div className="flex gap-3 items-center">
                                        <HugeiconsIcon icon={UserCircleIcon} size={25} strokeWidth={1.5}/>
                                        {doc.name}
                                    </div>
                                </TableCell>

                                <TableCell>{doc.name}</TableCell>
                                <TableCell>{doc.lastModified}</TableCell>

                                <TableCell className="flex items-center gap-3">
                                    <div className="flex justify-end">
                                        <ContentForm
                                            type="Edit"
                                            currentName={props.document.name}
                                            currentURL={props.document.url}
                                            currentContentOwner="Bobby Tanner"
                                            currentRole="Underwriter"
                                            currentExpirationDate={props.document.expirationDate}
                                            currentExpirationTime="07:30:00"
                                            currentStatus="In Progress"
                                            currentID={props.document.id}
                                            size={false}
                                        />
                                    </div>

                                    <ConfirmationPopup target={props.name}/>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

export default DocumentTable;