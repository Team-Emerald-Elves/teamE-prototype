import { Link } from 'react-router-dom';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {type ReactNode, useEffect, useState} from "react";
import CenterDiv from "./center-div.tsx";
import {useAuth} from "@clerk/react";


interface NavbarProps {
    children?: ReactNode
}

// async function getCurrentUserData() {
//     const res = await fetch(`${import.meta.env.BACKEND_URL}/me`);

//     if (!res.ok) {
//         throw new Error("Failed to fetch user data");
//     }

//     const data = res.json();
//     console.log(data)

// }

function Navbar(props: NavbarProps) {
    const [roles, setRoles] = useState<string[]>([]);
    const { getToken, isSignedIn } = useAuth();

    useEffect(() => {
        if (!isSignedIn) {
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
            setRoles((data.roles as string[]).map((role: string) => role.toLowerCase()))
        }

        load();
    }, [isSignedIn]);
    return (
        <header className="w-full bg-[#00355f] text-white">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-2">

                {/*Left side*/}
                <NavigationMenu>
                    <NavigationMenuList className = "flex gap-10">
                        <NavigationMenuItem >
                            <NavigationMenuLink render={<Link to="/">Home</Link>} className={navigationMenuTriggerStyle()}>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink render={<Link to="/documents">Documents</Link>} className={navigationMenuTriggerStyle()}>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {roles.includes("administrator") && (
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    render={<Link to="/employee-management">User Management</Link>}
                                    className={navigationMenuTriggerStyle()}
                                />
                            </NavigationMenuItem>
                        )}
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                render={<Link to="/links">Links </Link>} className={navigationMenuTriggerStyle()}></NavigationMenuLink>
                        </NavigationMenuItem>

                    </NavigationMenuList>
                </NavigationMenu>

                <NavigationMenu>
                    <NavigationMenuList className = "flex gap-4">
                        <NavigationMenuItem>
                            <CenterDiv>
                                {props.children}
                            </CenterDiv>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

        </header>

    );
}

export default Navbar;