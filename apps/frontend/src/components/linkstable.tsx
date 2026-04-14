import '../App.css'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import {useEffect, useState} from "react";
import Editlinksform from "@/components/editlinksform.tsx";
import DeletePopupConfirmationLinks from "@/components/deletePopupConfirmationLinks.tsx";
import type { Links,
              linksProps
} from './types/linkstable.d.ts';
import {useAuth} from "@clerk/react";

async function getLinks() {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/links`);

    if (!res.ok) {
        throw new Error("Failed to fetch links");
    }
    const data = await res.json();
    return data;
}

async function getRoleLinks(linkOwner: string) {

    const reqData ={
        owner: linkOwner
    }
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get-link-role`, { method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqData)
    });

    if (!res.ok) {
        throw new Error("Failed to fetch links");
    }
    const data = await res.json();

    return data;
}

function LinksTable(){
    const [roles, setRoles] = useState<string[]>([]);
    const { getToken, isSignedIn } = useAuth();
    const [links, setLinks] = useState<Links[]>([]);
    const [me, setMe] = useState(null);

    useEffect(() => {
        if (!isSignedIn) {
            setMe(null);
            return;
        }

        async function load() {
            const token = await getToken();

            const res = await fetch("http://localhost:3000/api/tests/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            setMe(data);
            setRoles((data.roles as string[]).map((role: string) => role.toLowerCase()))
        }

        load();
    }, [isSignedIn]);

    useEffect(() => {
        if (roles.length === 0) return; // wait until roles are loaded

        if (roles.includes("administrator")) {
            getLinks()
                .then(setLinks)
                .catch(console.error);
        } else {
            getRoleLinks(me.roles.at(0))
                .then(setLinks)
                .catch(console.error);
        }
    }, [roles]);

    return (
        <>
            <div className="shadow-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead></TableHead>
                            <TableHead className="flex text-center items-center pl-[35px]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {links.map((l) => (
                            <TableRow key={l.link_name}>
                                <TableCell>{l.link_name}</TableCell>
                                <TableCell>{l.url}</TableCell>
                                <TableCell>{l.owner}</TableCell>
                                <TableCell></TableCell>

                                <TableCell className="flex items-center gap-3">
                                    <Editlinksform
                                        id={l.id}
                                        name ={l.link_name}
                                        url ={l.url}
                                        owner={roles.at(0)}
                                    />
                                    <Button variant = "destructive" size = "icon">
                                       <DeletePopupConfirmationLinks link={l} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

export default LinksTable;