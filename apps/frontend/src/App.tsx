import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.tsx";
import Documents from "./pages/documents.tsx";
import Profile from "./pages/profile.tsx";
import UnderwriterDummy from "./pages/underwriterdummypage.tsx";
import BusinessDummy from "./pages/buisnessanalystdummy.tsx";
import Navbar from "./components/navbar.tsx";
import LinksPage from "./pages/links.tsx";
import LoginSignup from "./pages/login-signup.tsx";
import NotFound from "./pages/not-found.tsx";
import "./App.css";
import UserManagementPage from "@/pages/user-management-page.tsx";
import Footer from "./components/footer.tsx";
import FavoritesPage from "./pages/favoritespage.tsx";
import StatisticsPage from "./pages/statisticsPage.tsx";
import { Show, useAuth, UserButton } from "@clerk/react";
//import CenterDiv from "./components/center-div.tsx";
import CalendarPage from "@/pages/calendar.tsx";
import AboutUs from "@/pages/aboutus.tsx";
import Credits from "@/pages/credits.tsx";
import qmgr from "./lib/querymgr.ts";
import EBot from "./components/EBot.tsx";

function App() {
    qmgr.auth(useAuth());
    return (
        <BrowserRouter>
            <Show when="signed-out">
                <Routes>
                    <Route path="/login" element={<LoginSignup />} />
                </Routes>
                <LoginSignup />
            </Show>

            <Show when="signed-in">
                {/* Wait for me to load */}
                <div className="app">
                    <Navbar>
                        <UserButton />
                    </Navbar>

                    <main className="main">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/documents" element={<Documents />} />
                            <Route
                                path="/employee-management"
                                element={<UserManagementPage />}
                            />
                            <Route
                                path="/underwriter-dummy"
                                element={<UnderwriterDummy />}
                            />
                            <Route
                                path="/business-dummy"
                                element={<BusinessDummy />}
                            />
                            <Route path="/links" element={<LinksPage />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="*" element={<NotFound />} />
                            <Route
                                path="/favorites"
                                element={<FavoritesPage />}
                            />
                            <Route
                                path="/statistics"
                                element={<StatisticsPage />}
                            />
                            <Route
                                path="/calendar"
                                element={<CalendarPage />}
                            />
                            <Route path="/aboutus" element={<AboutUs />} />
                            <Route path="/credits" element={<Credits />} />
                        </Routes>
                    </main>
                    <EBot />
                    <Footer />
                </div>
            </Show>
        </BrowserRouter>
    );
}

export default App;
