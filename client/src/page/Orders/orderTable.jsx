/* eslint-disable react/prop-types */
import { useState } from "react";
import FormatDay from "../../utils/formatDay";
import FormatPrice from "../../utils/formatPrice";

const OrderTable = ({ orders }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [tab, setTab] = useState('all');
    const [checkedOrders, setCheckedOrders] = useState({});

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredOrders = () => {
        switch (tab) {
            case 'pending':
                return orders.filter(order => order.status === 'Đang xử lý');
            case 'wfpayment':
                return orders.filter(order => order.status === 'Chờ thanh toán');
            case 'complete':
                return orders.filter(order => order.status === 'Đã hoàn tất');
            case 'canceled':
                return orders.filter(order => order.status === 'Đơn hủy');
            default:
                return orders;
        }
    };

    const currentItems = filteredOrders().slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders().length / itemsPerPage);

    const orderCounts = {
        all: orders.length,
        pending: orders.filter(order => order.status === 'Đang xử lý').length,
        wfpayment: orders.filter(order => order.status === 'Chờ thanh toán').length,
        complete: orders.filter(order => order.status === 'Đã hoàn tất').length,
        canceled: orders.filter(order => order.status === 'Đơn hủy').length,
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const tabs = [
        { key: 'all', label: 'Tất cả' },
        { key: 'pending', label: 'Chờ xử lý' },
        { key: 'wfpayment', label: 'Chờ thanh toán' },
        { key: 'complete', label: 'Đã hoàn tất' },
        { key: 'canceled', label: 'Đơn hủy' },
    ];

    const handleSelectChange = (e) => {
        const { name, checked } = e.target;
        if (name === 'allSelect') {
            const updatedCheckedOrders = {};
            currentItems.forEach(item => {
                updatedCheckedOrders[item._id] = checked;
            });
            setCheckedOrders(updatedCheckedOrders);
        } else {
            setCheckedOrders(prev => ({
                ...prev,
                [name]: checked
            }));
        }
    };
    const selectedOrderIds = Object.keys(checkedOrders).filter(id => checkedOrders[id]);

    console.log('check',selectedOrderIds);


    return (
        <>
            <div className="flex m-5">
                {tabs.map(({ key, label }) => (
                    <button
                        key={key}
                        className={`py-2 px-5 text-[16px] leading-7 font-semibold ${
                            tab === key ? 'border-b border-solid border-primaryColor text-primaryColor' : 'text-headingColor'
                        }`}
                        onClick={() => { setTab(key); setCurrentPage(1); setCheckedOrders({}); }}
                    >
                        {label} <sup>({orderCounts[key]})</sup>
                    </button>
                ))}
            </div>

            <div className="mx-5">
                <table className="w-full text-sm text-center border-2 border-slate-300">
                    <thead className="text-xs uppercase border-b-2 border-b-slate-300">
                        <tr>
                            <th scope="col">
                                <input 
                                    type="checkbox" 
                                    name="allSelect" 
                                    checked={Object.keys(checkedOrders).length === currentItems.length && currentItems.every(item => checkedOrders[item._id])} 
                                    onChange={handleSelectChange} 
                                />
                            </th>
                            <th scope="col">Mã đơn hàng</th>
                            <th scope="col">Tên người nhận</th>
                            <th scope="col">Địa chỉ</th>
                            <th scope="col">SĐT</th>
                            <th scope="col">Ngày đặt</th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Tổng tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item) => (
                            <tr key={item._id} className="text-[16px] text-center">
                                <td>
                                    <input 
                                        type="checkbox" 
                                        checked={checkedOrders[item._id] || false} 
                                        name={item._id} 
                                        onChange={handleSelectChange} 
                                    />
                                </td>
                                <td className="pr-3 py-4">{item.orderID}</td>
                                <td className="pr-3 py-4">{item.user.name}</td>
                                <td className="pr-3 py-4">{item.user.address}</td>
                                <td className="pr-3 py-4">{item.user.phone}</td>
                                <td className="pr-3 py-4">{FormatDay(item.createdAt)}</td>
                                <td className={`pr-3 py-4 ${
                                    item.status === 'Đang xử lý' ? 'text-green-500' :
                                    item.status === 'Chờ thanh toán' ? 'text-orange-500' :
                                    item.status === 'Đơn hủy' ? 'text-red-500' : ''
                                }`}>
                                    {item.status}
                                </td>
                                <td className="pr-3 py-4">{FormatPrice(item.totalAmount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`mx-1 px-3 py-1 rounded-lg ${currentPage === i + 1 ? "bg-prtext-primaryColor text-white" : "bg-gray-300 text-gray-700"}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </>
    );
};

export default OrderTable;
