import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale
} from "chart.js";
import "./CSS/visualization.css";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale
);

const Visualization = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:8000/dashboard-stats")
            .then((res) => setStats(res.data))
            .catch((err) => console.error(err));
    }, []);

    if (!stats) return <p className="loading">Loading...</p>;
    const classroomTypes = stats.classroom_types || [];
    const avgSubjects = stats.avg_subjects_per_faculty || 0;

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">📊 Dashboard</h1>

            {/* Stats Cards */}
            <div className="cards">
                <div className="card blue">
                    <h2>Faculties</h2>
                    <p>{stats.faculty_count || 0}</p>
                </div>
                <div className="card green">
                    <h2>Classrooms</h2>
                    <p>{stats.classroom_count || 0}</p>
                </div>
                <div className="card yellow">
                    <h2>Subjects</h2>
                    <p>{stats.subject_count || 0}</p>
                </div>
                <div className="card purple">
                    <h2>Batches</h2>
                    <p>{stats.batch_count || 0}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="charts">
                {/* Classroom Types Pie Chart */}
                <div className="chart-card">
                    <h2>Classroom Types</h2>
                    <Pie
                        data={{
                            labels: classroomTypes.map((c) => c._id),
                            datasets: [
                                {
                                    data: classroomTypes.map((c) => c.count),
                                    backgroundColor: ["#60a5fa", "#34d399", "#f87171", "#a78bfa", "#facc15"]
                                }
                            ]
                        }}
                        options={{ responsive: true, plugins: { legend: { position: "bottom" } } }}
                    />
                </div>

                {/* Avg Subjects per Faculty */}
                <div className="chart-card">
                    <h2>Avg Subjects per Faculty</h2>
                    <Bar
                        data={{
                            labels: ["Average"],
                            datasets: [
                                {
                                    label: "Subjects",
                                    data: [avgSubjects],
                                    backgroundColor: "#fbbf24"
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            plugins: { legend: { display: false } },
                            scales: { y: { beginAtZero: true } }
                        }}
                        redraw
                    />
                </div>

            </div>
        </div>
    );
};

export default Visualization;
