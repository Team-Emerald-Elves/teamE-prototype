import "./home.css";
import Dashboard from "@/components/dashboard.tsx";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { useUser } from "@clerk/react";
import { UserAvatar } from "@clerk/react";
import qmgr from "@/lib/querymgr";
import { Pencil, Check, RotateCcw } from "lucide-react";

function Home() {
    const [roles, setRoles] = useState<string[]>([]);
    const [firstname, setfirstname] = useState("");

    const { isSignedIn } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    useUser();

    useEffect(() => {
        if (!isSignedIn) {
            return;
        }

        qmgr.wait(() => {
            qmgr.getMe(async (res) => {
                if (!res.success) {
                    throw new Error("Unable to get me");
                }
                const data = await res.data!;
                setfirstname(data.first_name);
                setRoles(
                    (data.roles as string[]).map((role: string) =>
                        role.toLowerCase(),
                    ),
                );
            });
        });
    }, []);

    return (
        <>
            <div className="hero-container p-40px">
                <div className="hero-overlay"></div>
                <div className="hero-image"></div>
                <div className="hero-content justify-content-start">
                    <div className="hero-content-top flex items-center">
                        <UserAvatar />
                        <div className="hero-text px-5 justify-center text-lg/10">
                            <h1>
                                Hello,
                                <br /> {firstname}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="home-content-container px-5 pt-3">
                <div className="flex justify-start pl-3 flex-row gap-3">
                    <button
                        type="button"
                        onClick={() => setIsEditing((v) => !v)}
                        className="group px-2 py-1 rounded-2xl bg-(--input) hover:brightness-120 duration-200 ease-in-out text-[10px] active:brightness-95"
                    >
                        <div className="flex flex-row items-center">
                            {isEditing ? (
                                <Check size={12} />
                            ) : (
                                <Pencil size={12} />
                            )}

                            <span className="max-w-0 text-(--table-text) overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:ml-2 active:scale-95">
                                {isEditing ? "Done" : "Edit dashboard"}
                            </span>
                        </div>
                    </button>

                    {isEditing && (
                        <>
                            <button
                                type="button"
                                onClick={() => setResetKey((k) => k + 1)}
                                className="group px-2 py-1 text-(--table-text) rounded-2xl bg-(--input) hover:brightness-150 duration-100 ease-in-out text-[10px] active:brightness-95"
                            >
                                <div className="flex flex-row items-center gap-1">
                                    <RotateCcw size={12} />
                                    Reset Dashboard
                                </div>
                            </button>
                        </>
                    )}
                </div>

                <Dashboard
                    roles={roles}
                    isEditing={isEditing}
                    resetKey={resetKey}
                />
            </div>
        </>
    );
}

export default Home;
