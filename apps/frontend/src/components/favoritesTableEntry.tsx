import {TableCell, TableRow} from "@/components/ui/table.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import ContentForm from "@/components/contentForm.tsx";
import DeleteConfirmationPopup from "./deletePopupConfirmation";

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

type favoriteProps = {
    d: Document;
}

type updateProps = {
    doc: Document;
    setFavorited: (newFavorite: boolean) => void;
}

async function updateFavorite(props: updateProps) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/update-favorite`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: props.doc.id, favorite: props.doc.favorite})
    })
    if (!res.ok) {
        throw new Error("Failed to update favorite");
    }
    props.setFavorited(!props.doc.favorite);
}

export default function FavoritesTableEntry(props: favoriteProps) {
    const [favorited, setFavorited] = useState(props.d.favorite);
    return (
        <TableRow
            key={props.d.id}
            className="hover:bg-gray-50 transition h-12"
        >
            <TableCell className="text-center">
                <FontAwesomeIcon
                    icon={favorited ? solidStar : regularStar}
                    onClick={async () => { updateFavorite({doc: props.d, setFavorited: setFavorited})}}
                    className="text-yellow-400 cursor-pointer"
                />
            </TableCell>

            <TableCell className="text-[14px] font-medium text-gray-700">
                {props.d.name}
            </TableCell>

            <TableCell className="text-[14px] font-medium text-gray-700">
                {props.d.document_type}
            </TableCell>

            <TableCell className="text-[14px] font-medium text-gray-700">
                {props.d.expiration_date}
            </TableCell>

            <TableCell className="text-[14px] font-medium text-gray-700">
                {props.d.document_status}
            </TableCell>

            <TableCell className="text-[14px] font-medium text-gray-700">
                {props.d.content_owner}
            </TableCell>

            <TableCell className="text-[14px] font-medium text-gray-700">
                {props.d.assigned_role}
            </TableCell>

            <TableCell className="text-[14px] font-medium text-gray-700">
                {props.d.last_modified}
            </TableCell>


        </TableRow>
    )
}