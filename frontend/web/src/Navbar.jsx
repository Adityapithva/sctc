import React from "react";
import { Link } from "react-router-dom";
import "./CSS/navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo">EduPortal</div>
            <ul className="navbar-links">
                <li>
                    <Link to="/dashboard/insert">Insert Data</Link>
                </li>
                <li>
                    <Link to="/dashboard">View Data</Link>
                </li>
                <li>
                    <Link to="/dashboard/generate">Generate Timetable</Link>
                </li>
                <li>
                    <Link to="/dashboard/view-timetable">View Timetable</Link>
                </li>
                <li>
                    <Link to="/dashboard/visualization">Visualization</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
