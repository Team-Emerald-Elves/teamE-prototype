import { TableCell, TableRow } from "@/components/ui/table.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import ContentForm from "@/components/contentForm.tsx";
import DeleteConfirmationPopup from "./deletePopupConfirmation";

type Document = {
    id: number;
    url: string;
    name: string;
    lastModified: string;
    expirationDate: string;
    mime_type: string;
    role: string;
    contentOwner: string;
    status: string;
};

type favoriteProps = {
    d: Document;
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
                {props.d.expirationDate}
            </TableCell>

            <TableCell className="text-gray-700">{props.d.status}</TableCell>

            <TableCell className="text-gray-700">
                {props.d.contentOwner}
            </TableCell>

            <TableCell className="text-gray-700">
                {props.d.lastModified}
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <ContentForm
                        type="Edit"
                        currentID={props.d.id}
                        currentName={props.d.name}
                        currentURL={props.d.url}
                        currentContentOwner={props.d.contentOwner}
                        currentRole={props.d.role}
                        currentExpirationDate="Tomorrow"
                        currentExpirationTime="10:30:00"
                        currentStatus={props.d.status}
                        size={false}
                    />

                    <DeleteConfirmationPopup target={props.d.id.toString()} />
                </div>
            </TableCell>
        </TableRow>
    );
}
