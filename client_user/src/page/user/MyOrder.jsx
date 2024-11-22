/* eslint-disable react/prop-types */

import useFetchData from "../../Hook/userFecthData";
import { BASE_URL } from "../../../config";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import OrderList from "../../components/Order/OrderList";
import { useContext } from "react";
import { authContext } from "../../context/AuthContext";
const MyOrder = () => {
    const {user} = useContext(authContext);

    const {data:order,loading,error}= useFetchData(`${BASE_URL}/order/users/${user._id}`)

    
    return (
        <>
            <section className="p-0">
                <div className="mt-1">
                    {loading && <Loading />}
                    {error && <Error message="Có lỗi xảy ra khi lấy dữ liệu đơn hàng" />}
                    {!loading && !error && (
                        <div>
                            {order.length >= 0 ? (
                                <OrderList orders={order} />
                            ) : (
                                <p className="text-center text-gray-500">Không có đơn hàng nào được tìm thấy.</p>
                            )}
                        </div>
                    )}
                </div>
            </section>
            
            
        </>
    );
}

export default MyOrder;
