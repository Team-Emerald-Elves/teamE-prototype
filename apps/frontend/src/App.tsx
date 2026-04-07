import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home.tsx';
import Documents from './pages/documents.tsx';
import EmployeeManagement from "./pages/employee.tsx"
import UnderwriterDummy from './pages/underwriterdummypage.tsx'
import BusinessDummy from './pages/buisnessanalystdummy.tsx'
import Navbar from './components/navbar.tsx'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react";
import './App.css'
import UserManagementPage from "@/pages/user-management-page.tsx";

function App() {
    const [role, setRole] = useState("u");
  return (
    <BrowserRouter >
        <div className="radio">
        <RadioGroup value={role} onValueChange={setRole}>
            <div className="flex items-center gap-3">
                <RadioGroupItem value="u" id="u" />
                <Label htmlFor="u">Underwriter</Label>
            </div>
            <div className="flex items-center gap-3">
                <RadioGroupItem value="b" id="b" />
                <Label htmlFor="b">Business Analyst</Label>
            </div>
        </RadioGroup>
        </div>
        <div className={"app"}>
            <Navbar role={role}/>
            <main className="main">
                <Routes >
                    <Route path="/" element={<Home role={role}/>} />
                    <Route path="/documents" element={<Documents role={role} />} />
                    <Route path="/employee-management" element={<EmployeeManagement />} />
                    <Route path ="/underwriter-dummy" element = {<UnderwriterDummy />} />
                    <Route path ="/business-dummy" element = {<BusinessDummy />} />
                    <Route path ="/user-management-page" element = {<UserManagementPage />} />
                </Routes>
            </main>
        </div>
    </BrowserRouter>

  )
}

export default App
