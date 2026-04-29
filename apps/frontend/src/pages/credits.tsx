import PageHeader from "../components/page-header.tsx"
import { Card } from "@/components/ui/card.tsx"
import { useEffect } from 'react';

const pernStack = [
    { title: "PostgreSQL", image: "/postgreSQL.png", description: "Relational Database for reliable data storage." },
    { title: "Express", image: "/Expressjs.png", description: "Minimal and flexible Node.js web application framework." },
    { title: "React", image: "/React-icon.png", description: "Library for building dynamic UIs." },
    { title: "Node.js", image: "/nodejs-icon.png", description: "Runtime program for server-side part of program." },
]

const additionalTools = [
    { title: "Vite", image: "/Vitejs-logo.svg.png", description: "Fast frontend tooling and development server." },
    { title: "Tailwind CSS", image: "/Tailwind_CSS_Logo.svg.png", description: "Utility-first CSS framework for styling." },
    { title: "Clerk", image: "/Clerk.png", description: "Authentication and authorization platform." },
    { title: "ShadCN", image: "/ShadCN.png", description: "Beautifully styled React components." },
    { title: "React Router", image: "/react-router.png", description: "Routing library for React." },
    { title: "Render", image: "/render-render.png", description: "Service for compute and database hosting." },
    { title: "Postman", image: "/Postman.png", description:"API platform for building and testing requests."},
    { title: "WebStorm", image: "/Webstorm.png", description:"Intelligent IDE for modern JavaScript development."},
    { title: "VSCode", image: "/vscode.png", description:"Lightweight and extensible source code editor."},
    { title: "SQL", image: "/SQL.png", description:"Standard language for querying relational databases.    "},
    { title: "Prisma", image: "/prismaHD.png", description:"Type-safe ORM for streamlined database access." }
]

function CreditCard({ title, image, description }: { title: string; image: string; description: string }) {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    return (
        <Card className="flex flex-col items-center justify-center text-center p-6 gap-4 bg-white rounded-2xl shadow-sm min-h-[200px] w-full">
            <div className="h-16 w-16 flex items-center justify-center">
                {image ? (
                    <img src={image} alt={title} className="max-h-full max-w-full object-contain" />
                ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-100" />
                )}
            </div>
            <div>
                <h3 className="font-bold text-lg text-[#003151]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {title}
                </h3>
                <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {description}
                </p>
            </div>
        </Card>
    )
}

export default function Credits() {
    return (
        <div className="space-y-8">
            <PageHeader title="Credit Page" />

            {/* PERN Stack Section */}
            <section className="space-y-4 px-6">
                <h2
                    className="text-2xl font-semibold text-[#003151]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    PERN Stack
                </h2>
                <div className="grid gap-4 px-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
                    {pernStack.map((item) => (
                        <CreditCard key={item.title} {...item} />
                    ))}
                </div>
            </section>

            {/* Additional Tools Section */}
            <section className="space-y-4 px-6">
                <h2
                    className="text-2xl font-semibold text-[#003151]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    Additional Tools, Libraries, and Frameworks
                </h2>
                <div className="grid gap-4 px-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
                    {additionalTools.map((item) => (
                        <CreditCard key={item.title} {...item} />
                    ))}
                </div>
            </section>
        </div>
    )
}