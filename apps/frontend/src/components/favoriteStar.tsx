import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar as solidStar} from "@fortawesome/free-solid-svg-icons";
import {faStar as regularStar} from "@fortawesome/free-regular-svg-icons";
import {TableCell} from "@/components/ui/table.tsx";
import { useState } from "react";
import type {documentContent as Document} from "@/../../packages/database/lib/prismadefs.ts"

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
    className?: string
};

export default function FavoriteStar({ doc, onToggleOff, onToggleOn, className }: FavoriteStarProps) {
    const [favorite, setFavorite] = useState(doc.favorite);

    return (
        <TableCell className="text-center">
            <FontAwesomeIcon
                icon={favorite ? solidStar : regularStar}
                onClick={() => {
                    if (!favorite) {
                        onToggleOff(doc)
                    }
                    else {
                        onToggleOn(doc)
                    }

                    setFavorite(!favorite)
                }}
                className={"text-yellow-400 cursor-pointer " + (className ? className : "")}
            />
        </TableCell>
    );
}