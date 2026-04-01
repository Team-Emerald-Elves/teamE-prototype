import Card from "../components/card.tsx";
import "./home.css";



function Home() {
    return (
        <>
        <div className="home-container">
            <h1> Home </h1>
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