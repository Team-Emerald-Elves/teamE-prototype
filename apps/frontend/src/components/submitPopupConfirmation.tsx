import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import qmgr from "@/lib/querymgr";
import { getToken } from "@clerk/react";
import type { documentContent } from "@repo/database/types";
import mime from "mime";

type SubmitConfirmationPopupProps = {
    type: string;
    formData: {
        id: number;
        name: string;
        url: string;
        contentOwner: string;
        role: string;
        document_type: string;
        expirationDate?: Date;
        expirationTime: string;
        document_status: string;
        filePayload?: string;
        fileName?: string;
    }[];
    refresh?: (any: any) => void;
    open: (arg: boolean) => void;
    confirmOpen: boolean;
    setConfirmOpen: (val: boolean) => void;
    disabled: boolean;
};

export type IFile = {
    id?: number;
    name: string;
    url?: string;
    content_owner: string;
    expiration_date?: string;
    mime_type?: string;
    assigned_role: string;
    document_type: string;
    document_status: string;
    filePayload?: string;
    fileName?: string;
};

async function createNotif(doc: documentContent, action: string) {
    const token = await getToken();

    qmgr.wait(() => {
        qmgr.getMe(async (res1) => {
            if (!res1.success) {
                throw new Error("Unable to get me");
            }
            const me = res1.data!;
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
                        targetRoles: [doc.assigned_role, "Administrator"],
                        title: `${me.first_name} ${me.last_name} ${action} ${doc.name.substring(0, 12) + (doc.name.length >= 12 ? "..." : "")}`,
                    }),
                },
            );

            if (!res.ok) {
                throw new Error("failed to create view notification");
            }
            console.log(await res.json());
        });
    });
}

function buildExpirationDate(
    expirationDate?: Date,
    expirationTime?: string,
): string | undefined {
    if (!expirationDate) return undefined;

    const date = new Date(expirationDate);

    if (expirationTime) {
        const [hours = "0", minutes = "0", seconds = "0"] =
            expirationTime.split(":");
        date.setHours(Number(hours), Number(minutes), Number(seconds), 0);
    }

    return date.toISOString();
}

async function createDocument(
    fileData: SubmitConfirmationPopupProps,
    token: string,
    refresh?: (any: any) => void,
) {
    fileData.formData.forEach(async (fd) => {
        const data: IFile = {
            id: undefined,
            name: fd.name,
            url: fd.url || "Local upload",
            content_owner: fd.contentOwner,
            expiration_date: buildExpirationDate(
                fd.expirationDate,
                fd.expirationTime,
            ),
            document_type: fd.document_type,
            document_status: fd.document_status,
            assigned_role: fd.role,
            filePayload: fd.filePayload,
            fileName: fd.fileName,
            mime_type: mime.getType(fd.name!)!
        };
        console.log(data.assigned_role);

        const endpoint =
            fileData.type === "Create"
                ? "/api/supabase/create-document"
                : "/api/supabase/update-document";

        const method = fileData.type === "Create" ? "POST" : "PUT";
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
            {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            },
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(errorText);
            throw new Error(errorText || "Network response was not ok");
        }

        const newDoc = await response.json();
        console.log(newDoc);

        if (fileData.type === "Create") {
            createNotif(newDoc, "created");
        } else {
            createNotif(newDoc, "updated");
        }

        if (refresh) {
            refresh!((prev: any) => !prev);
        }
    });
}

export function SubmitConfirmationPopup(info: SubmitConfirmationPopupProps) {
    // const [sessionToken, setSessionToken] = useState("")
    //
    // useEffect(() => {
    //     getToken().then(t => setSessionToken(t ?? ""))
    // }, [])

    return (
        <Dialog open={info.confirmOpen} onOpenChange={info.setConfirmOpen}>
            <DialogContent className="sm:max-w-sm bg-(--filter-background)">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Are you sure?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => info.setConfirmOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="text-white"
                        onClick={async () => {
                            try {
                                const token = (await getToken()) ?? "";
                                await createDocument(info, token, info.refresh);
                                console.log("submitted successfully!");
                                info.setConfirmOpen(false);
                                info.open(false);
                                console.log("closed ready for refresh");
                            } catch (error) {
                                console.error("broke at", error);
                            }
                        }}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default SubmitConfirmationPopup;
