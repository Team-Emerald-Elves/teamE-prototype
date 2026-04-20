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
import type { Links } from './types/linkstable.d.ts'
import {useLinks} from "../pages/links.tsx"
type Links = {
    id: string;
    link_name: string;
    url: string;
    owner: string;
    favorite: boolean;
};


type deleteConfirmationPopupProps = {
    link: Links
}

type editlinksRequest ={
    action: string,
    linkData: Links,

}

// async function updateLinks(body: editlinksRequest) {
//     console.log(body)
//     const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/links`, {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(body),
//     });

//     if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(`Failed to update link (status ${res.status}): ${errorText}`);
//     }
//     return res.json();
// }
async function removeLink(body: editlinksRequest) {

    console.log(body)
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/links`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update link (status ${res.status}): ${errorText}`);
    }
    return res.json();
}

export function DeleteConfirmationPopupLink(props: deleteConfirmationPopupProps) {

    // const [sessionToken, setSessionToken] = useState("")

    // useEffect(() => {
    //     getToken().then(t => setSessionToken(t ?? ""))
    // }, [])

    const bodyData ={
        action: "delete",
        linkData: props.link
    }
    const reload = useLinks();
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
                        <Button type="submit" onClick={() => {removeLink(bodyData); reload()}}>Confirm</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteConfirmationPopupLink