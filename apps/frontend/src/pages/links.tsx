import Linkstable from "@/components/linkstable.tsx";
import {useEffect, useState} from "react";
import {useAuth} from "@clerk/react";
import PageHeader from "../components/page-header.tsx"

function Links() {
    const [roles, setRoles] = useState<string[]>([]);
    const { getToken, isSignedIn } = useAuth();
    const [me, setMe] = useState<any>(null);

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
    return (
        <>
            <PageHeader title="Links" description="View your links or modify them by adding, deleting, or updating existing ones."/>



            <div className="relative w-full flex items-center">

            </div>
            <div>
                <Linkstable />
            </div>
        </>
    )
}

export default Links;