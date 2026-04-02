import Card from "../components/card.tsx";
import "./home.css";
import {SearchBar} from "@/components/searchbar.tsx";




function Home() {
    return (
        <>
        <div className="home-container">
            <div className={ "hero-container"}>
                <div className = "home-header-container">
                    <h1> Home </h1>
                </div>
                <div className="search-container">
                    <SearchBar />
                </div>
                <img src = "/hanoverinsurence.webp" alt = "hanoverPic" style={{ width: "100%" }}/>
            </div>
            <div className="home-cards-container">
            <Card title={"Placeholder Card Title"}></Card>
            <Card title={"Placeholder Card Title"}></Card>
            <Card title={"Placeholder Card Title"}></Card>
                <Card title={"Placeholder Card Title"}></Card>
            </div>
        </div>
        </>
    )
}
export default Home;