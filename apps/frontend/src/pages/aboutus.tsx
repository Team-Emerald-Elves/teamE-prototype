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
            <PageHeader title="About Us" description="WPI CS3733 Software Engineering Project Overview"></PageHeader>

            {/* Course Info */}
            <div className="text-sm text-gray-600 ml-9 space-y-1 border-l-4 border-blue-500 pl-4">
                <p >WPI Computer Science Department</p>
                <p>CS3733-D26 Software Engineering</p>
                <p>Professor Wilson Wong</p>
                <p>Team Coach: Phuong Tran</p>
            </div>

            {/* Team Section */}
            <div>
                <h2 className="text-xl ml-9 font-semibold mb-5">Our Team</h2>

                <div className="px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member) => (
                            <Card
                                key={member.name}
                                className="flex flex-row items-center gap-4 !p-4 h-24 rounded-xl hover:shadow-md transition-shadow duration-200"
                            >
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-19 h-19 rounded-lg object-cover border border-gray-200 shrink-0 bg-gray-100 self-center"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {member.name}
                                        </p>
                                        <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                                            {member.role}
                                        </span>
                                    </div>
                            </Card>

                        ))}

                    </div>
                </div>
            </div>



            {/* Acknowledgements */}
            <div className="px-6">
                <div className="bg-gray-50 p-6 rounded-2xl border">
                    <h2 className="text-lg font-semibold mb-2">Acknowledgements</h2>
                    <p className="text-gray-700 leading-relaxed">
                        We would like to thank Hanover Insurance and their representatives,
                        Brandon Roche (Deputy CIO), and Meaghan Jenket (Principal Business Architect),
                        for their support, guidance, and feedback through this project.
                    </p>
                </div>
            </div>

        </div>

    )

}