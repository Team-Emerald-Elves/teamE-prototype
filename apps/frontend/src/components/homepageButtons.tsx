import type {LucideIcon} from "lucide-react";

interface homepageButtonProps{
    icon: LucideIcon;
    label: string;
    onClick?: string;
}

export function HomepageButtons({icon: Icon, label}: homepageButtonProps){
    const base = "flex items-center justify-center relative z-99 gap-10 w-12 h-12 rounded-full bg-[#013C5A] shadow-md/20 shadow-black cursor-pointer"
    const hover = "transition duration-300 ease-in-out hover:scale-105 hover:brightness-120 hover:shadow-lg";

    return (
        <>
            <div className = "flex items-center justify-center flex-col">
                <button className = {`${base} ${hover}`}>
                    <Icon size={25}/>
                </button>
                <div className = "text-xs p-1 font-semibold cursor-pointer">
                    {label}
                </div>

            </div>

        </>

    )
}