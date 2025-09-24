/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import "./CSS/insertdata.css"; 

const InsertData = () => {
    const [file, setFile] = useState(null);
    const [collection, setCollection] = useState("faculty");
    const [message, setMessage] = useState("");

    const handleUpload = async () => {
        if (!file) return alert("Please select a CSV file");
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post(
                `http://localhost:8000/upload-csv/${collection}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setMessage(`${collection} data added successfully`);
        } catch (err) {
            setMessage("Upload failed: " + err.message);
        }
    };

    return (
        <div className="upload-card">
            <h2 className="upload-title">Upload CSV</h2>
            <select
                className="upload-select"
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
            >
                <option value="faculty">Faculty</option>
                <option value="subject">Subjects</option>
                <option value="classroom">Classrooms</option>
                <option value="batch">Batches</option>
            </select>
            <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
                className="upload-file"
            />
            <button onClick={handleUpload} className="upload-btn">
                Upload
            </button>
            {message && <p className="upload-message">{message}</p>}
        </div>
    );
};

export default InsertData;
