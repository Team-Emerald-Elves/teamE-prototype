import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { TableCell } from "@/components/ui/table.tsx";
import { useState } from "react";
import type { documentContent, Links as linksData } from "@repo/database/types";


type FavoriteStarProps = {
    doc: documentContent | linksData;
    onToggleOn: (doc: documentContent | linksData) => void;
    onToggleOff: (doc: documentContent | linksData) => void;
    className?: string
};

export default function FavoriteStar({ doc, onToggleOff, onToggleOn, className }: FavoriteStarProps) {
    const [favorite, setFavorite] = useState((doc as documentContent).favorite);

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
