import '../App.css'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {HugeiconsIcon} from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button"

import {useEffect, useState} from "react";
import Editlinksform from "@/components/editlinksform.tsx";
import DeletePopupConfirmationLinks from "@/components/deletePopupConfirmationLinks.tsx";


type Links= {
    id: string;
    link_name: string,
    url: string,
    owner: string
}
async function getLinks() {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/links`);

    if (!res.ok) {
        throw new Error("Failed to fetch links");
    }
    const data = await res.json();
    console.log(data)

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
    console.log(data)

    return data;
}

type linksProps = {
    me: any
}

function LinksTable(props: linksProps){
    const [links, setLinks] = useState<Links[]>([]);

    useEffect(() => {
        if (["underwriter","business analyst"].includes(props.me.roles.at(0).toLowerCase())) {
            getRoleLinks(props.me.roles.at(0)).then(setLinks)
                .catch(console.error);
        }
        else {
            getLinks().then(setLinks)
                .catch(console.error);
        }

    }, []);
    return (
        <>
            <div className="shadow-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead></TableHead>
                            <TableHead className="flex text-center items-center pl-[35px]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {links.map((l) => (
                            <TableRow key={l.link_name}>
                                <TableCell>{l.link_name}</TableCell>
                                <TableCell>{l.url}</TableCell>
                                <TableCell></TableCell>

                                <TableCell className="flex items-center gap-3">
                                    <Editlinksform
                                        id={l.id}
                                        name ={l.link_name}
                                        url ={l.url}
                                        owner={props.me.roles.at(0)}
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