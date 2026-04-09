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
import {getToken, useAuth} from '@clerk/react'
import {useEffect, useState} from "react";
import getEmployees from '@/components/user-management-table.tsx'
type Employee = {
    id: string;
    first_name: string;
    last_name: string;
    uname: string;
    email?: string;
    roles?: string[];
};
type deleteConfirmationPopupProps = {
    target: string
}

async function removeEmployee(employeeID: string,token: string) {

    const data = {
        action: "delete",
         employeeData: {id :employeeID}
    }
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employee`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete employee (status ${res.status}): ${errorText}`);
    }
    return res.json();
}
export function EmployeeConfirmationPopup(props: deleteConfirmationPopupProps) {

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
                        <Button type="submit" onClick={() => removeEmployee(props.target, sessionToken)}>Confirm</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EmployeeConfirmationPopup