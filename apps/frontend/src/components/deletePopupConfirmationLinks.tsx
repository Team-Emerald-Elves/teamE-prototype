import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import type { Links as linksData } from "@repo/database";
import { getToken } from "@clerk/react";

type deleteConfirmationPopupProps = {
    link: linksData;
    reload: (any: any) => void;
};

type editlinksRequest = {
    action: string;
    linkData: linksData;
};
async function createNotif(link: linksData, action: string) {
    const token = await getToken();

    const res1 = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/tests/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    const me = await res1.json();
    console.log(me);

    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifs/create-notification`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                public: true,
                targetRoles: [link.owner, "Administrator"],
                title: `${me.first_name} ${me.last_name} ${action} ${link.link_name.substring(0, 12) + (link.link_name.length >= 12 ? "..." : "")}`,
            }),
        },
    );

    if (!res.ok) {
        throw new Error("failed to create view notification");
    }
    console.log(await res.json());
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
async function removeLink(body: editlinksRequest, reload: (any: any) => void) {
    console.log(body);
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/links`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
            `Failed to update link (status ${res.status}): ${errorText}`,
        );
    }
    reload((prev: any) => !prev);
    return res.json();
}

export function DeleteConfirmationPopupLink(
    props: deleteConfirmationPopupProps,
) {
    // const [sessionToken, setSessionToken] = useState("")

    // useEffect(() => {
    //     getToken().then(t => setSessionToken(t ?? ""))
    // }, [])

    const bodyData = {
        action: "delete",
        linkData: props.link,
    };

    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="destructive" size="icon">
                    <HugeiconsIcon icon={Delete02Icon} size={20} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose>
                        <Button
                            type="submit"
                            onClick={() => {
                                removeLink(bodyData, props.reload);
                                createNotif(props.link, "deleted");
                            }}
                        >
                            Confirm
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteConfirmationPopupLink;
