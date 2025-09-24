import React, { useState } from "react";
import axios from "axios";
import "./CSS/generatett.css";
import { useNavigate } from "react-router-dom";

const GenerateTT = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [lastGenerated, setLastGenerated] = useState(null);
    const nav = useNavigate();
    const handleGenerate = async () => {
        setLoading(true);
        setMessage("");
        try {
            await axios.get("http://localhost:8000/generate-timetable");
            const now = new Date().toLocaleString();
            setLastGenerated(now);
            setMessage("✅ Timetable generated successfully! You can view it on the 'View Timetable' page.");
        } catch (err) {
            console.error(err);
            setMessage("❌ Failed to generate timetable. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="generate-container">
            <div className="notice-box">
                <p>⚠️ Please review your current data (Faculty, Subjects, Classrooms, etc.) before generating a new timetable.</p>
                <a className="review-link" onClick={()=> nav('dashboard/view-data')}>👉 Review Data</a>
            </div>

            <button
                onClick={handleGenerate}
                disabled={loading}
                className="generate-btn"
            >
                {loading ? "Generating..." : "Generate Timetable"}
            </button>

            {loading && <p className="loading-text">Please wait, generating timetable...</p>}

            {message && <p className="result-text">{message}</p>}

            {lastGenerated && (
                <p className="timestamp">🕒 Last generated on: {lastGenerated}</p>
            )}
        </div>
    );
};

export default GenerateTT;
