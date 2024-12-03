/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import FormatPrice from "../../utils/formatPrice";
import { FormatDay } from "../../utils/formatDay";
import { useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL,token } from "../../../config";
import { useNavigate } from "react-router-dom";
import OrderDetail from "./OrderDetail";
import ReviewForm from "../../components/review/reviewForm";


const OrderItem = ({ handleOpenDetail, checkedOrders, currentItems, handleSelectChange }) => {
    const [isOpen,setIsOpen] = useState(false);
    const [selectedId,setSelectedId] = useState('');
    const [isOpenReview, setIsOpenReview] = useState(false);

    const [formData, setFormData] = useState({
        status: ''
    });
    const navigate = useNavigate();

    // Hàm để xử lý cập nhật trạng thái đơn hàng
    const handleComfirm = async (event, orderId,status) => {
        event.preventDefault();

        // Kiểm tra trạng thái hiện tại và xác định trạng thái mới
        let newStatus;
        if (status === 'Đang xử lý') {
            newStatus = 'Chờ vận chuyển';
        } else if (status === 'Chờ vận chuyển') {
            newStatus = 'Chờ thanh toán';
        }else if (status === 'Chờ thanh toán') {
            newStatus = 'Đã hoàn tất';
        } else if (status === 'Hủy đơn') {
            newStatus = 'Đơn hủy';
        } else {
            toast.error('Trạng thái đơn hàng không thể cập nhật.');
            return; // Ngừng thực hiện nếu trạng thái không hợp lệ
        }

        const orderUpdate = {
            ...formData,
            status: newStatus, 
        };

        try {
            const res = await fetch(`${BASE_URL}/order/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderUpdate)
            });

            const { message } = await res.json();

            if (!res.ok) {
                throw new Error(message);
            }

            navigate('/users/profile/me');
            toast.success(message);
        } catch (error) {
            toast.error(error.message);
        }
    };
    const handleRePayment = (Id)=>{
        const order = currentItems.find(cur=>cur._id === Id);


        navigate("/checkout", {
            state: {
                products:order.products
            },
        });
    }

    // Hàm xử lý lớp CSS theo trạng thái đơn hàng
    const getStatusClass = (status) => {
        switch (status) {
            case 'Đang xử lý':
                return 'text-green-500';
            case 'Chờ vận chuyển':
                return 'text-yellow-500';
            case 'Chờ thanh toán':
                return 'text-orange-500';
            case 'Đơn hủy':
                return 'text-red-500';
            default:
                return 'text-green-800';
        }
    };
    const handOpenOrderDetail = (id)=>{
        setSelectedId(id);
        setIsOpen(true);
    }
    const handCloseOrderDetail = (id)=>{
        setIsOpen(false);
        setSelectedId(null);
    }


    return (
        <div>
            <div className="w-full text-sm text-center">
                <div className="mb-5">
                    {currentItems.map((item) => (
                        <div key={item._id} className="text-[16px] text-center p-5 mt-5 bg-white">
                            <div className="border-b border-gray-600 flex justify-end items-center gap-3">
                                <div className={`${getStatusClass(item.status)} pb-3`}>
                                    {item.status}
                                </div>
                                <div className="text-red-500 pb-3 cursor-pointer" onClick={()=>setIsOpenReview(true)}>
                                {
                                    item.status === 'Đã hoàn tất' ? '| Đánh giá':''
                                }
                                </div>
                            </div>
                            {item.products.map(pro => (
                                <div key={pro._id} onClick={()=>handOpenOrderDetail(item._id)} className="text-[16px] cursor-pointer pt-2 text-center flex items-center justify-between">
                                    <div className="flex items-center justify-center">
                                        <div className="w-[82px]">
                                        {
                                                pro.product?.photo.slice(0,1).map((pho,idx)=>(
                                                    <img key={idx} src={pho} className="w-[50px] h-[50px] object-cover rounded" alt={pro?.product?.name} />

                                                ))
                                            }
                                        </div>
                                        <div>
                                            <div>{`${pro.product.category.name} ${pro.product?.name} ${pro.product?.size}`}
                                            </div>
                                            <div className="flex items-center justify-start">
                                                <h3 className="text-[12px]">Phân loại hàng hóa: </h3>
                                                <p className="text-[12px]">{pro.product?.size}
                                                </p>
                                                <div className="w-8 h-4 ml-2" style={{backgroundColor:(pro.product?.color)}}></div>
                                            </div>
                                            <p className="text-left">X{pro.quantity}</p>
                                        </div>
                                    </div>

                                    <div className="pr-3 py-4">
                                        {pro.product.discount ? (
                                            <div className="flex justify-center items-center gap-5">
                                                <div className="line-through text-slate-400">
                                                    <sup className="underline">đ</sup>{FormatPrice(pro.product.price)}
                                                </div>
                                                <div className="text-orange-600">
                                                    <sup className="underline">đ</sup>{FormatPrice(pro.product.price * (1 - pro.product.discount / 1000))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-orange-600">
                                                <sup className="underline">đ</sup>{FormatPrice(pro.product.price)}
                                            </div>
                                        )}
                                    </div>
                                         <ReviewForm open={isOpenReview} setOpen={setIsOpenReview} orderID={item._id} productId={pro.product._id} />

                                </div>
                            ))}
                            <div className="h-[144px] border-t border-slate-600 py-8">
                                {
                                    item.payment === 'Đã thanh toán' ? (
                                        <div className="flex justify-end items-center gap-4">
                                    <h2 className="text-[16px] font-normal">Thành tiền:</h2>
                                    <div className="text-orange-600">
                                        <sup className="underline">đ</sup>0
                                    </div>
                                </div>

                                    ):(
                                        <div className="flex justify-end items-center gap-4">
                                    <h2 className="text-[16px] font-normal">Thành tiền:</h2>
                                    <div className="text-orange-600">
                                        <sup className="underline">đ</sup>{FormatPrice(item.totalAmount)}
                                    </div>
                                </div>

                                    )
                                }
                                
                                <div className="flex justify-end items-center gap-5 mt-6">
                                    {item.status === 'Chờ thanh toán' ? (
                                        <button 
                                            className="py-3 px-2 w-[149px] text-white bg-red-500 rounded-md hover:bg-red-400" 
                                            onClick={(e) => handleComfirm(e, item._id,item.status)}
                                        >
                                            Đã nhận hàng
                                        </button>
                                    ) : item.status === 'Đã hoàn tất' ? (
                                        <div className="flex justify-end items-center gap-5">
                                            <button onClick={()=>handleRePayment(item._id)} className="py-3 px-2 w-[149px] text-white bg-orange-500 rounded-md hover:bg-orange-400">
                                                Mua lại
                                            </button>
                                            <button className="py-3 px-2 w-[149px] border border-slate-500 rounded-md hover:bg-slate-100">
                                                Liên hệ người bán
                                            </button>
                                            <button className="py-3 px-1 w-[149px] border border-slate-500 rounded-md hover:bg-slate-100">
                                                Xem đánh giá shop
                                            </button>
                                        </div>
                                    ) : item.status === 'Đơn hủy' ? (
                                        <div className="flex justify-end items-center gap-5">
                                            <button onClick={()=>handleRePayment(item._id)} className="py-3 px-2 w-[149px] text-white bg-orange-500 rounded-md hover:bg-orange-400">
                                                Mua lại
                                            </button>
                                            <button className="py-3 px-2 w-[149px] border border-slate-500 rounded-md hover:bg-slate-100">
                                                Liên hệ người bán
                                            </button>
                                        </div>
                                    ) : item.status === 'Đang xử lý' ? (
                                        <div className="flex justify-end items-center gap-5">
                                            <button
                                                onClick={(e) => handleComfirm(e, item._id,'Hủy đơn')}

                                                 className="py-3 px-2 w-[149px] border border-slate-500 rounded-md hover:bg-slate-100">
                                                Hủy đơn
                                            </button>
                                            <button className="py-3 px-2 w-[149px] border border-slate-500 rounded-md hover:bg-slate-100">
                                                Liên hệ người bán
                                            </button>
                                        </div>
                                    ) : item.status === 'Chờ vận chuyển' ? (
                                        <div className="flex justify-end items-center gap-5">
                                            {/* <button
                                                onClick={(e) => handleComfirm(e, item._id,'Hủy đơn')}

                                                 className="py-3 px-2 w-[149px] border border-slate-500 rounded-md hover:bg-slate-100">
                                                Hủy đơn
                                            </button> */}
                                            <button className="py-3 px-2 w-[149px] border border-slate-500 rounded-md hover:bg-slate-100">
                                                Liên hệ người bán
                                            </button>
                                        </div>
                                    ): (
                                        <div className="flex justify-end items-center gap-5">
                                            {/* <button
                                                onClick={(e) => handleComfirm(e, item._id,'Hủy đơn')}

                                                 className="py-3 px-2 w-[149px] border border-slate-500 rounded-md hover:bg-slate-100">
                                                Hủy đơn
                                            </button> */}
                                            <button className="py-3 px-2 w-[149px] border border-slate-500 rounded-md hover:bg-slate-100">
                                                Liên hệ người bán
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    ))}
                </div>
            </div>

            {
                open &&
            <OrderDetail open={isOpen} handleClose={handCloseOrderDetail} orderId={selectedId} orders={currentItems} handleRePayment={handleRePayment}  />
            }

        </div>
    );
}

export default OrderItem;
