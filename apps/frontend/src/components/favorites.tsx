import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import { Link } from "react-router-dom";

import { SearchBar } from "@/components/SearchBar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";

import ContentForm from "@/components/contentForm.tsx";
import DeleteConfirmationPopup from "@/components/deletePopupConfirmation.tsx";

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

let Documents: Document[] = [];

let Doc1: Document = {
    id: 1,
    url: "www.testurl.com",
    name: "underwritingrole",
    lastModified: "01/02/2025",
    expirationDate: "01/02/2027",
    mime_type: "reference",
    role: "underwriter",
    contentOwner: "leah",
    status: "not_started",
};

let Doc2: Document = {
    id: 2,
    url: "www.testurl2.com",
    name: "businessanalystrole1",
    lastModified: "03/02/2025",
    expirationDate: "03/02/2027",
    mime_type: "reference",
    role: "businessanalyst",
    contentOwner: "john",
    status: "not_started",
};

Documents.push(Doc1);
Documents.push(Doc2);

export default function Favorites() {
    const [favorited, setFavorited] = useState(false);

    return (
        <div className="max-w-6xl mx-auto px-6 py-6">

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                        icon={favorited ? solidStar : regularStar}
                        onClick={() => setFavorited(!favorited)}
                        className="text-yellow-400 cursor-pointer"
                    />
                    <h4 className="text-lg font-semibold text-gray-800">
                        Favorited
                    </h4>
                </div>

                <Link className="text-sm text-blue-900 hover:underline"
                    to="/documents"

                >
                    View All
                </Link>
            </div>


            <div className="bg-white rounded-xl shadow-sm border p-4">

                <div className="flex items-center justify-between mb-4">
                    <div className="w-1/3">
                        <SearchBar />
                    </div>

                    <ContentForm
                        type="Create"
                        currentID={Math.trunc((Math.random() * 10000) % 10000)}
                        currentName="Name..."
                        currentURL="www.example.com"
                        currentContentOwner="Select Content Owner"
                        currentRole="Select Role"
                        currentExpirationDate="Tomorrow"
                        currentExpirationTime="10:30:00"
                        currentStatus="Select Status"
                        size={true}
                    />
                </div>


                <Table className="border rounded-lg overflow-hidden">
                    <TableHeader className="bg-[#0b3c5d]">
                        <TableRow>
                            <TableHead className="text-white text-center font-medium text-sm">Favorite</TableHead>
                            <TableHead className="text-white font-medium text-sm">Title</TableHead>
                            <TableHead className="text-white font-medium text-sm">Content Type</TableHead>
                            <TableHead className="text-white font-medium text-sm">Expiration Date</TableHead>
                            <TableHead className="text-white font-medium text-sm">Status</TableHead>
                            <TableHead className="text-white font-medium text-sm">Owner</TableHead>
                            <TableHead className="text-white font-medium text-sm">Last Modified</TableHead>
                            <TableHead className="text-white text-center font-medium text-sm">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {Documents.map((d) => (
                            <TableRow
                                key={d.id}
                                className="hover:bg-gray-50 transition h-12"
                            >
                                <TableCell className={"text-center"}>
                                    <FontAwesomeIcon
                                        icon={favorited ? solidStar : regularStar}
                                        onClick={() => setFavorited(!favorited)}
                                        className="text-yellow-400 cursor-pointer"
                                    />
                                </TableCell>

                                <TableCell className="text-[14px] font-medium text-gray-700">
                                    {d.name}
                                </TableCell>

                                <TableCell className="text-[14px] font-medium text-gray-700">
                                    {d.mime_type}
                                </TableCell>

                                <TableCell className="text-[14px] font-medium text-gray-700">
                                    {d.expirationDate}
                                </TableCell>

                                <TableCell className="text-[14px] font-medium text-gray-700">
                                    {d.status}
                                </TableCell>

                                <TableCell className="text-[14px] font-medium text-gray-700">
                                    {d.contentOwner}
                                </TableCell>

                                <TableCell className="text-[14px] font-medium text-gray-700">
                                    {d.lastModified}
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center justify-center gap-2">

                                        <div className="w-16" >
                                            <ContentForm
                                                type="Edit"
                                                currentID={d.id}
                                                currentName={d.name}
                                                currentURL={d.url}
                                                currentContentOwner={d.contentOwner}
                                                currentRole={d.role}
                                                currentExpirationDate="Tomorrow"
                                                currentExpirationTime="10:30:00"
                                                currentStatus={d.status}
                                                size={false}
                                            />
                                        </div>

                                        <div className="w=16 flex justify-center">
                                            <DeleteConfirmationPopup target={d.id} />
                                        </div>

                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}