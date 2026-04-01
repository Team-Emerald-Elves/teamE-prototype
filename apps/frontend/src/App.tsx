import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home.tsx';
import Documents from './pages/documents.tsx';
import EmployeeManagement from "./pages/employee.tsx"

import './App.css'

function App() {


  return (
        <BrowserRouter>
          <nav>
            <Link to="/"> Home </Link>
            <Link to="/documents"> Documents </Link>
            <Link to="/employee-management"> Employee Management </Link>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/employee-management" element={<EmployeeManagement />} />
          </Routes>
        </BrowserRouter>


  )
}

export default App
