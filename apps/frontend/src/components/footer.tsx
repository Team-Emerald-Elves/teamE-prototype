import { Link } from "react-router-dom";
import { useState } from "react";
import { ManualPopup } from "./manual.tsx";

function FooterLink({
    to,
    children,
}: {
    to: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            to={to}
            className="hover:text-[#E9A565] transition-colors"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
            {children}
        </Link>
    );
}

function Footer() {
    const [manualOpen, setManualOpen] = useState(false);
    return (
        <>
            <ManualPopup open={manualOpen} onOpenChange={setManualOpen} />
            <footer className="border-t bg-primary mt-10">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* top grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                        {/* Hanover */}
                        <div className="-mt-1">
                            <img
                                src="/hanoverfooter.png"
                                alt="Hanover Insurance"
                                className="w-48 h-auto"
                                draggable={false}
                            />
                        </div>

                        {/* company */}
                        <div>
                            <h3 className="font-semibold text-[#E9A565] mb-4">
                                Company
                            </h3>
                            <ul className="space-y-2 text-sm text-white">

                                <li>
                                    <a href="#">440 Lincoln St</a>
                                </li>
                                <li>
                                    <a href="#">Worcester, MA</a>
                                </li>
                            </ul>
                        </div>

                        {/* pages */}
                        <div>
                            <h3 className="font-semibold text-[#E9A565] mb-4">Pages</h3>
                            <ul className="space-y-2 text-sm text-white">
                                <li><FooterLink to="/documents">Documents</FooterLink></li>
                                <li><FooterLink to="/links">Links</FooterLink></li>
                                <li><FooterLink to="/calendar">Calendar</FooterLink></li>
                                <li><FooterLink to="/employee-management">User Management</FooterLink></li>
                            </ul>
                        </div>


                        {/* resource */}
                        <div>
                            <h3 className="font-semibold text-[#E9A565] mb-4">
                                Resources
                            </h3>
                            <ul className="space-y-2 text-sm text-white">
                                <li>
                                    <button
                                        onClick={() => setManualOpen(true)}
                                        className="hover:text-[#E9A565] transition-colors"
                                    >
                                        Manual
                                    </button>
                                </li>
                                <li>
                                    <FooterLink to="/credits">
                                        Credits
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink to="/aboutus">
                                        About Us
                                    </FooterLink>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* bottom bar */}
                    <div className="mt-10 pt-6 border-t flex-col sm:flex-row justify-between items-center text-sm text-gray-500"></div>
                </div>
            </footer>
        </>
    );
}

export default Footer;
