import Home from "../page/Home"
import Login from "../page/Login";
import Register from "../page/Signup"
import ProtectedRoute from "./ProtectedRoute"



import {Routes,Route}from "react-router-dom"
const Routers = () => {
    return <Routes>
        <Route path="/" element={<ProtectedRoute allowedRoles={['admin']}><Home /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute allowedRoles={['admin']}><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
    </Routes>
}

export default Routers;
