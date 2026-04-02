import {  Link } from 'react-router-dom';
import '../app.css'

function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar-header">Sidebar</div>
            <ul className="sidebar-nav">
                <Link className="nav-page" to="/"> Home </Link>
                <Link className="nav-page" to="/documents"> Documents </Link>
                <Link className="nav-page" to="/employee"> Employee Management </Link>
                <Link className="nav-link" to="/underwriter-dummy"> Desktop Management Tool </Link>
                <Link className="nav-link" to="/underwriter-dummy"> States on Hold </Link>
                <Link className="nav-link" to="/underwriter-dummy"> RiskMeter Online </Link>
                <Link className="nav-link" to="/underwriter-dummy"> ISOnet Website </Link>
                <Link className="nav-link" to="/underwriter-dummy"> Forms Knowledge Base </Link>
                <Link className="nav-link" to="/underwriter-dummy"> Experience & Schedule Rating Plans </Link>
                <Link className="nav-link" to="/underwriter-dummy"> Property View </Link>
                <Link className="nav-link" to="/underwriter-dummy"> Coastal Guidelines </Link>
                <Link className="nav-link" to="/underwriter-dummy"> IPS(Image & Processing System) </Link>
                <Link className="nav-link" to="/underwriter-dummy"> Underwriting Workstation </Link>



            </ul>
        </div>
    )
}

export default Sidebar;