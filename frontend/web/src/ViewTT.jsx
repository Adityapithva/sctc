import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/viewtt.css";

const ViewTT = () => {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const res = await axios.get("http://localhost:8000/get-timetable");
                setTimetable(res.data.timetable);
                console.log(res.data);
            } catch (err) {
                console.error(err);
                setError("❌ Failed to load timetable. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTimetable();
    }, []);

    if (loading) {
        return <p className="loading">⏳ Loading timetable...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="timetable-container">
            <h2>📅 Timetable</h2>
            {timetable.length === 0 ? (
                <p>No timetable found. Please generate one first.</p>
            ) : (
                <table className="timetable-table">
                    <thead>
                        <tr>
                            <th>Batch</th>
                            <th>Day</th>
                            <th>Time Slot</th>
                            <th>Subject</th>
                            <th>Faculty</th>
                            <th>Room</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timetable.map((row, index) => (
                            <tr key={index}>
                                <td>{row.batch}</td>
                                <td>{row.day}</td>
                                <td>{row.time_slot}</td>
                                <td>{row.sub_code}</td>
                                <td>{row.faculty_id}</td>
                                <td>{row.room_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ViewTT;
