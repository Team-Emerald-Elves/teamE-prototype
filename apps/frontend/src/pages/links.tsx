import LinksTable from "@/components/linkstable.tsx";
import {useEffect, useState} from "react";
import {useAuth} from "@clerk/react";
import PageHeader from "../components/page-header.tsx"
import { columns, type Links } from "../components/linksCols.tsx"





function Links() {
    const [roles, setRoles] = useState<string[]>([]);
    const { getToken, isSignedIn } = useAuth();
    const [me, setMe] = useState<any>(null);
    const [links, setLinks] = useState<Links[]>([]);

    useEffect(() => {
        if (!isSignedIn) {
            setMe(null);
            return;
        }

        async function load() {
            const token = await getToken();

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            setMe(data);
            setRoles((data.roles as string[]).map((role: string) => role.toLowerCase()))
        }

        load();
    }, [isSignedIn, roles]);

    useEffect(() => {

        async function getLinks() {
            const token = await getToken();

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/links`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Failed to fetch links");
            }
            const data = await res.json();
            setLinks(data)
            return data;
        }
            getLinks()

    }, []);

    return (
        <>
            <PageHeader title="Links" description="View your links or modify them by adding, deleting, or updating existing ones."/>
            <div className="relative w-full flex items-center">

            </div>
            <div>
                <LinksTable columns={columns} data={links}/>
            </div>
        </>
    )
}

export default Links;