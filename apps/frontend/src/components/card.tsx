
export interface CardProps {
    title: string;
    content?: React.ReactNode;
}


function Card({title,content}: CardProps){
    return (
        <div className="group bg-[aliceblue] shadow-[0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.1)] rounded-[10px] transition-transform duration-200 ease-in-out max-h-[1000px] min-h-[300px] hover:scale-105 hover:cursor-pointer hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]">
            <div className="py-[15px] px-[30px] flex flex-col">
                <h2 className="font-sans font-bold text-lg group-hover:text-[#00355f]">{title}</h2>

                <div className="flex items-center min-h-[200px]">
                    {content}
                </div>
                <div>
                    <h4 className="font-sans font-bold text-xs text-[#00355f]">View More</h4>
                </div>
            </div>

        </div>
    )


}

export default Card