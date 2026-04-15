import {TableCell, TableRow} from "@/components/ui/table.tsx";
import FavoriteStar from "@/components/favoriteStar.tsx";
import {Dialog, DialogClose, DialogContent, DialogTrigger} from "@/components/ui/dialog.tsx";
import DocumentViewer from "@/components/docViewer.tsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {Download01Icon} from "@hugeicons/core-free-icons";
import * as React from "react";

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
};

type FavoriteProps = {
    d: Document;
    onToggle: (doc: Document) => void;
};

export default function FavoritesTableEntry(props: FavoriteProps)  {
    const exp = new Date(props.d.expiration_date);
    const mod = new Date(props.d.last_modified);
    return (
        <TableRow
            key={props.d.id}
            className="hover:bg-gray-50 transition h-12"
        >
            <FavoriteStar
                doc={props.d}
                onToggle={props.onToggle}
            />

            <TableCell className="text-[14px] font-small text-gray-700">
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="max-w-[180px] truncate whitespace-nowrap overflow-hidden hover:underline text-left">
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
                <a
                    href={props.d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                >
                    <HugeiconsIcon icon={Download01Icon} />
                </a>
            </TableCell>


        </TableRow>
    )
}