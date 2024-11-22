/* eslint-disable react/prop-types */
import { useState } from 'react';
import useFetchData from '../../Hook/userFecthData';
import { BASE_URL } from '../../../config';
import { FormatDay } from '../../utils/formatDay';
import FormatPrice from '../../utils/formatPrice';
import logo from '../../assets/images/miniLogo.png';

const ModelVoucher = ({ open, handleClose, userId, stopPropagation, voucher, setVoucher, handleVoucherApply }) => {
    const { data: MyVoucher } = useFetchData(`${BASE_URL}/user/voucher/${userId}`);
    
    const [tempVoucher, setTempVoucher] = useState(voucher || ''); 

    const handleInputRadio = (voucherId) => {
        setTempVoucher(voucherId); 
    };

    const handleApply = () => {
        setVoucher(tempVoucher);
        handleVoucherApply();
        setTempVoucher('')
        handleClose();
    };

    return (
        <>
            {open ? (
                <div
                    onClick={handleClose}
                    className="justify-center bg-[#0005] items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                >
                    <div
                        className="relative w-1/3 my-5 mx-auto max-w-3xl"
                        onClick={(e) => { e.stopPropagation(); stopPropagation(e); }}
                    >
                        <div className="border-0 bg-white shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                            <div className="text-[18px] border-b border-gray-900 p-5">
                                <h3>Chọn Voucher</h3>
                            </div>
                            <div className="flex justify-around items-center px-2 py-3 bg-gray-100 gap-2 m-5">
                                <p>Mã voucher</p>
                                <input
                                    type="text"
                                    className="px-2 py-3 w-3/5 focus:outline-none border border-black shadow-inner rounded-md"
                                    placeholder="Mã voucher"
                                    value={tempVoucher}
                                    onChange={(e) => setTempVoucher(e.target.value)} // Cập nhật tempVoucher
                                />
                                <button
                                    className={`border rounded-md px-2 py-3 hover:bg-slate-50 ${tempVoucher ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-400'}`}
                                    onClick={handleApply} // Áp dụng voucher khi nhấn nút
                                    disabled={!tempVoucher}
                                >
                                    Áp dụng
                                </button>
                            </div>
                            <div className="h-[372px] overflow-y-scroll">
                                {MyVoucher.map((items, index) => {
                                    const isActive = items.status === 'active'; // Kiểm tra trạng thái voucher
                                    const voucherClass = isActive ? '' : 'bg-gray-300 opacity-70'; // Tối màu nếu không active
                                    
                                    return (
                                        <div key={index} className={`mx-10 mt-5 relative myvoucher grid grid-cols-6 items-center justify-center rounded-md ${voucherClass}`}>
                                            <div className={`h-[120px] ${!isActive ? 'bg-gray-500':'bg-indigo-600'} bg-indigo-600 col-span-2 rounded-s-md shadow-[4px_0px_8px_rgba(0,0,0,0.38)]`}>
                                                <div className="items-center flex justify-center rounded-full w-16 h-16 bg-white align-middle mx-auto mt-7">
                                                    <div className="w-8 h-8">
                                                        <img src={logo} alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-3 pl-3">
                                                <div className="mx-2">
                                                    <p className="text-[16px] font-extrabold italic leading-6">{items.name}</p>
                                                    <div className="flex justify-start items-center gap-2">
                                                        <h3>Giảm </h3>
                                                        <p><sup className="underline decoration-solid">đ</sup>{FormatPrice(items.sale)}</p>
                                                    </div>
                                                    <p className="absolute top-0 -right-1 text-red-400 bg-red-100 px-1 rounded-lg">x{items.quantity}</p>
                                                    <div className="flex justify-start items-center gap-2 text-[14px] text-gray-400">
                                                        <h3>HSD:</h3>
                                                        <p>{FormatDay(items.endDate)}</p>
                                                    </div>
                                                </div>

                                                {/* Thêm thông báo và ẩn radio nếu voucher không còn active */}
                                                {isActive ? null : (
                                                    <p className="text-red-500 italic text-[13px]">Voucher hết hạn sử dụng</p>
                                                )}
                                            </div>

                                            {/* Chỉ hiển thị radio khi voucher còn active */}
                                            {isActive && (
                                                <input
                                                    type="radio"
                                                    name="voucher"
                                                    value={items.promotionId}
                                                    checked={tempVoucher === items.promotionId} // Kiểm tra xem voucher đã chọn chưa
                                                    onChange={() => handleInputRadio(items.promotionId)} // Khi chọn sẽ gọi handleInputRadio
                                                    className="w-5 h-5 text-teal-500 border-gray-300 focus:ring-teal-500"
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-end items-center gap-5 mb-5 mx-8">
                                <button
                                    className="px-3 py-2 w-[140px] text-center border border-gray-400 hover:bg-slate-200"
                                    onClick={handleClose} // Đóng modal
                                >
                                    TRỞ LẠI
                                </button>
                                <button
                                    type="button"
                                    className="px-3 py-2 w-[140px] text-center border border-gray-400 bg-indigo-500 text-white hover:bg-indigo-400"
                                    onClick={handleApply} // Áp dụng voucher
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default ModelVoucher;
