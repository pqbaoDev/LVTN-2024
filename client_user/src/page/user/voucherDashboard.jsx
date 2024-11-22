/* eslint-disable react/prop-types */


import { FaSearch } from "react-icons/fa";
import { BASE_URL } from "../../../config";
import boxImg from "../../assets/images/box.png"
import VoucherCard from "../../components/voucher/voucherCard";
import useFetchData from "../../Hook/userFecthData";
import { useState } from "react";
import { Link } from "react-router-dom";


const VoucherDashboard = ({ user }) => {
    const [voucherItem, setVoucherItem] = useState('')
    const { data: vouchers } = useFetchData(`${BASE_URL}/user/voucher/${user._id}`)
    const voucherFilter = vouchers.filter(vou => vou.promotionId === voucherItem || vou.name === voucherItem);
    return (
        <div>
            {
                vouchers.length > 0 ? (
                    <div className="bg-white my-5 p-5">
                        <div className="flex justify-between items-center border-b border-gray-800 pb-5">
                            <div>
                                <h2 className="text-[20px] font-normal">Vouch của bạn</h2>
                                <p className="text-gray-500 text-[16px]">
                                    Quản lý thông tin voucher giảm giá
                                </p>
                            </div>
                            <div className="relative w-1/3 max-w-lg">
                                <input
                                    type="search"
                                    placeholder="Tìm kiếm voucher..."
                                    value={voucherItem}
                                    onChange={e => setVoucherItem(e.target.value)}
                                    className="w-full p-2 pl-10 border rounded-xl text-black border-gray-300 focus:outline-none"
                                />
                                <button className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
                                    <FaSearch />
                                </button>
                            </div>
                            <Link to='/voucher'>
                                <h2 className="text-red-500 cursor-pointer">Tìm thêm voucher</h2>

                            </Link>
                        </div>
                        <div className="w-2/3 mx-auto">

                            <VoucherCard voucher={voucherFilter.length > 0 ? voucherFilter : vouchers} />
                        </div>
                    </div>
                ) : (
                    <div className="m-5">
                        <div className=" bg-white h-[415px]">
                            <div className="py-[125px] w-[150px] text-center items-center mx-auto">
                                <div className=" w-[90px] mb-5 mx-auto rounded-full p-2 bg-green-300 ">
                                    <img src={boxImg} alt="" />
                                </div>
                                <span className="text-slate-400 text-[18px] text-center">Chưa có voucher</span>
                            </div>
                        </div>

                    </div>
                )
            }
        </div>
    );
}

export default VoucherDashboard;

