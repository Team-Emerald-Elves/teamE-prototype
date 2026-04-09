import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home.tsx';
import Documents from './pages/documents.tsx';
import Profile from './pages/profile.tsx';
import UnderwriterDummy from './pages/underwriterdummypage.tsx'
import BusinessDummy from './pages/buisnessanalystdummy.tsx'
import Navbar from './components/navbar.tsx'
import Settings from './pages/settings.tsx'
import NotFound from './pages/not-found.tsx'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {useEffect, useState} from "react";
import './App.css'
import UserManagementPage from "@/pages/user-management-page.tsx";

import {Show, SignInButton, SignUpButton, useAuth, UserButton} from '@clerk/react'
import CenterDiv from "./components/center-div.tsx";

function App() {
    const [role, setRole] = useState("u");
    const { getToken } = useAuth()
    const [me, setMe] = useState()

    useEffect(() => {
        async function load() {
            const token = await getToken()

            const res = await fetch("http://localhost:3000/api/tests/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()
            setMe(data)
        }

        load()
    }, [])
    console.log(me)
    if (!me) {
        return null
    }


    return (
      <>
        <BrowserRouter >
            <Show when="signed-out">
                <Home role="none"/>
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
                {/*<div className="radio">*/}
                {/*<RadioGroup value={role} onValueChange={setRole}>*/}
                {/*    <div className="flex items-center gap-3">*/}
                {/*        <RadioGroupItem value="u" id="u" />*/}
                {/*        <Label htmlFor="u">Underwriter</Label>*/}
                {/*    </div>*/}
                {/*    <div className="flex items-center gap-3">*/}
                {/*        <RadioGroupItem value="b" id="b" />*/}
                {/*        <Label htmlFor="b">Business Analyst</Label>*/}
                {/*    </div>*/}
                {/*</RadioGroup>*/}
                {/*</div>*/}
                <div className={"app"}>

                    <Navbar role={role} me={me}>
                        <UserButton />
                    </Navbar>

                    <main className="main">
                        <Routes >
                            <Route path="/" element={<Home me={me} role={role}/>} />
                            <Route path="/documents" element={<Documents role={role} />} />
                            <Route path="/employee-management" element={<UserManagementPage />} />
                            <Route path ="/underwriter-dummy" element = {<UnderwriterDummy />} />
                            <Route path ="/business-dummy" element = {<BusinessDummy />} />
                            <Route path="/settings" element={<Settings me={me} />} />
                            <Route path ="/user-management-page" element = {<UserManagementPage />} />
                            <Route path ="/profile" element = {<Profile />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                </div>
            </Show>
        </BrowserRouter>
      </>
  )
}

export default App
