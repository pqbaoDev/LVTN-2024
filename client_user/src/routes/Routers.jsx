import Login from "../page/Login";
import Products from "../page/products/products";
import ProductDetail from "../page/products/ProductDetail";
import Register from "../page/Register";
import Home from "../page/Home";
import Cart from "../page/Cart";
import Payment from "../page/payment";
import ResultPayment from "../page/ResultPayment";
import Account from "../page/user/Account";
import Vouchers from "../page/Voucher";
import ProtectedRoute from "./ProtectedRoute";


import {Routes,Route}from "react-router-dom";
const Routers = () => {
    return (
        <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/cart" element={<ProtectedRoute  allowedRoles={['user']}><Cart/></ProtectedRoute>} />
        <Route path="/checkout" element={<Payment/>} />
        <Route path="/order/vnpay_return" element={<ResultPayment/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/product" element={<Products/>} />
        <Route path="/product/detail" element={<ProductDetail/>} />
        <Route path="/users/profile/me" element={<Account/>} />
        <Route path="/voucher" element={<Vouchers/>} />
        </Routes>
    );
}

export default Routers;
