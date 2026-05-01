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
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { getToken } from '@clerk/react'
import { useEffect, useState } from "react";
import qmgr from "@/lib/querymgr";

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

type deleteConfirmationPopupProps = {
    target: Document
    refresh: (any) => void
}



async function createNotif(doc: Document, action: string): Promise<void> {
    const token = await getToken();

    qmgr.wait(() => {
        qmgr.getMe( async (res) => {
            if (!res.success) {
                console.error("Failed to get me")
                return;
            }

            const nRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifs/create-notification`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    public: true,
                    targetRoles: [doc.assigned_role, "Administrator"],
                    title: `${res.data!.first_name} ${res.data!.last_name} ${action} ${doc.name.substring(0, 12) + (doc.name.length >= 12 ? '...' : '')}`,
                })
            })
        
            if (!nRes.ok) {
                throw new Error("failed to create view notification")
            }
            console.log(await nRes.json());
        })
    })
}

async function removeDocument(document: Document, token: string, refresh: (any) => void) {

    const data = {
        id: document.id
    }

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/supabase/delete-document`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        createNotif(document, "deleted");

        refresh(prev => !prev)
        return response.json();
    })
}

export function DeleteConfirmationPopup(props: deleteConfirmationPopupProps) {

    const [sessionToken, setSessionToken] = useState("")
    useEffect(() => {
        getToken().then(t => setSessionToken(t ?? ""))
    }, [])

    return (
        <Dialog>
            <DialogTrigger >
                <Button variant = "destructive" size = "icon">
                    <HugeiconsIcon icon={Delete02Icon} size={20} />
                </Button>
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
                        <Button type="submit" onClick={() => {removeDocument(props.target, sessionToken, props.refresh);}}>Confirm</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteConfirmationPopup