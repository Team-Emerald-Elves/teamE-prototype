import { TableCell, TableRow } from "@/components/ui/table.tsx";
import FavoriteStar from "@/components/favoriteStar.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import DocumentViewer from "@/components/docViewer.tsx";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button.tsx";
import { getToken } from "@clerk/react";
import qmgr from "@/lib/querymgr";
import type { documentContent, Links as linksData } from "@repo/database/types";

const handleDownload = async (doc: documentContent) => {
    try {
        addHitCount(doc);
        createNotif(doc, "downloaded");
        const response = await fetch(doc.url!);

        if (!response.ok) {
            throw new Error("Failed to fetch file");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = doc.name || "download";
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error(err);
    }
};

type FavoriteProps = {
    d: documentContent;
    onToggleOff: (doc: documentContent | linksData) => void;
    onToggleOn: (doc: documentContent | linksData) => void;
};

async function addHitCount(doc: documentContent) {
    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/supabase/add-hit-count`,
        {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                id: doc.id,
                type: "DOCUMENT",
            }),
        },
    );
    if (!res.ok) {
        throw new Error("failed to add doc hit count");
    }
}

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

export default function FavoritesTableEntry(props: FavoriteProps) {
    const exp = new Date(props.d.expiration_date);
    const mod = new Date(props.d.last_modified);
    const created = new Date(props.d.created_at);
    return (
        <TableRow key={props.d.id} className="hover:bg-(--table-hover) transition h-12">
            <FavoriteStar
                doc={props.d}
                onToggleOff={props.onToggleOff}
                onToggleOn={props.onToggleOn}
            />

            <TableCell className="text-[14px] font-small text-(--table-text)">
                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            onClick={async () => {
                                createNotif(props.d, "accessed");
                                addHitCount(props.d);
                            }}
                            className="max-w-[180px] truncate whitespace-nowrap overflow-hidden hover:underline text-left"
                        >
                            {props.d.name}
                        </button>
                    </DialogTrigger>

                    <DialogContent className="2xl:max-w-2xl h-[90vh] flex flex-col overflow-hidden">
                        <DialogClose className="absolute right-4 top-4 text-xl z-10">
                            ✕
                        </DialogClose>

                        <div className="flex-1 overflow-auto flex justify-center">
                            <div className="w-full max-w-[1400px] h-full">
                                <DocumentViewer doc={props.d} />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </TableCell>

            <TableCell className="text-[14px] font-small text-(--table-text)">
                {created.toLocaleString()}
            </TableCell>

            <TableCell className="text-[14px] font-small text-(--table-text)">
                {props.d.document_type}
            </TableCell>

            <TableCell className="text-[14px] font-small text-(--table-text)">
                {exp.toLocaleString()}
            </TableCell>

            <TableCell className="text-[14px] font-small text-(--table-text)">
                {props.d.document_status}
            </TableCell>

            <TableCell className="text-[14px] font-small text-(--table-text)">
                {props.d.content_owner}
            </TableCell>

            <TableCell className="text-[14px] font-small text-(--table-text)">
                {props.d.assigned_role}
            </TableCell>

            <TableCell className="text-[14px] font-small text-(--table-text)">
                {mod.toLocaleString()}
            </TableCell>
            <TableCell className="text-[14px] font-small text-(--table-text)">
                <Button onClick={async () => await handleDownload(props.d)}>
                    <HugeiconsIcon icon={Download01Icon} />
                </Button>
            </TableCell>
        </TableRow>
    );
}
