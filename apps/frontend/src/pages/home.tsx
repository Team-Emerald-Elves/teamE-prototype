import "./home.css";
import { SearchBar } from "@/components/searchbar.tsx";
import { useEffect, useState } from "react";
import { useAuth, useUser, UserAvatar } from "@clerk/react";
import Dashboard from "@/components/dashboard.tsx";

function Home() {
    const [roles, setRoles] = useState<string[]>([]);
    const [firstname, setfirstname] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    useUser();
    const { getToken, isSignedIn } = useAuth();

    useEffect(() => {
        if (!isSignedIn) return;

        async function load() {
            const token = await getToken();
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setfirstname(data.first_name);
            setRoles((data.roles as string[]).map((role: string) => role.toLowerCase()));
        }

        load();
    }, [isSignedIn, getToken]);

    return (
        <>
            <div className="hero-container p-40px">
                <div className="hero-overlay"></div>
                <div className="hero-image"></div>
                <div className="hero-content justify-content-start">
                    <div className="hero-content-top flex items-center">
                        <UserAvatar />
                        <div className="hero-text px-5 justify-center text-lg/10">
                            <h1>Hello,<br /> {firstname}</h1>
                        </div>
                    </div>
                    <div className="hero-content-bottom py-5 pl-2">
                        <SearchBar />
                    </div>
                </div>
            </div>

            <div className="home-content-container px-5 py-4">
                <div className="flex justify-end mb-3">
                    <button
                        type="button"
                        onClick={() => setIsEditing((v) => !v)}
                        className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 text-sm"
                    >
                        {isEditing ? "Done" : "Edit dashboard"}
                    </button>
                </div>
                <Dashboard roles={roles} isEditing={isEditing} />
            </div>
        </>
    );
}

export default Home;
