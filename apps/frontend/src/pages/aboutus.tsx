import PageHeader from "../components/page-header.tsx";
import { Card } from "@/components/ui/card.tsx";
import { useEffect, useState } from "react";

const teamMembers = [
    {
        name: "Brycen Pina",
        role: "Lead Software Engineer",
        image: "/brycenprofile.png",
        linkedin: "https://www.linkedin.com/in/brycen-pina/",
        quote: "Always bear in mind that your own resolution to succeed, is more important than any other one thing. — Abraham Lincoln",
    },
    {
        name: "Anastasia Kelnik",
        role: "Assistant Lead Software Engineer",
        image: "/anastasiaprofile.png",
        linkedin: "https://www.linkedin.com/in/anastasia-kelnik-4773a8265/",
        quote: "How lucky I am  to have something that makes saying goodbye so hard. - Winnie the Pooh",
    },
    {
        name: "Colin Teahan",
        role: "Assistant Lead Software Engineer",
        image: "/colinprofile.png",
        linkedin: "",
        quote: "To doubt everything or to believe everything are two equally convenient solutions; both dispense with the necessity of reflection. -Jules Henri Poincaré",
    },
    {
        name: "Alex Law",
        role: "Full-Time Software Engineer",
        image: "/alexprofile.png",
        linkedin: "https://www.linkedin.com/in/alexandra-m-law-1bb533377/",
        quote: "Be 1% better than you were yesterday.",
    },
    {
        name: "Zara Jaferi",
        role: "Full-Time Software Engineer",
        image: "/zaraprofile.png",
        linkedin: "https://www.linkedin.com/in/zara-jaferi-841473251/",
        quote: "Stop trying. Take long walks. Look at scenery. Doze off at noon. Don't even think about flying. And then, pretty soon, you'll be flying again. - Ursula, Kiki's Delivery Service",
    },
    {
        name: "Jenelia Leo",
        role: "Full-Time Software Engineer",
        image: "/jeneliaprofile.png",
        linkedin: "https://www.linkedin.com/in/jenelialeo",
        quote: "How you spend your days is how you spend your life. - Annie Dillard",
    },
    {
        name: "Andi Kurtiqi",
        role: "Scrum Master",
        image: "/andiprofile.png",
        linkedin: "https://www.linkedin.com/in/kurtiqi-andi",
        quote: "Comparison is the theif of joy. -Theodore Roosevelt",
    },
    {
        name: "Elliot Ghidall",
        role: "Product Owner",
        image: "/elliotprofile.png",
        linkedin: "https://www.linkedin.com/in/elliot-ghidali-482132260/",
        quote: "We are trying to prove ourselves wrong as quickly as possible, because only in that way can we find progress. ― Richard P. Feynman",
    },
    {
        name: "Sylvia Jacobs",
        role: "Project Manager",
        image: "/sylviajprofile.png",
        linkedin: "https://www.linkedin.com/in/sylvia-jacobs-a6157a355/",
        quote: "One day we'll look back at where we started and be amazed by how far we've come - Technoblade",
    },
    {
        name: "Sylvia Strayer",
        role: "Document Analyst",
        image: "/sylviasprofile.png",
        linkedin: "",
        quote: "The law, in its majestic equality, forbids rich and poor alike to sleep under bridges, to beg in the streets, and to steal their bread. ― Anatole France",
    },
];

export default function AboutUs() {
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    return (
        <div className="space-y-8 max-w">
            <PageHeader title="About Us" />

            {/* popup */}
            {selected && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setSelected(null)}
                >
                    <div
                        key={selected.name}
                        className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-4 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selected.image}
                            alt={selected.name}
                            className="w-24 h-24 rounded-full object-cover border border-gray-200"
                            draggable={false}
                        />
                        <div className="text-center">
                            <p className="font-semibold text-gray-900 text-lg">
                                {selected.name}
                            </p>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                                {selected.role}
                            </span>
                        </div>

                        <p className="text-gray-600 text-center italic">
                            "{selected.quote}"
                        </p>

                        {selected.linkedin && (

                            <a href={selected.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white text-sm font-medium rounded-lg hover:bg-[#004182] transition-colors"
                            >
                            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                            <path d="M20.45 20.45h-3.554v-5.569c0-1.328-.026-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.354V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.284zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            LinkedIn
                            </a>
                            )}


                        <button
                            onClick={() => setSelected(null)}
                            className="mt-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <div className="flex flex-col lg:flex-row gap-10 px-6 items-start">
                {/* Left Section */}
                <div className="lg:w-2/3 pl-4">
                    <h2 className="text-xl font-semibold mb-5 pl-4">
                        Meet Our Team!
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                        {teamMembers.map((member) => (
                            <Card
                                key={member.name}
                                className="flex flex-col items-center gap-3 !p-4 rounded-xl hover:shadow-md transition-shadow duration-200"
                                onClick={() => setSelected(member)}
                            >
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-35 h-35 min-h-[140px] rounded-lg object-cover border border-gray-200 shrink-0 bg-gray-100"
                                    draggable={false}
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

                {/* Right Side*/}
                <div className="flex flex-col gap-10 lg:w-1/3">
                    {/* Course Info*/}
                    <div className="text-xl text-gray-600 ml-4 space-y-1 border-l-4 border-blue-400 pl-4 mt-23">
                        <p>WPI Computer Science Department</p>
                        <p>CS3733-D26 Software Engineering</p>
                        <p>Professor Wilson Wong</p>
                        <p>Team Coach: Phuong Tran</p>
                    </div>

                    {/* Description */}
                    <p className="text-lg text-gray-500 leading-relaxed ml-4 pl-4 mt-8.5 space-y-1 border-l-4 border-blue-500">
                        We are a team of ten WPI students collaborating with
                        Hanover Insurance to design and build a full-stack
                        software solution as part of the CS3733 Software
                        Engineering course. Our goal is to deliver a scalable,
                        secure, and user-friendly system that meets real-world
                        business needs while applying the principles and
                        practices of modern software engineering.
                    </p>

                    {/* Acknowledgements */}
                    <div className="pl-4 mt-.5">
                        <h2 className="text-xl font-semibold mb-2">
                            Acknowledgements
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            We would like to thank Hanover Insurance and their
                            representatives, Brandon Roche (Deputy CIO), and
                            Meaghan Jenket (Principal Business Architect), for
                            their support, guidance, and feedback through this
                            project.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
