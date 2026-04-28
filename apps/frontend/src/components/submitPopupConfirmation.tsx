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
    filePayload?: string
    fileName?: string
  }
  refresh: (any) => void
  open: (arg:boolean) => void
  disabled: boolean
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
  fileName?: string
}
export type Document = {
    id: number;
    url: string;
    name: string;
    last_modified: string;
    expiration_date: string;
    lock: boolean;
    mime_type: string;
    document_type: string;
    assigned_role: string;
    content_owner: string;
    document_status: string;
    favorite: boolean;
    lock_name: string;
    meta_tags: string[];
    created_at: string;
};

async function createNotif(doc: Document, action: string) {
    const token = await getToken();

    const res1 = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const me = await res1.json();
    console.log(me);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifs/create-notification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            public: true,
            targetRoles: [doc.assigned_role, "Administrator"],
            title: `${me.first_name} ${me.last_name} ${action} ${doc.name.substring(0, 12) + (doc.name.length >= 12 ? '...' : '')}`,
        })
    })

    if (!res.ok) {
        throw new Error("failed to create view notification")
    }
    console.log(await res.json());
}

async function setDocumentLock(sessionToken: string | null, documentID: number, status: boolean): Promise<boolean> {


    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/update-lock`, {
        headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json"
        },
        method: "PUT",
        body: JSON.stringify({
            id: documentID,
            status: status
        })
    })
    if (!res.ok) {
        throw new Error("Failed to fetch document.");
    }
    const data = await res.json();

    return Boolean(data);
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

async function createDocument(fileData: SubmitConfirmationPopupProps, token: string, refresh: (any: any) => void) {

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
    filePayload: fileData.formData.filePayload,
    fileName: fileData.formData.fileName
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
      console.error(errorText)
    throw new Error(errorText || "Network response was not ok")
  }

  const newDoc = await response.json();
  console.log(newDoc)

    if (fileData.type === "Create") {
        createNotif(newDoc, "created")
    }
    else {
        createNotif(newDoc, "updated")
    }

  refresh(prev => !prev)

  return newDoc
}

export function SubmitConfirmationPopup(info: SubmitConfirmationPopupProps) {

    const [sessionToken, setSessionToken] = useState("")
    const [open, setOpen] = useState(false)
    useEffect(() => {
        getToken().then(t => setSessionToken(t ?? ""))
    }, [])

    return (
        <>
            { info.disabled ? (
                <Button type="submit" disabled={true} className=" bg-secondary text-secondary-foreground" size="lg">Submit</Button>
            ) : (
                <Dialog open={open} onClose={() => {setOpen(false)}} onOpenChange={setOpen}>
                    <DialogTrigger>
                        <Button type="submit" className=" bg-secondary text-secondary-foreground" size="lg">Submit</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose >
                                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            </DialogClose>
                            <DialogClose>
                                <Button type="button" onClick={() => {
                                    try{
                                        createDocument(info, sessionToken, info.refresh);console.log("submitted sucsessfully!");
                                        info.open(false);
                                        console.log("closed ready for refresh");
                                    }
                                    catch (error) {
                                        console.error("broke at",error)
                                    }}}>Confirm</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )
            }
        </>
    )
}

export default SubmitConfirmationPopup