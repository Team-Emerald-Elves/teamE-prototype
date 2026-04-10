import { Link } from 'react-router-dom';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { type ReactNode } from "react";
import CenterDiv from "./center-div.tsx";


interface NavbarProps {
    roles: string[];
    children?: ReactNode
    me: any
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
   // getCurrentUserData();
   //  const { getToken } = useAuth()
   //  const [me, setMe] = useState()
   //
   //  useEffect(() => {
   //      async function load() {
   //          const token = await getToken()
   //
   //          const res = await fetch("http://localhost:3000/api/tests/me", {
   //              headers: {
   //                  Authorization: `Bearer ${token}`
   //              }
   //          })
   //
   //          const data = await res.json()
   //          setMe(data)
   //      }
   //
   //      load()
   //  }, [])
   //  console.log(me)
   //  if (!me) {
   //      return (
   //          <header className="w-full bg-[#00355f] text-white">
   //              <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-2">
   //              </div>
   //          </header>
   //      )
   //  }
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

                        {["admin", "administrator"].includes(props.me.roles?.[0]?.toLowerCase()) && (
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    render={<Link to="/employee-management">User Management</Link>}
                                    className={navigationMenuTriggerStyle()}
                                />
                            </NavigationMenuItem>
                        )}
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                render={<Link to="/settings">Links </Link>} className={navigationMenuTriggerStyle()}></NavigationMenuLink>
                        </NavigationMenuItem>

                    </NavigationMenuList>
                </NavigationMenu>

                <NavigationMenu>
                    <NavigationMenuList className = "flex gap-4">

                        {/*<NavigationMenuItem>*/}
                        {/*    <NavigationMenuLink render={<Link to="/profile"><HugeiconsIcon icon = {UserSquareIcon} className = "size-6"/> </Link>} className={navigationMenuTriggerStyle()}></NavigationMenuLink>*/}

                        {/*</NavigationMenuItem>*/}

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