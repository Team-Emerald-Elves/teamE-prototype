import {TableCell, TableRow} from "@/components/ui/table.tsx";
import FavoriteStar from "@/components/favoriteStar.tsx";

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
    return (
        <TableRow
            key={props.d.id}
            className="hover:bg-gray-50 transition h-12"
        >
            <FavoriteStar
                doc={props.d}
                onToggle={props.onToggle}
            />

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