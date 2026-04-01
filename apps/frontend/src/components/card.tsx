export interface CardProps {
    title: string;

}

function Card({title}: CardProps){
    return (
        <div className="card">
            <div className="card-container">
                <h2 id="card-title">{title}</h2>

                <div className="card-content">
                    <p>Placeholder</p>
                </div>
                <div className="card-footer">
                    <h4 id="more">View More</h4>
                </div>
            </div>

        </div>
    )


}

export default Card