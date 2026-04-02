import Card from "../components/card.tsx";
import "./home.css";
import {SearchBar} from "@/components/searchbar.tsx";
import DocTable from "@/components/docTable.tsx";

const rows = [
    { docTitle: "Report.pdf", docDate: "2024-01-01", docStatus: "Complete" },
    { docTitle: "Notes.docx", docDate: "2024-01-02", docStatus: "Draft" },
];


function Home() {
    return (
        <>
        <div className="home-container">
            <div className={ "hero-container"}>
                <div className = "home-header-container text-background">
                    <h1> Home </h1>
                </div>
                <div className="search-container">
                    <SearchBar />
                </div>
                <img src = "/hanoverinsurence.webp" alt = "hanoverPic" style={{ width: "100%" }}/>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,2fr))] gap-[50px]">
                <Card title={"Upcoming Expirations"} content={<DocTable rows={rows} />} />
                <Card title={"Reports and Analytics"} content={<img src="/reports-placeholder.png" />}/>
            </div>
        </div>
        </>
    )
}
export default Home;