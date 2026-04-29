import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { TableCell } from "@/components/ui/table.tsx";
import { useState } from "react";

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
};

type FavoriteStarProps = {
    doc: Document | Links;
    onToggleOn: (doc: Document | Links) => void;
    onToggleOff: (doc: Document | Links) => void;
    className?: string;
};

export default function FavoriteStar({
    doc,
    onToggleOff,
    onToggleOn,
    className,
}: FavoriteStarProps) {
    const [favorite, setFavorite] = useState(doc.favorite);

    return (
        <TableCell className="text-center">
            <FontAwesomeIcon
                icon={favorite ? solidStar : regularStar}
                onClick={() => {
                    if (!favorite) {
                        onToggleOff(doc);
                    } else {
                        onToggleOn(doc);
                    }

                    setFavorite(!favorite);
                }}
                className={
                    "text-yellow-400 cursor-pointer " +
                    (className ? className : "")
                }
            />
        </TableCell>
    );
}
