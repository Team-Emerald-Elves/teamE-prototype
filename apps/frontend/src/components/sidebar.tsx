import {  Link } from 'react-router-dom';
import '../app.css'

function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar-header">Sidebar</div>
            <ul className="sidebar-nav">
                <Link className="nav-link" to="/"> Home </Link>
                <Link className="nav-link" to="/documents"> Documents </Link>
                <Link className="nav-link" to="/employee-management"> Employee Management </Link>
            </ul>
        </div>
    )
}

export default Sidebar;