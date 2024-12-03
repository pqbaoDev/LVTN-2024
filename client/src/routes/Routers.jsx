import Dashboard from "../page/Dashboard/Dashboard"
import Login from "../page/Login";
import Register from "../page/Signup"
import ProtectedRoute from "./ProtectedRoute";
import Orders from "../page/Orders/Order";
import Employees from "../page/Employees/Employee";
import Product from "../page/Products/Product";
import Users from "../page/Users/User";
import Promotions from "../page/Promotions/promotion";
import Warranty from "../page/Warranty/warranty";
import Warehouse from "../page/Warehouses/warehouse";
import WarehouseCategory from "../page/Warehouses/category/category";
import WarehouseManu from "../page/Warehouses/manufacture/manufacture";
import WarehouseProduct from "../page/Warehouses/product/product";
import Reviews from "../page/reviews/review";
import Positions from "../page/Position/Position";



import {Routes,Route}from "react-router-dom"
const Routers = () => {
    return <Routes>
        <Route path="/" element={<ProtectedRoute  allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute  allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
        <Route path="/login" element={ <Login/> } />
        <Route path="/register" element={ <Register/>} />
        <Route path="/product" element={<ProtectedRoute  allowedRoles={['admin']}><Product/></ProtectedRoute> } />
        <Route path="/user" element={ <ProtectedRoute  allowedRoles={['admin']}><Users /></ProtectedRoute>} />
        <Route path="/employee" element={<ProtectedRoute  allowedRoles={['admin']}><Employees/></ProtectedRoute> } />
        <Route path="/order" element={<ProtectedRoute  allowedRoles={['admin']}><Orders/></ProtectedRoute>} />
        <Route path="/promotion" element={<ProtectedRoute  allowedRoles={['admin']}><Promotions/></ProtectedRoute>} />
        <Route path="/warranty" element={<ProtectedRoute  allowedRoles={['admin']}><Warranty/></ProtectedRoute>} />
        <Route path="/warehouse" element={<ProtectedRoute  allowedRoles={['admin']}><Warehouse/></ProtectedRoute>} />
        <Route path="/warehouse/categories" element={<ProtectedRoute  allowedRoles={['admin']}><WarehouseCategory/></ProtectedRoute>} />
        <Route path="/warehouse/suppliers" element={<ProtectedRoute  allowedRoles={['admin']}><WarehouseManu/></ProtectedRoute>} />
        <Route path="/warehouse/product" element={<ProtectedRoute  allowedRoles={['admin']}><WarehouseProduct/></ProtectedRoute> } />
        <Route path="/feedback" element={<ProtectedRoute  allowedRoles={['admin']}><Reviews/></ProtectedRoute> } />
        <Route path="/employee/position" element={<ProtectedRoute  allowedRoles={['admin']}><Positions/></ProtectedRoute> } />


    </Routes>
}

export default Routers;
