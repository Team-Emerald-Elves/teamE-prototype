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
  type: string
  formData: {
    id: number
    name: string
    url: string
    contentOwner: string
    role: string
    document_type: string
    expirationDate?: Date
    expirationTime: string
    document_status: string
  }
}

export type IFile = {
  id: number
  name: string
  url?: string
  content_owner: string
  expiration_date?: string
  mime_type?: string
  assigned_role: string
  document_type: string
  document_status: string
  filePayload?: string
}

function buildExpirationDate(
  expirationDate?: Date,
  expirationTime?: string
): string | undefined {
  if (!expirationDate) return undefined

  const date = new Date(expirationDate)

  if (expirationTime) {
    const [hours = "0", minutes = "0", seconds = "0"] = expirationTime.split(":")
    date.setHours(Number(hours), Number(minutes), Number(seconds), 0)
  }

  return date.toISOString()
}

async function createDocument(fileData: SubmitConfirmationPopupProps, token: string) {
  console.log("TOKEN SENT:", token)

  const data: IFile = {
    id: fileData.formData.id,
    name: fileData.formData.name,
    url: fileData.formData.url || "Local upload",
    content_owner: fileData.formData.contentOwner,
    expiration_date: buildExpirationDate(
      fileData.formData.expirationDate,
      fileData.formData.expirationTime
    ),
    document_type: fileData.formData.document_type,
    document_status: fileData.formData.document_status,
    assigned_role: fileData.formData.role,
    filePayload: "test"
  }

  const endpoint =
    fileData.type === "Create"
      ? "/api/supabase/create-document"
      : "/api/supabase/update-document"

  const method = fileData.type === "Create" ? "POST" : "PUT"

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Network response was not ok")
  }

  return await response.json()
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