import Card from "../components/card.tsx";
import "./home.css";
import {SearchBar} from "@/components/searchbar.tsx";
import DocTable from "@/components/docTable.tsx";
import DisclaimerFooter from "@/components/disclaimerFooter.tsx";
import {useEffect, useState} from "react";
import {useAuth} from "@clerk/react";
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
            <div className="hero-container">
                <img src = "/hanover-hero.webp" alt = "hanoverPic"/>
                <div className="hero-body">
                    <h1 className="text-shadow-lg/40">Home</h1>
                </div>
            </div>
        )
    }
    if (roles.includes("businessanalyst")) {
        return (
            <>
                <div className="hero-container">
                    <img src = "/hanover-hero.webp" alt = "hanoverPic"/>
                    <div className="hero-body">
                        <h1 className="text-shadow-lg/40">Home</h1>
                        <SearchBar/>
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
                <div className="hero-container">
                    <img src = "/hanover-hero.webp" alt = "hanoverPic"/>
                    <div className="hero-body">
                        <h1 className="text-shadow-lg/40">Home</h1>
                        <SearchBar/>
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
            <div className="hero-container">
                <img src = "/hanover-hero.webp" alt = "hanoverPic"/>
                <div className="hero-body">
                    <h1 className="text-shadow-lg/40">Home</h1>
                    <SearchBar/>
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