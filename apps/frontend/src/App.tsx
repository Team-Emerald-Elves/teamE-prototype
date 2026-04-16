import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home.tsx';
import Documents from './pages/documents.tsx';
import Profile from './pages/profile.tsx';
import UnderwriterDummy from './pages/underwriterdummypage.tsx'
import BusinessDummy from './pages/buisnessanalystdummy.tsx'
import Navbar from './components/navbar.tsx'
import Links from './pages/links.tsx'
import NotFound from './pages/not-found.tsx'
import './App.css'
import UserManagementPage from "@/pages/user-management-page.tsx";

import FavoritesPage from "./pages/favoritespage.tsx";


import {Show, SignInButton, SignUpButton, UserButton} from '@clerk/react'
import CenterDiv from "./components/center-div.tsx";

function App() {

    return (
        <BrowserRouter>
            <Show when="signed-out">
                <Home />
                <CenterDiv>
                    <SignInButton>
                        <button className="clerk-button">Sign in</button>
                    </SignInButton>
                    <SignUpButton>
                        <button className="clerk-button">Sign up</button>
                    </SignUpButton>
                </CenterDiv>
            </Show>

            <Show when="signed-in">
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
                                <Route path="/favorites" element={<FavoritesPage />} />
                            </Routes>
                        </main>
                    </div>
            </Show>
        </BrowserRouter>
    )
}


export default App
