import PageHeader from "../components/page-header.tsx"
import { Card } from "@/components/ui/card.tsx"



const teamMembers = [
    { name: "Brycen Pina", role: "Lead Software Engineer", image: "/blankprofile.png"  },
    { name: "Anastasia Kelnik", role: "Assistant Lead Software Engineer", image: "/blankprofile.png"  },
    { name: "Colin Teahan", role: "Assistant Lead Software Engineer", image: "/blankprofile.png"  },
    { name: "Alex Law", role: "Full-Time Software Engineer", image: "/blankprofile.png"  },
    { name: "Zara Jaferi", role: "Full-Time Software Engineer", image: "/blankprofile.png"  },
    { name: "Jenelia Leo", role: "Full-Time Software Engineer", image: "/jeneliaprofile.png"  },
    { name: "Andi Kurtiqi", role: "Scrum Master", image: "/blankprofile.png"  },
    { name: "Elliot Ghidall", role: "Product Owner", image: "/blankprofile.png"  },
    { name: "Sylvia Jacobs", role: "Project Manager", image: "/blankprofile.png"  },
    { name: "Sylvia Strayer", role: "Document Analyst", image: "/blankprofile.png"  },
]



export default function AboutUs() {
    return (
        <div className="space-y-8 max-w">
            <PageHeader title="About Us" />

            <div className="flex flex-col lg:flex-row gap-10 px-6 items-start">

                {/* Left Side*/}
                <div className="flex flex-col gap-10 lg:w-1/3">

                    {/* Course Info*/}
                    <div className="text-sm text-gray-600 ml-4 space-y-1 border-l-4 border-blue-400 pl-4 mt-4">
                        <p >WPI Computer Science Department</p>
                        <p>CS3733-D26 Software Engineering</p>
                        <p>Professor Wilson Wong</p>
                        <p>Team Coach: Phuong Tran</p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 leading-relaxed ml-4 pl-4 mt-.5 space-y-1 border-l-4 border-blue-500">
                        We are a team of ten WPI students collaborating with Hanover Insurance
                        to design and build a full-stack software solution as part of the CS3733
                        Software Engineering course. Our goal is to deliver a scalable, secure,
                        and user-friendly system that meets real-world business needs while
                        applying the principles and practices of modern software engineering.
                    </p>

                    {/* Description */}
                    <p className="text-sm text-gray-500 leading-relaxed ml-4 pl-4 mt-0.5 space-y-1 border-l-4 border-blue-600">
                        Our goal is to deliver a scalable, secure,
                        and user-friendly system that meets real-world business needs while
                        applying the principles and practices of modern software engineering.
                    </p>

                    {/* Acknowledgements */}
                    <div className="pl-4 mt-0.5">
                        <h2 className="text-lg font-semibold mb-2">Acknowledgements</h2>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            We would like to thank Hanover Insurance and their representatives,
                            Brandon Roche (Deputy CIO), and Meaghan Jenket (Principal Business Architect),
                            for their support, guidance, and feedback through this project.
                        </p>
                    </div>

                </div>


                {/* Right Section */}
                <div className="lg:w-2/3">
                    <h2 className="text-xl font-semibold mb-5">Our Team</h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {teamMembers.map((member) => (
                            <Card
                                key={member.name}
                                className="flex flex-col items-center gap-3 !p-4 rounded-xl hover:shadow-md transition-shadow duration-200"
                            >
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0 bg-gray-100"
                                />
                                <div className="text-center min-w-0 w-full">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {member.name}
                                    </p>
                                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium leading-tight">
                                        {member.role}
                                    </span>
                                </div>
                            </Card>

                        ))}

                    </div>
                </div>




            </div>

        </div>

    )

}