import Card from "../components/card.tsx";
import "./home.css";
import {SearchBar} from "@/components/searchbar.tsx";
import DisclaimerFooter from "@/components/disclaimerFooter.tsx";
import {useEffect, useState} from "react";
import {useAuth} from "@clerk/react";
import {useUser} from "@clerk/react";
import {UserAvatar} from '@clerk/react'
import {HomepageButtons} from "@/components/homepageButtons.tsx";
import {ChartArea, TableOfContents} from "lucide-react";
import Favorites from "@/components/favorites.tsx";


const rows = [
    { docTitle: "Report.pdf", docDate: "2024-01-01", docStatus: "Draft" },
    { docTitle: "Notes.docx", docDate: "2024-01-02", docStatus: "Draft" },
    { docTitle: "Report.pdf", docDate: "2024-01-01", docStatus: "Draft" },
    { docTitle: "Notes.docx", docDate: "2024-01-02", docStatus: "Draft" },
    { docTitle: "Report.pdf", docDate: "2024-01-01", docStatus: "Draft" }
];



function Home() {

    const [roles, setRoles] = useState<string[]>([]);
    const {user} = useUser()
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
    }, [isSignedIn]);

    if (!me) {
        return (
            <div className ="hero-container p-40px">
                <div className="hero-overlay"></div>
                <div className = "hero-image"></div>
                <div className="hero-content justify-content-start">
                    <div className ="hero-content-top flex items-center">
                        <UserAvatar/>
                        <div className="hero-text px-5 justify-center text-lg/10">
                            <h1>Hello,<br/> {user.firstName}</h1>
                        </div>

                        <div className="pl-2 flex flex-row gap-5 mt-auto">
                            <HomepageButtons icon={ChartArea} label="Reports & Statistics"/>
                            <HomepageButtons icon={TableOfContents} label="View Content"/>
                        </div>
                    </div>
                    <div className = "hero-content-bottom py-5 pl-2">
                        <SearchBar/>
                    </div>
                </div>
            </div>
        )
    }
    if (roles.includes("businessanalyst")) {
        return (
            <>
                <div className ="hero-container p-40px">
                    <div className="hero-overlay"></div>
                    <div className = "hero-image"></div>
                    <div className="hero-content justify-content-start">
                        <div className ="hero-content-top flex items-center">
                            <UserAvatar/>
                            <div className="hero-text px-5 justify-center text-lg/10">
                                <h1>Hello,<br/> {user.firstName}</h1>
                            </div>
                            <div className="pl-2 flex flex-row gap-5 mt-auto">
                                <HomepageButtons icon={ChartArea} label="Reports & Statistics"/>
                                <HomepageButtons icon={TableOfContents} label="View Content"/>
                            </div>
                        </div>
                        <div className = "hero-content-bottom py-5 pl-2">
                            <SearchBar/>
                        </div>
                    </div>
                </div>

                <div className="home-content-container">
                    {/*<div className="grid grid-cols-[repeat(auto-fill,minmax(300px,2fr))] lg:grid-cols-[repeat(auto-fill,minmax(450px,2fr))] gap-[50px]">*/}
                        {/*<Card title={"Reviews and Testimonies"} content={<DocTable rows={rows} />} />*/}
                        {/*<Card title={"Reports and Analytics"} content={<img src="/U.S. News & World Report Best Companies to Work For.avif" className="w-75 py-[15px] mx-auto block"/>}/>*/}
                        <Favorites />
                    {/*</div>*/}
                </div>
                <DisclaimerFooter/>
            </>
        )
    }
    if (roles.includes("underwriter")) {

        return(
            <>
                <div className ="hero-container p-40px">
                    <div className="hero-overlay"></div>
                    <div className = "hero-image"></div>
                    <div className="hero-content justify-content-start">
                        <div className ="hero-content-top flex items-center">
                            <UserAvatar/>
                            <div className="hero-text px-5 justify-center text-lg/10">
                                <h1>Hello,<br/> {user.firstName}</h1>
                            </div>
                            <div className="pl-2 flex flex-row gap-5 mt-auto">
                                <HomepageButtons icon={ChartArea} label="Reports & Statistics"/>
                                <HomepageButtons icon={TableOfContents} label="View Content"/>
                            </div>
                        </div>
                        <div className = "hero-content-bottom py-5 pl-2">
                            <SearchBar/>
                        </div>
                    </div>
                </div>

                <div className="home-content-container">
                    {/*<div className="grid grid-cols-[repeat(auto-fill,minmax(300px,2fr))] lg:grid-cols-[repeat(auto-fill,minmax(450px,2fr))] gap-[50px]">*/}
                    {/*    <Card title={"Reviews and Testimonies"}*/}
                    {/*          content={*/}
                    {/*        <p>*/}
                    {/*            I was not only pleased but incredibly surprised at how well my claim went when I contacted Hanover Insurance. My insurance adjuster, Drew, was communicative and very helpful. I have been referring Hanover Insurance to my friends and family. I could not have asked for a better experience. - Anita Becker*/}
                    {/*        </p>*/}
                    {/*        }*/}
                    {/*        />*/}
                    {/*    <Card title={"Recognitions and Awards"} content={<img src="/U.S. News & World Report Best Companies to Work For.avif" className="w-75 py-[15px] mx-auto block"/>}/>*/}
                        <Favorites />
                    {/*</div>*/}
                </div>
                <DisclaimerFooter/>
            </>
        )
    }
    else {
        return (
            <>
                <div className ="hero-container p-40px">
                    <div className="hero-overlay"></div>
                    <div className = "hero-image"></div>
                    <div className="hero-content justify-content-start">
                        <div className ="hero-content-top flex items-center">
                            <UserAvatar/>
                            <div className="hero-text px-5 justify-center text-lg/10">
                                <h1>Hello,<br/> {user.firstName}</h1>
                            </div>
                            <div className="pl-2 flex flex-row gap-5 mt-auto">
                                <HomepageButtons icon={ChartArea} label="Reports & Statistics"/>
                                <HomepageButtons icon={TableOfContents} label="View Content"/>
                            </div>
                        </div>
                        <div className = "hero-content-bottom py-5 pl-2">
                            <SearchBar/>
                        </div>
                    </div>
                </div>
                <div className="home-content-container">
                    {/*<div className="grid grid-cols-[repeat(auto-fill,minmax(300px,2fr))] lg:grid-cols-[repeat(auto-fill,minmax(450px,2fr))] gap-[50px]">*/}
                    {/*    <Card title={"Reviews and Testimonies"}*/}
                    {/*          content={*/}
                    {/*        <p>*/}
                    {/*            I was not only pleased but incredibly surprised at how well my claim went when I contacted Hanover Insurance. My insurance adjuster, Drew, was communicative and very helpful. I have been referring Hanover Insurance to my friends and family. I could not have asked for a better experience. - Anita Becker*/}
                    {/*        </p>*/}
                    {/*        }*/}
                    {/*        />*/}
                    {/*    <Card title={"Recognitions and Awards"} content={<img src="/U.S. News & World Report Best Companies to Work For.avif" className="w-75 py-[15px] mx-auto block"/>}/>*/}
                    <Favorites />
                    {/*</div>*/}
                </div>
            <DisclaimerFooter/>
            </>
        )
    }

}
export default Home;