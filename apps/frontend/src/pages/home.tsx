import Card from "../components/card.tsx";
import "./home.css";
import {SearchBar} from "@/components/searchbar.tsx";




function Home() {
    return (
        <>
        <div className="home-container">
            <h1> Home </h1>
            <div className="search-container">
                <SearchBar />
            </div>
            <div style={{ marginBottom: '1.5rem' }}></div>
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