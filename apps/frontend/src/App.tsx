<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home.tsx';
import Documents from './components/documents.tsx';
import EmployeeManagement from "./components/employee.tsx"
import Sidebar from './components/sidebar.tsx';
=======
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home.tsx';
import Documents from './pages/documents.tsx';
import EmployeeManagement from "./pages/employee.tsx"

>>>>>>> main
import './App.css'

function App() {


  return (
<<<<<<< HEAD
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
=======
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

>>>>>>> main
  )
}

export default App
