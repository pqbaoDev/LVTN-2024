import Home from "../page/Home"
import Login from "../page/Login";
import Register from "../page/Signup"
import ProtectedRoute from "./ProtectedRoute";
import Orders from "../page/Orders/Order";
import Employees from "../page/Employees/Employee";
import Product from "../page/Products/Product";
import Users from "../page/Users/User"



import {Routes,Route}from "react-router-dom"
const Routers = () => {
    return <Routes>
        <Route path="/" element={<ProtectedRoute allowedRoles={['admin']}><Home /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute allowedRoles={['admin']}><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/product" element={<Product/>} />
        <Route path="/user" element={<Users/>} />
        <Route path="/employee" element={<Employees/>} />
        <Route path="/order" element={<Orders/>} />

    </Routes>
}

export default Routers;
