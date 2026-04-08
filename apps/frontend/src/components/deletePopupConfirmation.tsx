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
import {HugeiconsIcon} from "@hugeicons/react";
import {Delete02Icon} from "@hugeicons/core-free-icons";
import { useAuth } from '@clerk/react'

type deleteConfirmationPopupProps = {
    target: string
}

async function removeDocument(fileName: string, token: string) {

    const data = {
        fileName: fileName
    }

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/supabase/delete-file`, {
          method: 'DELETE', // 1. Set method to DELETE
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

export function DeleteConfirmationPopup(props: deleteConfirmationPopupProps) {

    const { getToken } = useAuth();

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
                        <Button type="submit" onClick={() => getToken().then(token => removeDocument(props.target, token as string))}>Confirm</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteConfirmationPopup