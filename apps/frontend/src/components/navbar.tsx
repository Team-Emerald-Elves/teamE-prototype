import { Link } from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { type ReactNode, useEffect, useState } from "react";
import CenterDiv from "./center-div.tsx";
import {getToken, useAuth} from "@clerk/react";
import { Bell } from 'lucide-react';
import {NotifScroll} from '@/components/notifications.tsx';
import qmgr from '@/lib/querymgr.ts';

interface NavbarProps {
    children?: ReactNode;
}

async function setRead(setUnread: (a: boolean) => void) {
    const token = await getToken();

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/set-read`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Error setting notifications to read");
    }
    setUnread(false);
}

function Navbar(props: NavbarProps) {
    const [roles, setRoles] = useState<string[]>([]);
    const { isSignedIn } = useAuth();
    const [showNotification, setShowNotification] = useState(false);
    const toggleNotifs = () => {
        setShowNotification(!showNotification);
    };
    const [unread, setUnread] = useState<boolean>(false);

    useEffect(() => {
        if (!isSignedIn) {
            return;
        }
        let interval: number;

        async function load() {
            qmgr.wait(() => {
                qmgr.getMe( async (res) => {
                    if (!res.success) {
                        throw new Error("Unable to get me");
                    }
                    const data = res.data!;
                    setUnread(data.unreadNotif as boolean);
                    setRoles((data.roles as string[]).map((role: string) => role.toLowerCase()))
                })
            })
        }

        load();

        interval = window.setInterval(load, 10000);

        return () => window.clearInterval(interval);
    }, []);

    return (
        <header className="w-full bg-[#013C5A] text-white sticky top-0 z-50">
            <div className="w-full flex items-center justify-between px-6 py-2">
                {/*Left side*/}
                <NavigationMenu>
                    <NavigationMenuList className="flex gap-10 justify-items-start pl-5">
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                render={<Link to="/">Home</Link>}
                                className={navigationMenuTriggerStyle()}
                            ></NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink
                                render={<Link to="/documents">Documents</Link>}
                                className={navigationMenuTriggerStyle()}
                            ></NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink
                                render={<Link to="/links">Links</Link>}
                                className={navigationMenuTriggerStyle()}
                            ></NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink
                                render={<Link to="/calendar">Calendar</Link>}
                                className={navigationMenuTriggerStyle()}
                            ></NavigationMenuLink>
                        </NavigationMenuItem>

                        {roles.includes("administrator") && (
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    render={
                                        <Link to="/employee-management">
                                            User Management
                                        </Link>
                                    }
                                    className={navigationMenuTriggerStyle()}
                                />
                            </NavigationMenuItem>
                        )}
                    </NavigationMenuList>
                </NavigationMenu>

                <NavigationMenu>
                    <NavigationMenuList className="flex gap-10">
                        {/*<NavigationMenuItem>*/}
                        {/*    <NavigationMenuLink render={<Link to="/profile"><HugeiconsIcon icon = {UserSquareIcon} className = "size-6"/> </Link>} className={navigationMenuTriggerStyle()}></NavigationMenuLink>*/}

                        {/*</NavigationMenuItem>*/}

                        <NavigationMenuItem>
                            <button
                                onClick={async () => {
                                    toggleNotifs();
                                    await setRead(setUnread);
                                }}
                            >
                                {/*red dot thingy*/}
                                {unread && (
                                    <div className="w-2.5 h-2.5 bg-red-500 z-10 absolute rounded-full translate-x-6.5 translate-y-1"></div>
                                )}
                                <Bell
                                    size={18}
                                    className={navigationMenuTriggerStyle()}
                                />
                            </button>
                            {showNotification && (
                                <div className="absolute right-0 top-full mt-2 z-50 animate-in zoom-in-80 origin-top-right duration-200 ease-in-out">
                                    <NotifScroll />
                                </div>
                            )}
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <CenterDiv>{props.children}</CenterDiv>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </header>
    );
}

export default Navbar;
