import { TableCell, TableRow } from "@/components/ui/table.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import ContentForm from "@/components/contentForm.tsx";
import DeleteConfirmationPopup from "./deletePopupConfirmation";
import type { documentContent } from "@repo/database/types";

type favoriteProps = {
    d: documentContent;
};

export default function DocTableEntry(props: favoriteProps) {
    const [favorited, setFavorited] = useState(false);
    return (
        <TableRow key={props.d.id} className="hover:bg-gray-50 transition">
            <TableCell>
                <FontAwesomeIcon
                    icon={favorited ? solidStar : regularStar}
                    onClick={() => setFavorited(!favorited)}
                    className="text-yellow-400 cursor-pointer"
                />
            </TableCell>

            <TableCell className="py-3 text-gray-700">{props.d.name}</TableCell>

            <TableCell className="text-gray-700">{props.d.mime_type}</TableCell>

            <TableCell className="text-gray-700">
                {props.d.expiration_date.toDateString()}
            </TableCell>

            <TableCell className="text-gray-700">
                {props.d.document_status}
            </TableCell>

            <TableCell className="text-gray-700">
                {props.d.content_owner}
            </TableCell>

            <TableCell className="text-gray-700">
                {props.d.last_modified.toDateString()}
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <ContentForm
                        type="Edit"
                        currentID={props.d.id}
                        roles={[props.d.assigned_role as string]}
                        lock={props.d.lock as string}
                        currentName={props.d.name}
                        currentURL={props.d.url as string}
                        currentContentOwner={props.d.content_owner as string}
                        currentRole={props.d.assigned_role as string}
                        currentExpirationDate={new Date(Date.now() + 8.64e7)}
                        currentExpirationTime="10:30:00"
                        currentStatus={props.d.document_status}
                        size={false}
                    />

                    <DeleteConfirmationPopup target={props.d} />
                </div>
            </TableCell>
        </TableRow>
    );
}
