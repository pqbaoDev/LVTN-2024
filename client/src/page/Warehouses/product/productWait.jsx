/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { BASE_URL } from "../../../../config";
import useFetchData from "../../../Hook/userFecthData";
// import { FormatDay } from "../../../utils/formatDay";
import FormatPrice from "../../../utils/formatPrice";
import detailing from "../../../assets/images/category.png";
import { IoCloseOutline } from "react-icons/io5";
import { useMemo } from "react";

const ProductWait = ({ open, handleClose }) => {
    const { data: products } = useFetchData(`${BASE_URL}/productTemp`);

    

    const stopPropagation = (e) => e.stopPropagation();

    return (
        <>
            {open ? (
                <div
                    className="items-center bg-indigo-600  px-3 pb-2 overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    onClick={handleClose}
                >
                    <div className="border-b border-gray-800 flex py-2 pl-3 items-center gap-2">
                        <div className="w-4 h-4 p-0">
                            <img src={detailing} alt="" />
                        </div>
                        <h2 className="text-[16px] font-normal">Danh sách chờ nhập Kho</h2>
                    </div>
                    <div
                        onClick={handleClose}
                        className="absolute z-50 cursor-pointer top-0 right-0 p-2 hover:bg-red-500 hover:text-white text-[18px]"
                    >
                        <IoCloseOutline />
                    </div>
                    <div
                        className="relative mx-auto h-full bg-white"
                        onClick={stopPropagation} // Ngăn chặn đóng modal khi click vào chính modal
                    >
                       

                        <div className="bg-white overflow-auto relative border-t-[20px] border-blue-500">
                            {products?.length > 0 ? (
                                <table className="border-slate-400 border-t-2 w-full">
                                    <thead className="bg-blue-100">
                                        <tr>
                                            <th className="border-0 border-x-2 border-solid border-slate-400 p-1">STT</th>
                                            <th className="border-0 border-r-2 border-solid border-slate-400 p-1">TÊN HÀNG HÓA</th>
                                            <th className="border-0 border-r-2 border-solid border-slate-400 p-1">DANH MỤC</th>
                                            <th className="border-0 border-r-2 border-solid border-slate-400 p-1">NHÀ PHÂN PHỐI</th>
                                            <th className="border-0 border-r-2 border-solid border-slate-400 p-1">KÍCH THƯỚC</th>
                                            <th className="border-0 border-r-2 border-solid border-slate-400 p-1">ĐVT</th>
                                            <th className="border-0 border-r-2 border-solid border-slate-400 p-1">SỐ LƯỢNG</th>
                                            <th className="border-0 border-r-2 border-solid border-slate-400 p-1">GIÁ NHẬP</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product, index) =>(
                                                    <tr key={index}>
                                                        <td className="w-4 bg-white hover:bg-blue-500 text-center border-2 border-l-2 border-solid border-slate-400 p-1">
                                                            {index + 1}
                                                        </td>
                                                        <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">
                                                            {product?.name || "Không xác định"}
                                                        </td>
                                                        <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">
                                                            {product?.category.name || "-"}
                                                        </td>
                                                        <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">
                                                            {product?.manuFacture.name   || "-"}
                                                        </td>
                                                        <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">
                                                            {product?.size || "-"}
                                                        </td>
                                                        <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">
                                                            Cái
                                                        </td>
                                                        <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">
                                                            {product.stock || '-'}
                                                        </td>
                                                        <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">
                                                            {product.price || '-'}
                                                        </td>
                                                    </tr>
                                                )
                                           
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center mt-5">Không có sản phẩm tồn kho tại vị trí này.</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default ProductWait;
