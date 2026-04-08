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
import { FieldContent } from "./ui/field"

type SubmitConfirmationPopupProps = {
    formData: {
        name: string,
        url: string,
        contentOwner: string,
        role: string,
        contentType: string,
        expirationDate: Date | undefined,
        expirationTime: string,
        status: string
    }
}

export type IFile = {
    fileName: string
    fileContent: {
        name: string
        URL?: string
        content_owner: string
        expiration_date?: Date | string
        mime_type?: string
        documment_status?: number
    }
    filePayload: File | string
}

async function createDocument(fileData: SubmitConfirmationPopupProps, token: string) {

    const data: IFile  = {
        fileName: fileData.formData.name,
        fileContent: {
            name: fileData.formData.name,
            URL: fileData.formData.url,
            content_owner: fileData.formData.contentOwner,
            expiration_date: undefined,
            mime_type: fileData.formData.contentType
        },
        filePayload: "test"
    }

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

export function SubmitConfirmationPopup(info: SubmitConfirmationPopupProps) {

    let sessionToken: string = ''

    getToken().then(token => {
        sessionToken = token as string
    })

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