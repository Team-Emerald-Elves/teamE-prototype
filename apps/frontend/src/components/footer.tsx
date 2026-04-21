function Footer() {
    return (
        <footer className="border-t bg-primary mt-16">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* top grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

                    {/* company */}
                    <div>
                        <h3 className="font-semibold text-[#E9A565] mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-white">
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Press</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>

                    {/* insurance */}
                    <div>
                        <h3 className="font-semibold text-[#E9A565] mb-4">Insurance</h3>
                        <ul className="space-y-2 text-sm text-white">
                            <li><a href="#">Auto Insurance</a></li>
                            <li><a href="#">Home Insurance</a></li>
                            <li><a href="#">Business Insurance</a></li>
                            <li><a href="#">Claims</a></li>
                        </ul>
                    </div>

                    {/* resources */}
                    <div>
                        <h3 className="font-semibold text-[#E9A565] mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm text-white">
                            <li><a href="#">File a Claim</a></li>
                            <li><a href="#">Find an Agent</a></li>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">FAQs</a></li>
                        </ul>
                    </div>

                    {/* legal */}
                    <div>
                        <h3 className="font-semibold text-[#E9A565] mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-white">
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Use</a></li>
                            <li><a href="#">Accessibility</a></li>
                        </ul>
                    </div>

                </div>

                {/* bottom bar */}
                <div className="mt-10 pt-6 border-t flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
                    <div className="flex gap-4 mt-3 sm:mt-0">
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Terms</a>
                        <a href="#" className="hover:text-white">Security</a>
                    </div>

                </div>
            </div>
        </footer>
    )
}

export default Footer