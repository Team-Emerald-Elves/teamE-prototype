import "./home.css";
import { SearchBar } from "@/components/searchbar.tsx";
import Dashboard from "@/components/dashboard.tsx";
//import {SearchBar} from "@/components/searchbar.tsx";
import {useEffect, useState} from "react";
import {useAuth} from "@clerk/react";
import {useUser} from "@clerk/react";
import {UserAvatar} from '@clerk/react'
import Favorites from "@/components/favorites.tsx";
import {HitCounts} from "@/components/hit-counts.tsx"
import {UserLogs} from "@/components/user-logs.tsx";
import { NumericalStats } from "@/components/numerical-stats.tsx";
import PageHeader from "@/components/page-header.tsx"
import { ChartPieSeparatorNone} from "@/components/piechartroles.tsx";
import { ChartPieStacked} from "@/components/piechartdocuments.tsx";
import CalendarWeek from "@/components/calendarWeekComponent.tsx";
import qmgr from "@/lib/querymgr";

interface HeroBannerProps {
    firstname: string;
}

const HeroBanner = ({ firstname }: HeroBannerProps) => (
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
        </div>
    </div>
);

function Home() {
    const [roles, setRoles] = useState<string[]>([]);
    const [firstname, setfirstname] = useState("");
    const {isSignedIn} = useAuth();
    const [isEditing, setIsEditing] = useState(false);
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
                setRoles((data.roles as string[]).map((role: string) => role.toLowerCase()))
            })
        })
    }, []);

    // if (!me) {
    //     return (
    //         <div className ="hero-container p-40px">
    //             <div className="hero-overlay"></div>
    //             <div className = "hero-image"></div>
    //             <div className="hero-content justify-content-start">
    //                 <div className ="hero-content-top flex items-center">
    //                     <UserAvatar/>
    //                     <div className="hero-text px-5 justify-center text-lg/10">
    //                         <h1>Hello,<br/> {me.first_name}</h1>
    //                     </div>
    //
    //                     <div className="pl-2 flex flex-row gap-5 mt-auto">
    //                         <a href="/statistics">
    //                             <HomepageButtons icon={ChartArea} label="Reports & Statistics"/>
    //                         </a>
    //                     </div>
    //                 </div>
    //                 <div className = "hero-content-bottom py-5 pl-2">
    //                     <SearchBar/>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }

        return (
            <>
                <div className="hero-container p-40px">
                    <div className="hero-overlay"></div>
                    <div className="hero-image"></div>
                    <div className="hero-content justify-content-start">
                        <div className="hero-content-top flex items-center">
                            <UserAvatar/>
                            <div className="hero-text px-5 justify-center text-lg/10">
                                <h1>Hello,<br/> {firstname}</h1>
                            </div>
                        </div>
                        <div className="hero-content-bottom py-5 pl-2">
                            <SearchBar/>
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
                    <Dashboard roles={roles} isEditing={isEditing}/>
                </div>
            </>
        );
}
export default Home;
