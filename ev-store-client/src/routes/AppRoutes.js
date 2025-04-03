import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes here as needed */}
    </Routes>
)

export default AppRoutes;