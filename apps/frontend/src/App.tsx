import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home.tsx';
import Documents from './pages/documents.tsx';
import Profile from './pages/profile.tsx';
import UnderwriterDummy from './pages/underwriterdummypage.tsx'
import BusinessDummy from './pages/buisnessanalystdummy.tsx'
import Navbar from './components/navbar.tsx'
import Links from './pages/links.tsx'
import LoginSignup from './pages/login-signup.tsx'
import NotFound from './pages/not-found.tsx'
import {useEffect, useState} from "react";
import './App.css'
import UserManagementPage from "@/pages/user-management-page.tsx";
import OutagePage from "@/pages/outage.tsx"

import {Show, SignInButton, SignUpButton, useAuth, UserButton} from '@clerk/react'
import CenterDiv from "./components/center-div.tsx";

function App() {
    // const [roles, setRoles] = useState<string[]>([]);
    // const { getToken, isSignedIn } = useAuth();
    // const [me, setMe] = useState(null);
    //
    // useEffect(() => {
    //     if (!isSignedIn) {
    //         setMe(null);
    //         return;
    //     }
    //
    //     async function load() {
    //         const token = await getToken();
    //
    //         const res = await fetch("http://localhost:3000/api/tests/me", {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
    //
    //         const data = await res.json();
    //         setMe(data);
    //         setRoles((data.me.roles as string[]).map((role: string) => role.toLowerCase()))
    //     }
    //
    //     load();
    // }, [isSignedIn, roles]);

    return (
        <BrowserRouter>
            <Show when="signed-out">
                <Routes>
                    <Route path = "/login" element={<LoginSignup/>} />
                </Routes>
                <LoginSignup />
                {/*<Home />
                <CenterDiv>
                    <SignInButton>
                        <button className="clerk-button">Sign in</button>
                    </SignInButton>
                    <SignUpButton>
                        <button className="clerk-button">Sign up</button>
                    </SignUpButton>
                </CenterDiv>*/}
            </Show>

            <Show when="signed-in">
                {/* Wait for me to load */}
                    <div className="app">
                        <Navbar >
                            <UserButton />
                        </Navbar>


                        <main className="main">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/documents" element={<Documents/>} />
                                <Route path="/employee-management" element={<UserManagementPage />} />
                                <Route path="/underwriter-dummy" element={<UnderwriterDummy />} />
                                <Route path="/business-dummy" element={<BusinessDummy />} />
                                <Route path="/links" element={<Links />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </main>
                    </div>

            </Show>
        </BrowserRouter>
    );
}


export default App
