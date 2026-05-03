import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import FavoritesTableEntry from "@/components/favoritesTableEntry.tsx";
import { getToken } from "@clerk/react";
import FavoritesTableEntryLink from "@/components/favoritesTableEntryLink.tsx";
import type { documentContent, Links as linksData } from "@repo/database/types";

export default function Favorites() {
    const [favoriteDocs, setFavoriteDocs] = useState<documentContent[]>([]);
    const [favoriteLinks, setFavoriteLinks] = useState<linksData[]>([]);
    const [reload, setReload] = useState(false);

    //const currentFavorite: string = "links";
    const [currentFavorite, setCurrentFavorite] = useState<string>("docs");

    useEffect(() => {
        const getFavorites = async () => {
            const token = await getToken();
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/get-favorited`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );
            if (!res.ok) {
                throw new Error("Failed to fetch favorited docs");
            }
            const docData = await res.json();
            setFavoriteDocs(docData);

            const res2 = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/get-favorited-links`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );
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
        <>
            <div className="max-w-10xl mx-auto relative">
                <div className="flex items-center justify-between mb-1 pt-0">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                            icon={solidStar}
                            className="text-yellow-400 cursor-pointer"
                        />
                        <h4 className="text-lg font-semibold text-(--subheader-color)">
                            Favorited
                        </h4>
                    </div>

                    <Link
                        className="text-sm text-(--internal-link-color) hover:underline"
                        //to="/documents"
                        to={
                            currentFavorite === "docs" ? "/documents" : "/links"
                        }
                    >
                        View All
                    </Link>
                </div>
            </div>

            <Tabs value={currentFavorite} onValueChange={setCurrentFavorite}>
                <TabsList>
                    <TabsTrigger value="docs">Documents</TabsTrigger>
                    <TabsTrigger value="links">Links</TabsTrigger>
                </TabsList>
                <TabsContent value="docs">
                    <div className="bg-(--card) rounded-xl border-0 p-1 relative">
                        <Table className="border rounded-lg overflow-hidden">
                            <TableHeader className="bg-(--card-header) text-(--table-titles))">
                                <TableRow>
                                    <TableHead className="text-(--table-titles) text-center font-medium text-sm rounded-bl-lg ">
                                        Favorite
                                    </TableHead>
                                    <TableHead className="text-(--table-titles) font-medium text-sm">
                                        Title
                                    </TableHead>
                                   
                                  
                                    <TableHead className="text-(--table-titles) font-medium text-sm">
                                        Expiration Date
                                    </TableHead>
                                    <TableHead className="text-(--table-titles) font-medium text-sm">
                                        Owner
                                    </TableHead>
                                    <TableHead className="text-(--table-titles) font-medium text-sm">
                                        Last Modified
                                    </TableHead>
                                    <TableHead className="text-(--table-titles) font-medium text-sm">
                                        Tags
                                    </TableHead>
                                    <TableHead className="text-(--table-titles) text-center font-medium text-sm rounded-br-lg">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {favoriteDocs.map((d) => (
                                    <FavoritesTableEntry
                                        key={d.id}
                                        d={d}
                                        onToggleOff={async (
                                            doc: documentContent | linksData,
                                        ) => {
                                            const token = await getToken();
                                            //need to send true for favorite and send the doc id and the employee id
                                            const newValue = !(
                                                doc as documentContent
                                            ).favorite;

                                            await fetch(
                                                `${import.meta.env.VITE_BACKEND_URL}/update-favorite`,
                                                {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type":
                                                            "application/json",
                                                        Authorization: `Bearer ${token}`,
                                                    },
                                                    body: JSON.stringify({
                                                        id: doc.id,
                                                        favorite: true,
                                                    }),
                                                },
                                            );

                                            setFavoriteDocs((prev) =>
                                                prev.map((f) =>
                                                    f.id === doc.id
                                                        ? {
                                                              ...f,
                                                              favorite:
                                                                  newValue,
                                                          }
                                                        : f,
                                                ),
                                            );
                                            setReload((prev) => !prev);
                                        }}
                                        onToggleOn={async (
                                            doc: documentContent | linksData,
                                        ) => {
                                            //need to send true for favorite and send the doc id and the employee id
                                            const token = await getToken();
                                            const newValue = !(
                                                doc as documentContent
                                            ).favorite;

                                            await fetch(
                                                `${import.meta.env.VITE_BACKEND_URL}/update-favorite`,
                                                {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type":
                                                            "application/json",
                                                        Authorization: `Bearer ${token}`,
                                                    },
                                                    body: JSON.stringify({
                                                        id: doc.id,
                                                        favorite: false,
                                                    }),
                                                },
                                            );
                                            setFavoriteDocs((prev) =>
                                                prev.map((f) =>
                                                    f.id === doc.id
                                                        ? {
                                                              ...f,
                                                              favorite:
                                                                  newValue,
                                                          }
                                                        : f,
                                                ),
                                            );
                                            setReload((prev) => !prev);
                                        }}
                                    />
                                ))}
                                {favoriteDocs.length > 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center text-xs text-(--ring) py-5"
                                        >
                                            You've reached the end
                                            <span className = "px-1">·</span>
                                            {favoriteDocs.length} document{favoriteDocs.length !== 1 ? "s" : ""}

                                        </TableCell>
                                    </TableRow>
                                )}


                            </TableBody>
                        </Table>

                        <div className="absolute bottom-3 left-3">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                    >
                                        <Info className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    side="top"
                                    align="start"
                                    className="w-64"
                                >
                                    <p className="font-medium text-sm mb-2">
                                        Favorited
                                    </p>
                                    <p className="text-xs text-muted-foreground mb-3">
                                        Your pinned documents and links for
                                        quick access.
                                    </p>

                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">
                                                Favorited documents
                                            </span>
                                            <span className="font-medium">
                                                {favoriteDocs.length}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">
                                                Favorited links
                                            </span>
                                            <span className="font-medium">
                                                {favoriteLinks.length}
                                            </span>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="links">
                    <div className="bg-card rounded-xl shadow-none border-0 p-1 relative">
                        <Table className="border rounded-lg overflow-hidden ">
                            <TableHeader className="bg-(--card-header) text-(--table-titles)">
                                <TableRow>
                                    <TableHead className="text-(--table-titles) text-center font-medium text-sm rounded-bl-lg">
                                        Favorite
                                    </TableHead>
                                    <TableHead className="text-(--table-titles) font-medium text-sm">
                                        Title
                                    </TableHead>
                                    <TableHead className="text-(--table-titles) font-medium text-sm">
                                        URL
                                    </TableHead>
                                    <TableHead className="text-(--table-titles) font-medium text-sm">
                                        Role
                                    </TableHead>
                                    <TableHead className="text-(--table-titles) font-medium text-sm rounded-br-lg">
                                        Last Modified
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {favoriteLinks.map((l) => (
                                    <FavoritesTableEntryLink
                                        key={l.id}
                                        l={l}
                                        onToggleOff={async (
                                            link:
                                                | documentContent
                                                | (linksData & {
                                                      favorite?: boolean;
                                                  }),
                                        ) => {
                                            const token = await getToken();
                                            //need to send true for favorite and send the doc id and the employee id
                                            const newValue = !link.favorite;

                                            await fetch(
                                                `${import.meta.env.VITE_BACKEND_URL}/update-favorite-link`,
                                                {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type":
                                                            "application/json",
                                                        Authorization: `Bearer ${token}`,
                                                    },
                                                    body: JSON.stringify({
                                                        id: link.id,
                                                        favorite: true,
                                                    }),
                                                },
                                            );

                                            setFavoriteLinks((prev) =>
                                                prev.map((f) =>
                                                    f.id === link.id
                                                        ? {
                                                              ...f,
                                                              favorite:
                                                                  newValue,
                                                          }
                                                        : f,
                                                ),
                                            );
                                            setReload((prev) => !prev);
                                        }}
                                        onToggleOn={async (
                                            link:
                                                | (linksData & {
                                                      favorite?: boolean;
                                                  })
                                                | documentContent,
                                        ) => {
                                            //need to send true for favorite and send the doc id and the employee id
                                            const token = await getToken();
                                            const newValue = !link.favorite;

                                            await fetch(
                                                `${import.meta.env.VITE_BACKEND_URL}/update-favorite-link`,
                                                {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type":
                                                            "application/json",
                                                        Authorization: `Bearer ${token}`,
                                                    },
                                                    body: JSON.stringify({
                                                        id: link.id,
                                                        favorite: false,
                                                    }),
                                                },
                                            );

                                            setFavoriteLinks((prev) =>
                                                prev.map((f) =>
                                                    f.id === link.id
                                                        ? {
                                                              ...f,
                                                              favorite:
                                                                  newValue,
                                                          }
                                                        : f,
                                                ),
                                            );
                                            setReload((prev) => !prev);
                                        }}
                                    />
                                ))}
                                {favoriteLinks.length > 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center text-xs text-(--ring) py-5"
                                        >
                                            You've reached the end
                                            <span className = "px-1">·</span>
                                            {favoriteLinks.length} link{favoriteLinks.length !== 1 ? "s" : ""}

                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <div className="absolute bottom-3 left-3">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                    >
                                        <Info className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    side="top"
                                    align="start"
                                    className="w-64"
                                >
                                    <p className="font-medium text-sm mb-2">
                                        Favorited
                                    </p>
                                    <p className="text-xs text-muted-foreground mb-3">
                                        Your pinned documents and links for
                                        quick access.
                                    </p>

                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">
                                                Favorited documents
                                            </span>
                                            <span className="font-medium">
                                                {favoriteDocs.length}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">
                                                Favorited links
                                            </span>
                                            <span className="font-medium">
                                                {favoriteLinks.length}
                                            </span>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
}
