/* eslint-disable react/prop-types */

import useFetchData from "../../Hook/userFecthData";
import { BASE_URL } from "../../../config";
import OrderList from "../../components/Order/OrderList";
import { useContext } from "react";
import { authContext } from "../../context/AuthContext";
import cartLogo from "../../assets/images/cartLogo.png";

import { Link } from "react-router-dom";
const MyOrder = () => {
    const {user} = useContext(authContext);

    const {data:order}= useFetchData(`${BASE_URL}/order/users/${user._id}`)
    

    
    return (
        <>
            <section className="p-0">
                <div className="mt-1">
                    
                
                        <div>
                            {order.length > 0 ? (
                                <OrderList orders={order} />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[600px]">
                    <img src={cartLogo} alt="Empty Cart" className="w-24 h-24" />
                    <p className="text-[18px] mt-4">Bạn không có đơn hàng.</p>
                    <Link
                        to="/product"
                        className="bg-sky-400 px-5 py-3 mt-5 text-white rounded-md hover:bg-sky-600"
                    >
                        Mua Sắm
                    </Link>
                </div>
                            )}
                        </div>
                    
                </div>
            </section>
            
            
        </>
    );
}

export default MyOrder;
