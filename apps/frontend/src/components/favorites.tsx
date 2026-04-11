import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faStar as solidStar} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import {Link} from "react-router-dom";
import Card from "@/components/card.tsx";
import { SearchBar } from "@/components/SearchBar";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import Editlinksform from "@/components/editlinksform.tsx";
import {Button} from "@/components/ui/button.tsx";
import DeletePopupConfirmationLinks from "@/components/deletePopupConfirmationLinks.tsx";
import ContentForm from "@/components/contentForm.tsx";
import DeleteConfirmationPopup from "@/components/deletePopupConfirmation.tsx";

type Document= {
    id: number;
    url: string;
    name: string;
    lastModified: string;
    expirationDate: string;
    mime_type: string;
    role: string;
    contentOwner: string;
    status: string;
}

let Documents: Document[] = [];
let Doc1: Document={
    id: 1,
    url: "www.testurl.com",
    name: "underwritingrole",
    lastModified: "01/02/2025",
    expirationDate: "01/02/2027",
    mime_type: "reference",
    role: "underwriter",
    contentOwner: "leah",
    status: "not_started",
}

let Doc2: Document={
    id: 2,
    url: "www.testurl2.com",
    name: "businessanalystrole1",
    lastModified: "03/02/2025",
    expirationDate: "03/02/2027",
    mime_type: "reference",
    role: "businessanalyst",
    contentOwner: "john",
    status: "not_started",
}

Documents.push (Doc1)
Documents.push (Doc2)



export default function Favorites() {
    const [favorited, setFavorited] = useState(false);

    return (
        <>

            <div className="ml-35 mr-35">
                <div className="inline-flex" >
                    <FontAwesomeIcon className="pt-1 pr-1"
                        icon={favorited ? solidStar : regularStar}
                        onClick={() => setFavorited(!favorited) }
                        style={{color: "rgb(255, 212, 59)",}}
                    />

                    <h4> Favorited</h4>

                    <Link to="/documents" className="pl-210">
                        View All
                    </Link>

                </div>

                <div className={"bg-white"}>

                    <div className="inline-flex">
                        <SearchBar />

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


                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Favorite</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Content Type</TableHead>
                                <TableHead>Expiration Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Last Modified</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Documents.map((d) => (
                                <TableRow key={d.id}>
                                    <TableCell><FontAwesomeIcon className="pt-1 pr-1"
                                                                icon={favorited ? solidStar : regularStar}
                                                                onClick={() => setFavorited(!favorited) }
                                                                style={{color: "rgb(255, 212, 59)",}}/>

                                    </TableCell>

                                        <TableCell>{d.name}</TableCell>
                                    <TableCell>{d.mime_type}</TableCell>
                                    <TableCell>{d.expirationDate}</TableCell>
                                    <TableCell>{d.status}</TableCell>
                                    <TableCell>{d.contentOwner}</TableCell>
                                    <TableCell>{d.lastModified}</TableCell>
                                    <TableCell><ContentForm
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
                                        <DeleteConfirmationPopup
                                            target={d.id}
                                        />



                                    </TableCell>


                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>


            </div>

        </>
    )
}