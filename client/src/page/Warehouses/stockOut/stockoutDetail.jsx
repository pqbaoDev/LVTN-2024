/* eslint-disable react/prop-types */

import FormatPrice from "../../../utils/formatPrice";
// import logo from "../../../assets/images/logo.png";
import { FormatDay } from "../../../utils/formatDay";
import detailing from "../../../assets/images/category.png"
import { IoCloseOutline } from "react-icons/io5";
import { useState } from "react";
import PrintStockOut from "./printStockOut";


const StockoutDetail = ({ stockOut, open, handleClose, stopPropagation }) => {
  const [print, setPrint] = useState(false); // Thêm state cho print
   
    let totalQuantity = 0;
    let totalPrice = 0; // Thêm biến để tính tổng giá trị
    const handlePrint = () => {
        setPrint(true); // Thiết lập trạng thái in khi nhấn
        setTimeout(() => {
          window.print();
          setPrint(false); // Reset trạng thái in sau khi in
        }, 0);
      };

    return (
        <div>
            {open ? (
                <div
                    className=" items-center bg-indigo-600 px-3 pb-2  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                   
                >
                    <div className="border-b border-gray-800  flex py-2 pl-3 items-center   gap-2 ">
                        <div className="w-4 h-4 p-0">
                            <img src={detailing} alt="" />
                        </div>
                   
                                    <h2 className="text-[16px] font-normal">Chi tiết phiếu xuất</h2>
                                </div>
                                <div onClick={handleClose} className="absolute z-50 cursor-pointer top-0 right-0 p-2 hover:bg-red-500 hover:text-white text-[18px]">
                                <IoCloseOutline />
                                </div>
                    <div
                        className="relative mx-auto w-full h-full bg-white"
                        onClick={stopPropagation} // Ngăn chặn đóng modal khi click vào chính modal
                    >
                        <div className=" relative flex flex-col w-full bg-white outline-none focus:outline-none">

                            
                                
                               
                            
                            <div className="p-5 border-b-[20px] flex justify-center items-center border-indigo-600">
                                {/* {stockOut.products.map((item, index) => (
                                <div key={index} className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-[14px]">Nhà cung cấp:</p>
                                        <p>{item.product?.manuFacture?.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-[14px]">Số điện thoại:</p>
                                        <p>{item.product?.manuFacture?.phone}</p>
                                    </div>
                                </div>
                                ))} */}
                               
                                    <div className="w-[435px]">
                                        <div className="grid grid-cols-5">
                                            <p className="font-semibold text-[14px] col-span-2">Nhân viên:</p>
                                            <p className="col-span-3">{stockOut?.employee?.name}</p>
                                        </div>
                                        <div className="grid grid-cols-5">
                                            <p className="font-semibold text-[14px] col-span-2">Số điện thoại:</p>
                                            <p className="col-span-3">{stockOut?.employee?.phone}</p>
                                        </div>
                                                                       
                                                                        <div className="grid grid-cols-5">
                                        <p className="font-semibold text-[14px] col-span-2">Ngày Xuất:</p>
                                        <p>{FormatDay(stockOut.dateOut)}</p>
                                                                        </div>
                                                                        <div className="grid grid-cols-5">
                                            <p className="font-semibold text-[14px] col-span-2">Trạng thái:</p>
                                            <p className="col-span-3">{stockOut.status }</p>
                                        </div>
                                                                        <div className="flex items-center gap-10">
                                        <div className="grid grid-cols-5">
                                            <p className="font-semibold text-[14px] col-span-2">Khu:</p>
                                            <p className="text-[16x] font-bold col-span-3">{stockOut.location.zone.symbol}</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-5">
                                            <p className="font-semibold text-[14px] col-span-2">Kệ/Pallet:</p>
                                            <p className="text-[16x] font-bold col-span-3">{stockOut.location.type === 'rack' ? stockOut.location.rack : stockOut.location.pallet }</p>
                                        </div>
                                        {
                                            stockOut.location.type === 'rack' && (
                                                <div className="flex items-center gap-2">
                                            <p className="font-semibold text-[14px] col-span-2">Tầng:</p>
                                            <p className="text-[16x] font-bold col-span-3">{stockOut.location.level }</p>
                                        </div>
                                            )
                                        }
                                                                        </div>
                                          
                                                                        <div className="flex items-center gap-2">
                                        <p className="font-semibold text-[14px]">Ghi chú:</p>
                                        <p>{stockOut?.note}</p>
                                                                        </div>
                                                                        <button onClick={handlePrint} className="bg-indigo-600 px-5 py-2 w-[150px] text-white rounded-md">In</button>
                                    </div>
                            </div>
                            <div className="px-5 pt-5">
                                <table className="border-indigo-500 border-t-2 mb-5">
                                    <thead className="bg-blue-500">
                                        <tr>
                                            <th className="border-0 border-x-2 border-solid border-indigo-500 p-1">STT</th>
                                            <th className="border-0 border-r-2 border-solid border-indigo-500 p-1">SỐ PHIẾU</th>
                                            <th className="border-0 border-r-2 border-solid border-indigo-500 p-1">NHÀ CUNG CẤP</th>
                                            <th className="border-0 border-r-2 border-solid border-indigo-500 p-1">DANH MỤC</th>
                                            {/* <th className="border-0 border-r-2 border-solid border-indigo-500 p-1">SỐ PHIẾU</th> */}
                                            <th className="border-0 border-r-2 border-solid border-indigo-500 p-1">TÊN HÀNG HÓA</th>
                                            <th className="border-0 border-r-2 border-solid border-indigo-500 p-1">ĐVT</th>
                                            <th className="border-0 border-r-2 border-solid border-indigo-500 p-1">SỐ LƯỢNG</th>
                                            <th className="border-0 border-r-2 border-solid border-indigo-500 p-1">GIÁ NHẬP</th>
                                            <th className="border-0 border-r-2 border-solid border-indigo-500 p-1">THÀNH TIỀN</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stockOut.products.map((item, index) => {
                                            totalQuantity += item.quantity;
                                            const itemTotalPrice = item.product?.price * item?.quantity; // Tính tổng giá trị cho mỗi sản phẩm
                                            totalPrice += itemTotalPrice; // Cộng dồn vào tổng giá trị
                                            return (
                                                <tr key={index}>
                                                    <td className="w-4 bg-white  text-center items-center border-2 border-l-2 border-solid border-indigo-500 p-1">{index + 1}</td>
                                                    <td className="bg-white  border-2 border-solid border-indigo-500 uppercase p-1">{stockOut._id}</td>
                                                    <td className="bg-white  border-2 border-solid border-indigo-500 p-1">{item?.product?.manuFacture.name}</td>
                                                    <td className="bg-white  border-2 border-solid border-indigo-500 p-1">{item?.product?.category.name}</td>
                                                    <td className="bg-white  border-2 border-solid border-indigo-500 p-1">{item?.product?.name}</td>
                                                    <td className="bg-white  border-2 border-solid border-indigo-500 p-1">Cái</td>
                                                    <td className="bg-white  border-2 border-solid border-indigo-500 p-1">{item?.quantity}</td>
                                                    <td className="bg-white  border-2 border-solid border-indigo-500 p-1">{FormatPrice(item?.product?.price)}</td>
                                                    <td className="bg-white  border-2 border-solid border-indigo-500 p-1">{FormatPrice(itemTotalPrice)}</td>
                                                </tr>
                                            );
                                        })}
                                        <tr className="bg-white  border-2 border-solid border-indigo-500 p-1">
                                            <td></td>
                                            <td></td>
                                            <td className="text-center font-semibold" colSpan={4}>TỔNG CỘNG</td>
                                           
                                            <td className="bg-white  border-2 border-solid border-indigo-500 p-1">{totalQuantity}</td>
                                            <td className="bg-white  border-2 border-solid border-indigo-500 p-1"></td>
                                            <td className="bg-white  border-2 border-solid border-indigo-500 p-1">{FormatPrice(totalPrice)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>) : null}
                    {print && <PrintStockOut stockOut={stockOut} />}

        </div>
    );
}

export default StockoutDetail;
