import { Link } from 'react-router-dom';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuContent,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {HugeiconsIcon} from "@hugeicons/react";
import { Settings02FreeIcons } from "@hugeicons/core-free-icons";
import { UserSquareIcon } from "@hugeicons/core-free-icons";
import type {ReactNode} from "react";


interface NavbarProps {
    role: string;
    children?: ReactNode
}

const underwriterLinks = [
    { to: "/underwriter-dummy", label: "Desktop Management Tool" },
    { to: "/underwriter-dummy", label: "States on Hold" },
    { to: "/underwriter-dummy", label: "Desktop Management Tool" },
    { to: "/underwriter-dummy", label: "RiskMeter Online" },
    { to: "/underwriter-dummy", label: "ISOnet Website" },
    { to: "/underwriter-dummy", label: "Forms Knowledge Base" },
    { to: "/underwriter-dummy", label: "Experience & Schedule Rating Plans" },
    { to: "/underwriter-dummy", label: "Coastal Guidelines" },
    { to: "/underwriter-dummy", label: "IPS (Image & Processing System)" },
    { to: "/underwriter-dummy", label: "Underwriting Workstation" },
];

const businessLinks = [
    { to: "/buisnessanalystdummy", label: "States on Hold" },
    { to: "/buisnessanalystdummy", label: "Forms Knowledge Base" },
    { to: "/buisnessanalystdummy", label: "IPS (Image & Processing System)" },
    { to: "/buisnessanalystdummy", label: "Underwriting Workstation" },
    { to: "/buisnessanalystdummy", label: "CPP Rater Resource Site" },
    { to: "/buisnessanalystdummy", label: "PMS URG" },
    { to: "/buisnessanalystdummy", label: "Kentucky Tax and Tax Exemption Aid" },
    { to: "/buisnessanalystdummy", label: "Experience & Schedule Rating Plans" },
    { to: "/buisnessanalystdummy", label: "Error Lookup Tool" },
    { to: "/buisnessanalystdummy", label: "CPP Rater Resource Site" },

];



function Navbar(props: NavbarProps) {
    const links = props.role === "u" ? underwriterLinks : props.role === "b" ? businessLinks : [];
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

                        <NavigationMenuItem>
                            <NavigationMenuLink render={<Link to="/employee-management">User Management</Link>} className={navigationMenuTriggerStyle()}>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>Links</NavigationMenuTrigger>

                            <NavigationMenuContent>
                                {props.role === "u" ? (
                                    <>
                                        {links.map((link) => (
                                            <li key={link.to}>
                                                <NavigationMenuLink render={<Link to={link.to}>{link.label}</Link>} className={navigationMenuTriggerStyle()} />
                                            </li>
                                        ))}
                                    </>
                                ) : props.role === "b" ? (
                                    <>
                                        {links.map((link) => (
                                            <li key={link.to}>
                                                <NavigationMenuLink render={<Link to={link.to}>{link.label}</Link>} className={navigationMenuTriggerStyle()} />
                                            </li>
                                        ))}
                                    </>

                                    ) : null}
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <NavigationMenu>
                    <NavigationMenuList className = "flex gap-4">

                        {/*<NavigationMenuItem>*/}
                        {/*    <NavigationMenuLink render={<Link to="/profile"><HugeiconsIcon icon = {UserSquareIcon} className = "size-6"/> </Link>} className={navigationMenuTriggerStyle()}></NavigationMenuLink>*/}

                        {/*</NavigationMenuItem>*/}
                            <NavigationMenuLink
                                render={<Link to="/settings"><HugeiconsIcon icon = {Settings02FreeIcons} className = "size-6 hover:rotate-180 transition duration-300" /> </Link>} className={navigationMenuTriggerStyle()}></NavigationMenuLink>
                        <NavigationMenuItem>
                            {props.children}
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

        </header>

    );
}

export default Navbar;