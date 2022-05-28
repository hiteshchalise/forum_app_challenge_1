import React from "react";
import { Route, Routes } from "react-router-dom";
const Home = React.lazy(() => import("../components/home"));

export const RoutesProvider = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:postId" element={<>Details</>} />
        </Routes>
    );
};
