import {TableCell, TableRow} from "@/components/ui/table.tsx";
import FavoriteStar from "@/components/favoriteStar.tsx";
import {Dialog, DialogClose, DialogContent, DialogTrigger} from "@/components/ui/dialog.tsx";
import DocumentViewer from "@/components/docViewer.tsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {Download01Icon} from "@hugeicons/core-free-icons";
import * as React from "react";
import {Button} from "@/components/ui/button.tsx";

type Document = {
    id: number;
    url: string;
    name: string;
    last_modified: string;
    expiration_date: string;
    mime_type: string;
    document_type: string;
    assigned_role: string;
    content_owner: string;
    document_status: string;
    favorite: boolean;
    lock: boolean;
    created_at: string;
};

const handleDownload = async (doc: Document) => {
    try {
        addHitCount(doc);
        const response = await fetch(doc.url);

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
    d: Document;
    onToggleOff: (doc: Document) => void;
    onToggleOn: (doc: Document) => void;
};

async function addHitCount (doc: Document) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/supabase/add-hit-count`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            id: doc.id,
            type: "DOCUMENT"
        })
    })
    if (!res.ok) {
        throw new Error("failed to add doc hit count")
    }
}


export default function FavoritesTableEntry(props: FavoriteProps)  {
    const exp = new Date(props.d.expiration_date);
    const mod = new Date(props.d.last_modified);
    const created = new Date(props.d.created_at);
    return (
        <TableRow
            key={props.d.id}
            className="hover:bg-gray-50 transition h-12"
        >
            <FavoriteStar
                doc={props.d}
                onToggleOff={props.onToggleOff}
                onToggleOn={props.onToggleOn}
            />

            <TableCell className="text-[14px] font-small text-gray-700">
                <Dialog>
                    <DialogTrigger asChild>
                        <button onClick={async () => {addHitCount(props.d) }} className="max-w-[180px] truncate whitespace-nowrap overflow-hidden hover:underline text-left">
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

            <TableCell className="text-[14px] font-small text-gray-700">
                {created.toLocaleString()}
            </TableCell>

            <TableCell className="text-[14px] font-small text-gray-700">
                {props.d.document_type}
            </TableCell>

            <TableCell className="text-[14px] font-small text-gray-700">
                {exp.toLocaleString()}
            </TableCell>

            <TableCell className="text-[14px] font-small text-gray-700">
                {props.d.document_status}
            </TableCell>

            <TableCell className="text-[14px] font-small text-gray-700">
                {props.d.content_owner}
            </TableCell>

            <TableCell className="text-[14px] font-small text-gray-700">
                {props.d.assigned_role}
            </TableCell>

            <TableCell className="text-[14px] font-small text-gray-700">
                {mod.toLocaleString()}
            </TableCell>
            <TableCell className="text-[14px] font-small text-gray-700">
                <Button onClick={async () => await handleDownload(props.d)}>
                    <HugeiconsIcon icon={Download01Icon} />
                </Button>

            </TableCell>


        </TableRow>
    )
}