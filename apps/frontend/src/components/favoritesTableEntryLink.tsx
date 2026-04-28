import {TableCell, TableRow} from "@/components/ui/table.tsx";
import FavoriteStar from "@/components/favoriteStar.tsx";
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
    lock: boolean;
};

type Links = {
    id: string;
    link_name: string;
    url: string;
    owner: string;
    favorite: boolean;
    created_at: string;
    updated_at: string;
};

type FavoriteProps = {
    l: Links;
    onToggleOff: (link: Document | Links) => void;
    onToggleOn: (link: Document | Links) => void;
};

export default function FavoritesTableEntryLink(props: FavoriteProps)  {
    const mod = new Date(props.l.updated_at);
    const created = new Date(props.l.created_at);
    return (
        <TableRow
            key={props.l.id}
            className="hover:bg-gray-50 transition h-12"
        >
            <FavoriteStar
                doc={props.l}
                onToggleOff={props.onToggleOff}
                onToggleOn={props.onToggleOn}
            />

            <TableCell className="text-[14px] font-small text-gray-700">
                {props.l.link_name}
            </TableCell>

            <TableCell className="text-[14px] font-small text-gray-700">
                <a
                    href={props.l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                >
                    {props.l.url}
                </a>
            </TableCell>

            <TableCell className="text-[14px] font-small text-gray-700">
                {props.l.owner}
            </TableCell>

            <TableCell className="text-[14px] font-small text-gray-700">
                {created.toLocaleString()}
            </TableCell>

            <TableCell className="text-[14px] font-small text-gray-700">
                {mod.toLocaleString()}
            </TableCell>


        </TableRow>
    )
}