import { useEffect, useState } from "react";
import filterIcon from "../../assets/images/filterIcon.png";
import { FaSearch } from "react-icons/fa";
import useFetchData from "../../Hook/userFecthData";
import { BASE_URL } from "../../../config";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import OrderTable from "./orderTable";
const Order = () => {
    const [debounceQuery,setDebounceQuery] = useState('');
    const {data:order,loading,error}= useFetchData(`${BASE_URL}/order?query=${debounceQuery}`)
    const [query,setQuery] = useState(' ');
    useEffect(()=>{
        const timeOut = setTimeout(()=>{
            setDebounceQuery(query);
        },700);
        return ()=>clearTimeout(timeOut);
    },[query])
    return (
        <>
            <section className="py-0 px-5 pt-4 flex justify-between">
                <div className="text-left">
                    <h2 className="heading">Quản lý đơn hàng</h2>
                </div>
                <div className="w-1/3 justify-end flex">
                    <div className="relative w-full max-w-lg">
                        <input
                            type="search"
                            placeholder="Tìm kiếm..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="w-full p-2 pl-10 border rounded-xl border-gray-300 focus:outline-none"
                        />
                        <button className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
                            <FaSearch />
                        </button>
                    </div>
                    <div className="pt-3 text-slate-500 px-5">
                        <img src={filterIcon} className="w-6 h-6" alt="Filter" />
                    </div>
                </div>
            </section>
            <section className="p-0">
                <div className="mt-1">
                    {loading && <Loading />}
                    {error && <Error message="Có lỗi xảy ra khi lấy dữ liệu đơn hàng" />}
                    {!loading && !error && (
                        <div>
                            {order.length >= 0 ? (
                                <OrderTable orders={order} />
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

export default Order;
