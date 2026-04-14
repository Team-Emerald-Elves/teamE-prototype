import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar as solidStar} from "@fortawesome/free-solid-svg-icons";
import {faStar as regularStar} from "@fortawesome/free-regular-svg-icons";
import {TableCell} from "@/components/ui/table.tsx";
import {useState} from "react";

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

type FavoriteStarProps = {
    doc: Document;
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

export default function FavoriteStar(props: FavoriteStarProps) {
    const [favorited, setFavorited] = useState(props.doc.favorite)
    return (<TableCell className="text-center">
        <FontAwesomeIcon
            icon={favorited ? solidStar : regularStar}
            onClick={async () => { updateFavorite({doc: props.doc, setFavorited: setFavorited})}}
            className="text-yellow-400 cursor-pointer"
        />
    </TableCell>)
}