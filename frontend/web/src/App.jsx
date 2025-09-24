import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import InsertData from "./InsertData";
import ViewData from "./ViewData";
import GenerateTT from "./GenerateTT";
import ViewTT from "./ViewTT";
import Visualization from "./Visualization";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<ViewData />} />
          <Route path="insert" element={<InsertData />} />
          <Route path="generate" element={<GenerateTT />} />
          <Route path="view-timetable" element={<ViewTT />} />
          <Route path="visualization" element={<Visualization/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
