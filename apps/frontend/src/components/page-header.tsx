type PageHeaderProps = {
    title: string;
    description?: string;
}

function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <>
            <div className="mx-5 pt-6 text-left flex flex-start flex-col pl-5">
                <h1 className = "text-left pb-2">{title}</h1>
                <div className = "bg-[#F4A258] w-30 h-[3px]"/>
                <p className = "header-subtext-color pt-3"> {description} </p>
            </div>
        </>
    )
}

export default PageHeader;
