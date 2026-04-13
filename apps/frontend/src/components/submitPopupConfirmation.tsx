import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { getToken } from "@clerk/react"
import {useEffect, useState} from "react";

type SubmitConfirmationPopupProps = {
    type: string,
    formData: {
        name: string,
        url: string,
        contentOwner: string,
        role: string,
        document_type: string,
        expirationDate: Date | undefined,
        expirationTime: string,
        document_status: string,
        id: number,
    }
}

export type IFile = {
    fileName: string
    fileID: number
    fileContent: {
        name: string
        URL?: string
        content_owner: string
        expiration_date?: Date | string
        mime_type?: string
        documment_status?: number
        assigned_role: string
        document_type: string
        document_status: string
    }
    filePayload: File | string
}

async function createDocument(fileData: SubmitConfirmationPopupProps, token: string) {
    console.log("TOKEN SENT:", token)

    const data: IFile  = {
        fileName: fileData.formData.name,
        fileID: fileData.formData.id,
        fileContent: {
            name: fileData.formData.name,
            URL: fileData.formData.url,
            content_owner: fileData.formData.contentOwner,
            expiration_date: undefined,
            document_type: fileData.formData.document_type,
            document_status: fileData.formData.document_status,
            assigned_role: fileData.formData.role
        },
        filePayload: "test"
    }
    if (fileData.type === "Create") {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/supabase/create-file`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
    }
    else if (fileData.type === "Edit") {
        console.log(data)
        console.log(token)
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/supabase/update-file`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
    }


}

export function SubmitConfirmationPopup(info: SubmitConfirmationPopupProps) {

    const [sessionToken, setSessionToken] = useState("")

    useEffect(() => {
        getToken().then(t => setSessionToken(t ?? ""))
    }, [])


    return (
        <Dialog>
            <DialogTrigger >
                <Button type="submit" className=" bg-secondary text-secondary-foreground" size="lg">Submit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose >
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose>
                        <Button type="submit" onClick={() => {createDocument(info, sessionToken)}}>Confirm</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SubmitConfirmationPopup