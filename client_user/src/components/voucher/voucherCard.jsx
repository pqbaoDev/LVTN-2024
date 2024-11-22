/* eslint-disable react/prop-types */
import FormatPrice from '../../utils/formatPrice';
import { FormatDay } from '../../utils/formatDay';
import logo from '../../assets/images/miniLogo.png';
import { BASE_URL,token } from '../../../config';
import { useContext } from 'react';
import { authContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const VoucherCard = ({ voucher }) => {
    const {user} = useContext(authContext);
    const navigate = useNavigate();
    const saveVoucher = async (event,voucherId)=>{
            event.preventDefault();
    
            try {
                const res = await fetch(`${BASE_URL}/user/voucher/${user._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({voucherId:voucherId})
                });
    
                const { message } = await res.json();
    
                if (!res.ok) {
                    throw new Error(message);
                }
    
                navigate('/voucher');
                toast.success(message);
            } catch (error) {
                toast.error(error.message);
            }
        };
    return (
        <>
            <div className='bg-white p-5 rounded-md'>
                {voucher.map((items, index) => {
                    const isActive = items.status === 'active'; // Kiểm tra trạng thái voucher
                    const voucherClass = isActive ? '' : 'bg-gray-300 opacity-70'; // Tối màu nếu không active

                    return (
                        <div key={index} className={`mx-10 mt-5 relative myvoucher grid grid-cols-6 items-center justify-center rounded-md ${voucherClass}`}>
                            <div className={`h-[120px] ${!isActive ? 'bg-gray-500' : 'bg-indigo-600'} bg-indigo-600 col-span-2 rounded-s-md shadow-[4px_0px_8px_rgba(0,0,0,0.38)]`}>
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
                               <button 
                                onClick={(e)=>saveVoucher(e,items._id)}
                                className='px-3 py-2 bg-indigo-500 text-white'>
                                Lưu
                               </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default VoucherCard;
