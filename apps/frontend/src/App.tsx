import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home.tsx';
import Documents from './pages/documents.tsx';
import EmployeeManagement from "./pages/employee.tsx"
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
