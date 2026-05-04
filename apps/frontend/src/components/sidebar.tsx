import { Link } from "react-router-dom";
import "../App.css";
type sidebarProps = {
    role: string;
};
function Sidebar(props: sidebarProps) {
    if (props.role === "u") {
        return (
            <div className="sidebar">
                <div className="sidebar-header">Sidebar</div>
                <ul className="sidebar-nav">
                    <Link className="nav-page" to="/">
                        {" "}
                        Home{" "}
                    </Link>
                    <Link className="nav-page" to="/documents">
                        {" "}
                        Documents{" "}
                    </Link>
                    <Link className="nav-page" to="/employee-management">
                        {" "}
                        Employee Management{" "}
                    </Link>
                    <Link className="nav-link" to="/underwriter-dummy">
                        {" "}
                        Desktop Management Tool{" "}
                    </Link>
                    <Link className="nav-link" to="/underwriter-dummy">
                        {" "}
                        States on Hold{" "}
                    </Link>
                    <Link className="nav-link" to="/underwriter-dummy">
                        {" "}
                        RiskMeter Online{" "}
                    </Link>
                    <Link className="nav-link" to="/underwriter-dummy">
                        {" "}
                        ISOnet Website{" "}
                    </Link>
                    <Link className="nav-link" to="/underwriter-dummy">
                        {" "}
                        Forms Knowledge Base{" "}
                    </Link>
                    <Link className="nav-link" to="/underwriter-dummy">
                        {" "}
                        Experience & Schedule Rating Plans{" "}
                    </Link>
                    <Link className="nav-link" to="/underwriter-dummy">
                        {" "}
                        Property View{" "}
                    </Link>
                    <Link className="nav-link" to="/underwriter-dummy">
                        {" "}
                        Coastal Guidelines{" "}
                    </Link>
                    <Link className="nav-link" to="/underwriter-dummy">
                        {" "}
                        IPS(Image & Processing System){" "}
                    </Link>
                    <Link className="nav-link" to="/underwriter-dummy">
                        {" "}
                        Underwriting Workstation{" "}
                    </Link>
                </ul>
            </div>
        );
    } else {
        return (
            <div className="sidebar">
                <div className="sidebar-header">Sidebar</div>
                <ul className="sidebar-nav">
                    <Link className="nav-page" to="/">
                        {" "}
                        Home{" "}
                    </Link>
                    <Link className="nav-page" to="/documents">
                        {" "}
                        Documents{" "}
                    </Link>
                    <Link className="nav-page" to="/employee-management">
                        {" "}
                        Employee Management{" "}
                    </Link>
                    <Link className="nav-link" to="/buisness-dummy">
                        {" "}
                        States on Hold
                    </Link>
                    <Link className="nav-link" to="/buisness-dummy">
                        {" "}
                        Forms Knowledge Base{" "}
                    </Link>
                    <Link className="nav-link" to="/buisness-dummy">
                        {" "}
                        IPS(Image & Processing System){" "}
                    </Link>
                    <Link className="nav-link" to="/buisness-dummy">
                        {" "}
                        Underwriting Workstation{" "}
                    </Link>
                    <Link className="nav-link" to="/buisness-dummy">
                        {" "}
                        CPP Rater Resource Site{" "}
                    </Link>
                    <Link className="nav-link" to="/buisness-dummy">
                        {" "}
                        PMS URG{" "}
                    </Link>
                    <Link className="nav-link" to="/buisness-dummy">
                        {" "}
                        Kentucky Tax and Tax Exemption Aid{" "}
                    </Link>
                    <Link className="nav-link" to="/buisness-dummy">
                        {" "}
                        Experience & Schedule Rating Plans{" "}
                    </Link>
                    <Link className="nav-link" to="/buisness-dummy">
                        {" "}
                        Error Lookup Tool{" "}
                    </Link>
                    <Link className="nav-link" to="/buisness-dummy">
                        {" "}
                        Workaround Tool{" "}
                    </Link>
                </ul>
            </div>
        );
    }
}

export default Sidebar;
