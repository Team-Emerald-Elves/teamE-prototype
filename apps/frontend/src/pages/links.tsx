import AddLinksForm from '@/components/addlinksform.tsx'
import Linkstable from "@/components/linkstable.tsx";
import {useEffect, useState} from "react";
import {useAuth} from "@clerk/react";

function Links() {
    const [roles, setRoles] = useState<string[]>([]);
    const { getToken, isSignedIn } = useAuth();
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
    }, [isSignedIn, roles]);
    return (
        <>
            <div className="text-center font-bold text-primary">
                <h1 className="font-mono">Links</h1>
            </div>


            <div className="relative w-full flex items-center">

            </div>
            <div className="px-10 py-20 ">
                <Linkstable me={me}/>
            </div>
        </>
    )
}

export default Links;