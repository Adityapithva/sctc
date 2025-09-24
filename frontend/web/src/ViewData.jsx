import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/viewdata.css";

function ViewData() {
    const [collectionName, setCollectionName] = useState("faculty"); // default
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://localhost:8000/get-data/${collectionName}`)
            .then((response) => {
                setData(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, [collectionName]);

    return (
        <div className="view-container">
            <h2>📊 View Data</h2>

            {/* 🔹 Dropdown for selecting collection */}
            <select
                className="dropdown"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
            >
                <option value="faculty">Faculty</option>
                <option value="batch">Batches</option>
                <option value="subject">Subjects</option>
                <option value="classroom">Classrooms</option>
            </select>

            {loading ? (
                <p>Loading data...</p>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                {data.length > 0 &&
                                    Object.keys(data[0]).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((row, index) => (
                                    <tr key={index}>
                                        {Object.values(row).map((value, i) => (
                                            <td key={i}>{value}</td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="100%">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ViewData;
