import Card from "../components/card.tsx";
import "./home.css";
import {SearchBar} from "@/components/searchbar.tsx";
import DocTable from "@/components/docTable.tsx";
import DisclaimerFooter from "@/components/disclaimerFooter.tsx";

const rows = [
    { docTitle: "Report.pdf", docDate: "2024-01-01", docStatus: "Draft" },
    { docTitle: "Notes.docx", docDate: "2024-01-02", docStatus: "Draft" },
    { docTitle: "Report.pdf", docDate: "2024-01-01", docStatus: "Draft" },
    { docTitle: "Notes.docx", docDate: "2024-01-02", docStatus: "Draft" },
    { docTitle: "Report.pdf", docDate: "2024-01-01", docStatus: "Draft" }
];

type homeProps = {
    role: string;
    me: any
}
function Home(props: homeProps) {
    console.log(props.me)
    if ( !props.me) {
        return (
            <div className="hero-container">
                <img src = "/hanover-hero.webp" alt = "hanoverPic"/>
                <div className="hero-body">
                    <h1 className="text-shadow-lg/40">Home</h1>
                </div>
            </div>
        )
    }
    if ( ["business analyst"].includes(props.me.roles.at(0).toLowerCase())) {
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
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,2fr))] lg:grid-cols-[repeat(auto-fill,minmax(450px,2fr))] gap-[50px]">
                        <Card title={"Reviews and Testimonies"} content={<DocTable rows={rows} />} />
                        <Card title={"Reports and Analytics"} content={<img src="/U.S. News & World Report Best Companies to Work For.avif" className="w-75 py-[15px] mx-auto block"/>}/>
                    </div>
                </div>
                <DisclaimerFooter/>
            </>
        )
    }
    if (["underwriter"].includes(props.me.roles.at(0).toLowerCase())) {
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
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,2fr))] lg:grid-cols-[repeat(auto-fill,minmax(450px,2fr))] gap-[50px]">
                        <Card title={"Reviews and Testimonies"}
                              content={
                            <p>
                                I was not only pleased but incredibly surprised at how well my claim went when I contacted Hanover Insurance. My insurance adjuster, Drew, was communicative and very helpful. I have been referring Hanover Insurance to my friends and family. I could not have asked for a better experience. - Anita Becker
                            </p>
                            }
                            />
                        <Card title={"Recognitions and Awards"} content={<img src="/U.S. News & World Report Best Companies to Work For.avif" className="w-75 py-[15px] mx-auto block"/>}/>
                    </div>
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
                </div>
            </div>
            <DisclaimerFooter/>
            </>
        )
    }

}
export default Home;