import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home.tsx';
import Documents from './components/documents.tsx';
import EmployeeManagement from "./components/employee.tsx"
import Sidebar from './components/sidebar.tsx';
import './App.css'

function App() {


  return (
    <BrowserRouter >
        <div className={"app"}>
            <Sidebar />
            <main className="main">
                <Routes >
                    <Route path="/" element={<Home />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/employee-management" element={<EmployeeManagement />} />
                </Routes>
            </main>
        </div>
    </BrowserRouter>
  )
}

export default App
