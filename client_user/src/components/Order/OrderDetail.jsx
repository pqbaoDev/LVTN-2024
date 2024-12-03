/* eslint-disable react/prop-types */

import detailIcon from "../../assets/images/detailIcon.png";
import { CgNotes } from "react-icons/cg";
import { FaMapMarkerAlt, FaShippingFast } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import { FaMoneyBills } from "react-icons/fa6";
import { HiOutlineInboxIn } from "react-icons/hi";
import logo from "../../assets/images/logo.png"
import FormatPrice from "../../utils/formatPrice";

const OrderDetail = ({ open, handleClose, orderId, orders,handleRePayment }) => {
    const orderItem = orders.filter(or => or._id === orderId);
    return (
        <>
            {
                open ? (
                    <div
                        onClick={handleClose}
                        className="justify-center bg-[#0005] items-center flex overflow-x-hidden overflow-y-scroll  fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div
                            className="relative w-[1010px] mt-[350px] mb-5 mx-auto "
                            onClick={(e) => { e.stopPropagation() }}
                        >
                            <div className="border-0  shadow-lg relative flex flex-col w-full outline-none focus:outline-none">

                                {orderItem.map(items => (

                                    <div key={items._id}>


                                        <div className='border-b border-dotted border-slate-900 rounded-md bg-white'>
                                            <div className='flex justify-between items-center p-5 pb-0'>

                                                <div className='text-[22px] font-bold flex justify-start items-center gap-3'>
                                                    <img src={detailIcon} className='w-[30px] h-[30px]' alt="" />

                                                    <h2>Chi tiết đơn hàng</h2>
                                                </div>


                                                <div className='flex justify-center items-center gap-2'>
                                                    <div className='flex justify-center items-center gap-2'>
                                                        <p>MÃ ĐƠN HÀNG. </p>
                                                        <p> {items.orderID}</p>
                                                    </div>
                                                    <span>|</span>
                                                    <div className="text-red-500">
                                                        {items.status}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='px-14 mb-5'>
                                                <p className="text-gray-500 text-[16px]">Quản lý thông tin chi tiết đơn hàng</p>
                                            </div>
                                        </div>
                                        {
                                            items.status !== 'Đơn hủy' ? (
                                                <div>
                                            <div className="bg-white rounded-md border-b border-dotted border-slate-900">
                                                <div className="p-20 pb-5 flex justify-center items-center">
                                                    <div className="p-3 border-4 flex justify-center items-center text-[32px] border-green-600 w-16 h-16 rounded-full text-green-600">
                                                        <CgNotes />
                                                    </div>
                                                    <div className={`${items.status !== 'Đang xử lý' ? 'border-green-600' : 'border-gray-500'} border-2  w-36`}></div>
                                                    <div className={`p-3 border-4 flex justify-center items-center text-[32px] ${items.status !== 'Đang xử lý' ? 'border-green-600 text-green-600' : 'border-gray-500 text-gray-500'} w-16 h-16 rounded-full `}>
                                                        <FaMoneyBills />
                                                    </div>
                                                    <div className={`${items.status !== 'Đang xử lý' && items.status !== 'Chờ vận chuyển' ? 'border-green-600' : 'border-gray-500'} border-2  w-36`}></div>
                                                    <div className={`p-3 border-4 flex justify-center items-center text-[32px] ${items.status !== 'Đang xử lý' && items.status !== 'Chờ vận chuyển' ? 'border-green-600 text-green-600' : 'border-gray-500 text-gray-500'} w-16 h-16 rounded-full `}>
                                                        <FaShippingFast />
                                                    </div>
                                                    <div className={`${items.status !== 'Đang xử lý' && items.status !== 'Chờ vận chuyển' && items.status !== 'Chờ thanh toán' ? 'border-green-600' : 'border-gray-500'} border-2  w-36`}></div>
                                                    <div className={`p-3 border-4 flex justify-center items-center text-[32px] ${items.status !== 'Đang xử lý' && items.status !== 'Chờ vận chuyển' && items.status !== 'Chờ thanh toán' ? 'border-green-600 text-green-600' : 'border-gray-500 text-gray-500'} w-16 h-16 rounded-full `}>
                                                        <HiOutlineInboxIn />
                                                    </div>
                                                    <div className={`${items.status === 'Đã hoàn tất' ? 'border-green-600' : 'border-gray-500'} border-2  w-36`}></div>
                                                    <div className={`p-3 border-4 flex justify-center items-center text-[32px] ${items.status === 'Đã hoàn tất' ? 'border-green-600 text-green-600' : 'border-gray-500 text-gray-500'} w-16 h-16 rounded-full `}>
                                                        <FiStar />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-5 gap-7 mx-[35px] pb-16">
                                                    <p className="text-center">Đơn Hàng Đã Đặt</p>
                                                    <p className="text-center">Đã Xác Nhận Thông Tin Thanh Toán</p>
                                                    <p className="text-center">Đã Giao Cho Đơn Vị Vận Chuyển</p>
                                                    <p className="text-center">Đã Nhận Được Hàng</p>
                                                    <p className="text-center">Đơn Hàng Đã Hoàn Thành</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between  px-11 bg-white rounded-md  py-4 border-b border-dotted border-slate-900">
                                                <div>
                                                    <h2>Cảm bạn đã tinh tưởng và chọn mua hàng tại</h2>
                                                    <div className="w-[242px] p-3 py-2">
                                                        <img src={logo} alt="" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-6">
                                                    {
                                                        items.status=== 'Đã hoàn tất'&&
                                                    <button onClick={()=>handleRePayment(items._id)} className="py-3 px-2 w-[220px] text-white bg-orange-600 rounded-sm hover:bg-orange-500">
                                                        Mua lại
                                                    </button>
                                                    }
                                                    <button className="py-3 px-2 w-[220px] border border-slate-500 rounded-md hover:bg-slate-100">
                                                        Liên hệ người bán
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                            ):(
                                                <div className="bg-white p-6 rounded-md border-b border-dotted border-slate-900">

                                                    <h2  className="text-[22px] text-red-500">Đơn Hàng Đã hủy</h2>
                                    
                                                </div>
                                            )
                                            
                                        }
                                        
                                            <div className="bg-white rounded-md p-5">
                                                {
                                                    items.status !== 'Đơn hủy' && (
                                                        <div className="pb-5 border-b border-slate-900">
                                                    <div className="flex justify-start items-center gap-2">
                                                    <FaMapMarkerAlt className="text-orange-500" />
                                                    <h2 className="text-[22px]">Địa Chỉ Nhận Hàng</h2>
                                                    </div>

                                                    <div className="px-10">
                                                    <p className="text-[16px] font-bold">{items.user.name}</p>
                                                    <p className="text-[13px] mt-2">{items.user.phone}</p>
                                                    <p className="text-[13px] mt-2">{items.user.address}</p>
                                                    </div>
                                                </div>

                                                    )
                                                }
                                                
                                                <div >
                                                    {
                                                        items.products.map(pro=>(
                                                            <div key={pro._id}>

                                                            
                                                            <div  className="text-[16px] cursor-pointer pt-2 text-center flex items-center justify-between">
                                                            <div className="flex items-center justify-center">
                                                                <div className="w-[82px]">
                                                                {
                                                pro.product?.photo.slice(0,1).map((pho,idx)=>(
                                                    <img key={idx} src={pho} className="w-[50px] h-[50px] object-cover rounded" alt={pro?.product?.name} />

                                                ))
                                            }
                                                                </div>
                                                                <div>
                                                                    <div>{`${pro.product.category.name} ${pro.product?.name} ${pro.product?.size}`}</div>
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
                                                        </div>
                                                        <div>
                                                            <div className="grid grid-cols-4">
                                                                <div className="flex justify-end items-center col-span-3 border-t border-r border-dotted py-3 px-2">
                                                                    <p className="text-[14px] text-slate-700">Tổng tiền hàng</p>
                                                                </div>
                                                                <div className="flex justify-end items-center col-span-1 border-t  border-dotted py-3 px-2">
                                                                <sup className="underline">đ</sup>{FormatPrice(pro.product.price * (1 - pro.product.discount / 1000))}
                                                                </div>

                                                            </div>
                                                            <div className="grid grid-cols-4">
                                                                <div className="flex justify-end items-center col-span-3 border-t border-r border-dotted py-3 px-2">
                                                                    <p className="text-[14px] text-slate-700">Voucher từ shop</p>
                                                                </div>
                                                                <div className="flex justify-end items-center col-span-1 border-t border-dotted py-3 px-2">
                                                                <sup className="underline">đ</sup>{FormatPrice(pro.voucher?.sale)}
                                                                </div>

                                                            </div>
                                                            {
                                                                items.payment === 'Đã thanh toán' ? (
                                                                    <div>
                                                                         <div className="grid grid-cols-4">
                                                                <div className="flex justify-end items-center col-span-3 border-t border-r border-dotted py-3 px-2">
                                                                    <p className="text-[14px] text-slate-700">Đã thanh toán</p>
                                                                </div>
                                                                <div className="  flex justify-end items-center col-span-1 border-t border-dotted py-3 px-2">
                                                                <sup className="underline">đ</sup>{FormatPrice(items.totalAmount)}
                                                                </div>

                                                            </div>
                                                                        <div className="grid grid-cols-4">
                                                                        <div className="flex justify-end items-center col-span-3 border-t border-r border-dotted py-3 px-2">
                                                                            <p className="text-[14px] text-slate-700">Thành tiền</p>
                                                                        </div>
                                                                        <div className="text-[22px] text-orange-600 flex justify-end items-center col-span-1 border-t border-dotted py-3 px-2">
                                                                        <sup className="underline">đ</sup> 0
                                                                        </div>

                                                                    </div>
                                                                    </div>

                                                                ):(
                                                                
                                                                <div className="grid grid-cols-4">
                                                                <div className="flex justify-end items-center col-span-3 border-t border-r border-dotted py-3 px-2">
                                                                    <p className="text-[14px] text-slate-700">Thành tiền</p>
                                                                </div>
                                                                <div className="text-[22px] text-orange-600 flex justify-end items-center col-span-1 border-t border-dotted py-3 px-2">
                                                                <sup className="underline">đ</sup>{FormatPrice(items.totalAmount)}
                                                                </div>

                                                            </div>

                                                                )
                                                            }
                                                           
                                                            <div className="grid grid-cols-4">
                                                                <div className="flex justify-end items-center col-span-3 border border-l-0 border-dotted py-3 px-2">
                                                                    <p className="text-[14px] text-slate-700">Phương thức thanh toán</p>
                                                                </div>
                                                                <div className="flex justify-end items-center col-span-1 border border-x-0 border-dotted py-3 px-2">
                                                                        <p>{items.payment === 'COD' ? 'Thanh toán khi nhận hàng': 'Chuyển khoản'}</p>
                                                                </div>

                                                            </div>


                                                        </div>
                                                        </div>
                                                        ))
                                                    }
                                                </div>

                                            </div>

                                    </div>
                                ))
                                }
                            </div>

                        </div>

                    </div>
                ) : null
            }
        </>
    );
}

export default OrderDetail;
