import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import { Link } from "react-router-dom";


import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";



import FavoritesTableEntry from "@/components/favoritesTableEntry.tsx";
import {getToken} from "@clerk/react";
import FavoritesTableEntryLink from "@/components/favoritesTableEntryLink.tsx";

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

export default function Favorites() {
    const [favoriteDocs, setFavoriteDocs] = useState<Document[]>([]);
    const [favoriteLinks, setFavoriteLinks] = useState<Links[]>([]);
    const [reload, setReload] = useState(false);

    //const currentFavorite: string = "links";
    const [currentFavorite, setCurrentFavorite] = useState<string>("docs");

    useEffect(() => {
        const getFavorites = async () => {
            const token = await getToken();
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get-favorited`,{headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (!res.ok) {
                throw new Error("Failed to fetch favorited docs");
            }
            const docData = await res.json();
            setFavoriteDocs(docData);

            const res2 = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get-favorited-links`,{headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (!res2.ok) {
                throw new Error("Failed to fetch favorited docs");
            }
            const linkData = await res2.json();
            setFavoriteLinks(linkData);
        };

        getFavorites();
    }, [reload]);

    //if (currentFavorite === "docs") {
        return (
            <div className="max-w-10xl mx-auto px-6 py-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                            icon={solidStar}
                            className="text-yellow-400 cursor-pointer"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">
                            Favorited
                        </h4>
                    </div>

                    <Link className="text-sm internal-link-color hover:underline"
                          //to="/documents"
                          to={currentFavorite === "docs" ? "/documents" : "/links"}
                    >
                        View All
                    </Link>
                </div>

                <Tabs value={currentFavorite} onValueChange={setCurrentFavorite}>
                    <TabsList>
                        <TabsTrigger value="docs">Documents</TabsTrigger>
                        <TabsTrigger value="links">Links</TabsTrigger>
                    </TabsList>

                    <TabsContent value="docs">
                        <div className="bg-white rounded-xl shadow-sm border p-4">
                            <Table className="border rounded-lg overflow-hidden">
                                <TableHeader className="bg-[#ecf4f9] text-[#0b4461]">
                                    <TableRow>
                                        <TableHead
                                            className="text-[#0b4461] text-center font-medium text-sm">Favorite</TableHead>
                                        <TableHead className="text-[#0b4461] font-medium text-sm">Title</TableHead>
                                        <TableHead className="text-[#0b4461] font-medium text-sm">Created</TableHead>
                                        <TableHead className="text-[#0b4461] font-medium text-sm">Content Type</TableHead>
                                        <TableHead className="text-[#0b4461] font-medium text-sm">Expiration Date</TableHead>
                                        <TableHead className="text-[#0b4461] font-medium text-sm">Status</TableHead>
                                        <TableHead className="text-[#0b4461] font-medium text-sm">Owner</TableHead>
                                        <TableHead className="text-[#0b4461] font-medium text-sm">Role</TableHead>
                                        <TableHead className="text-[#0b4461] font-medium text-sm">Last Modified</TableHead>
                                        <TableHead className="text-[#0b4461] font-medium text-sm">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {favoriteDocs.map((d) => (
                                        <FavoritesTableEntry key={d.id}
                                             d={d}
                                             onToggleOff={async (doc: Document) => {
                                                 const token = await getToken()
                                                 //need to send true for favorite and send the doc id and the employee id
                                                 const newValue = !doc.favorite;

                                                 await fetch(`${import.meta.env.VITE_BACKEND_URL}/update-favorite`, {
                                                     method: "POST",
                                                     headers: {
                                                         "Content-Type": "application/json",
                                                         "Authorization": `Bearer ${token}`

                                                     },
                                                     body: JSON.stringify({
                                                         id: doc.id,
                                                         favorite: true,
                                                     }),
                                                 });

                                                 setFavoriteDocs(prev =>
                                                     prev.map(f =>
                                                         f.id === doc.id ? {...f, favorite: newValue} : f
                                                     )
                                                 );
                                                 setReload(prev => !prev);
                                             }}
                                             onToggleOn={async (doc: Document) => {
                                                 //need to send true for favorite and send the doc id and the employee id
                                                 const token = await getToken();
                                                 const newValue = !doc.favorite;

                                                 await fetch(`${import.meta.env.VITE_BACKEND_URL}/update-favorite`, {
                                                     method: "POST",
                                                     headers: {
                                                         "Content-Type": "application/json",
                                                         "Authorization": `Bearer ${token}`

                                                     },
                                                     body: JSON.stringify({
                                                         id: doc.id,
                                                         favorite: false,
                                                     }),
                                                 });
                                                 setFavoriteDocs(prev =>
                                                     prev.map(f =>
                                                         f.id === doc.id ? {...f, favorite: newValue} : f
                                                     )
                                                 );
                                                 setReload(prev => !prev);
                                             }}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    <TabsContent value = "links">
                        <div className="bg-white rounded-xl shadow-sm border p-4">

                                    <Table className="border rounded-lg overflow-hidden">
                                        <TableHeader className="bg-[#ecf4f9] text-[#0b4461]">
                                            <TableRow>
                                                <TableHead className="text-[#0b4461] text-center font-medium text-sm">Favorite</TableHead>
                                                <TableHead className="text-[#0b4461] font-medium text-sm">Title</TableHead>
                                                <TableHead className="text-[#0b4461] font-medium text-sm">URL</TableHead>
                                                <TableHead className="text-[#0b4461] font-medium text-sm">Role</TableHead>
                                                <TableHead className="text-[#0b4461] font-medium text-sm">Created</TableHead>
                                                <TableHead className="text-[#0b4461] font-medium text-sm">Last Modified</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {favoriteLinks.map((l) => (

                                                <FavoritesTableEntryLink key={l.id}
                                                     l={l}
                                                     onToggleOff={async (link: Links) => {
                                                         const token = await getToken()
                                                         //need to send true for favorite and send the doc id and the employee id
                                                         const newValue = !link.favorite;

                                                         await fetch(`${import.meta.env.VITE_BACKEND_URL}/update-favorite-link`, {
                                                             method: "POST",
                                                             headers: {
                                                                 "Content-Type": "application/json",
                                                                 "Authorization": `Bearer ${token}`

                                                             },
                                                             body: JSON.stringify({
                                                                 id: link.id,
                                                                 favorite: true,
                                                             }),
                                                         });

                                                         setFavoriteLinks(prev =>
                                                             prev.map(f =>
                                                                 f.id === link.id ? { ...f, favorite: newValue } : f
                                                             )
                                                         );
                                                         setReload(prev => !prev);
                                                     }}
                                                     onToggleOn={async (link: Links) => {
                                                         //need to send true for favorite and send the doc id and the employee id
                                                         const token = await getToken();
                                                         const newValue = !link.favorite;

                                                         await fetch(`${import.meta.env.VITE_BACKEND_URL}/update-favorite-link`, {
                                                             method: "POST",
                                                             headers: {
                                                                 "Content-Type": "application/json",
                                                                 "Authorization": `Bearer ${token}`

                                                             },
                                                             body: JSON.stringify({
                                                                 id: link.id,
                                                                 favorite: false,
                                                             }),
                                                         });

                                                         setFavoriteLinks(prev =>
                                                             prev.map(f =>
                                                                 f.id === link.id ? { ...f, favorite: newValue } : f
                                                             )
                                                         );
                                                         setReload(prev => !prev);
                                                     }}
                                                />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                    </TabsContent>
                </Tabs>
            </div>
        );
    }