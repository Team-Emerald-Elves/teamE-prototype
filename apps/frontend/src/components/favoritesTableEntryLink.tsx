import {TableCell, TableRow} from "@/components/ui/table.tsx";
import FavoriteStar from "@/components/favoriteStar.tsx";
import * as React from "react";
import {getToken} from "@clerk/react";

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

async function addHitCount (link: Links) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/supabase/add-hit-count`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            id: link.id,
            type: "LINK"
        })
    })
    if (!res.ok) {
        throw new Error("failed to add doc hit count")
    }
}


async function createNotif(link: Links, action: string) {
    const token = await getToken();

    const res1 = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const me = await res1.json();
    console.log(me);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifs/create-notification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            public: true,
            targetRoles: [link.owner, "Administrator"],
            title: `${me.first_name} ${me.last_name} ${action} ${link.link_name.substring(0, 12) + (link.link_name.length >= 12 ? '...' : '')}`,
        })
    })

    if (!res.ok) {
        throw new Error("failed to create view notification")
    }
    console.log(await res.json());
}

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
                    onClick={async () => { createNotif(props.l, "opened");  addHitCount(props.l) }}
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