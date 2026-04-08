import Card from "../components/card.tsx";
import "./home.css";
import {SearchBar} from "@/components/searchbar.tsx";
import DocTable from "@/components/docTable.tsx";

const rows = [
    { docTitle: "Report.pdf", docDate: "2024-01-01", docStatus: "Draft" },
    { docTitle: "Notes.docx", docDate: "2024-01-02", docStatus: "Draft" },
    { docTitle: "Report.pdf", docDate: "2024-01-01", docStatus: "Draft" },
    { docTitle: "Notes.docx", docDate: "2024-01-02", docStatus: "Draft" },
    { docTitle: "Report.pdf", docDate: "2024-01-01", docStatus: "Draft" }
];

type homeProps = {
    role: string;
}
function Home(props: homeProps) {
    if (props.role === "none") {
        return (
            <div className="hero-container">
                <img src = "/hanover-hero.webp" alt = "hanoverPic"/>
                <div className="hero-body">
                    <h1 className="text-shadow-lg/40">Home</h1>
                </div>
            </div>
        )
    }
    if (props.role === "u") {
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
                        <Card title={"Upcoming Expirations"} content={<DocTable rows={rows} />} />
                        <Card title={"Reports and Analytics"} content={<img src="/pie-chart.png" className="w-75 py-[15px] mx-auto block"/>}/>
                    </div>
                </div>
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
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,2fr))] lg:grid-cols-[repeat(auto-fill,minmax(450px,2fr))] gap-[50px]">
                        <Card title={"Upcoming Expirations"} content={<DocTable rows={rows} />} />
                        <Card title={"Reports and Analytics"} content={<img src="/bar_chart.png" className="w-75 py-[15px] mx-auto block"/>}/>
                    </div>
                </div>
            </>
        )
    }

}
export default Home;