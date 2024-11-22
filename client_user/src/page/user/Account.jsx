import { useContext, useState } from "react";
import { authContext } from "../../context/AuthContext";
import MyOrder from "./MyOrder";
import Profile from "./Profile";
import { BASE_URL, token } from "../../../config";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import useFetchData from "../../Hook/userFecthData";
import { useNavigate } from "react-router-dom";
import { FaPencilAlt, FaRegBell, FaRegUser, } from "react-icons/fa";
import { MdOutlineEventNote } from "react-icons/md";
import { BiPowerOff, BiSolidDiscount } from "react-icons/bi";
import ChangePassword from "./ChangePassword";
import VoucherDashboard from "./voucherDashboard";


const Account = () => {
    const { dispatch, user } = useContext(authContext);
    const [tab, setTab] = useState('orders');
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const toggleAccordion = () =>{ setIsOpen(!isOpen); setTab('infor')};
    const selectInfor = (key)=>{
        setIsOpen(false),
        setTab(key);
    }


    const { data: userData, loading, error } = useFetchData(`${BASE_URL}/user/${user?._id}`);

    const handleLogout = async () => {


        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            try {
                // Gọi API để cập nhật trạng thái đăng xuất trong cơ sở dữ liệu
                const res = await fetch(`${BASE_URL}/auth/logout`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userId: userData._id }), // Gửi userId trong body
                });

                if (!res.ok) {
                    throw new Error("Không thể đăng xuất từ máy chủ.");
                }

                // Cập nhật AuthContext và localStorage
                dispatch({ type: 'LOGOUT' });
                navigate("/login");
            } catch (error) {
                console.error("Đăng xuất thất bại:", error);
            }
        }
    };
    return (
        <>
            <div className=" container ">
                {loading && !error && <Loading />}
                {error && !loading && <Error errorMessage={error} />}
                {
                    !loading && !error && (
                        <div className="grid lg:grid-cols-12 md:grid-cols-3 bg-slate-50">
                            <div className="pb-[50px] px-[30px] lg:col-span-2 lg:col-start-2 rounded-md mt-5 ">
                                <div className="flex items-center justify-center gap-x-2 border-b border-slate-300 py-5">
                                    <figure className="w-[50px] h-[50px] rounded-full ">
                                        <img src={userData?.photo} className="w-full h-full rounded-full" alt="" />
                                    </figure>
                                    <div className="text-center ">
                                        <h3 className="text-[16px]  text-headingColor font-normal">
                                            {userData?.name}
                                        </h3>
                                        <div className="flex justify-center items-center text-gray-400 gap-2">
                                            <FaPencilAlt />
                                            <span>Sửa hồ sơ</span>

                                        </div>
                                        {/* <p className="text-textColor text-[15px] font-medium leading-6">
                                       {userData.email}
                                    </p> */}

                                    </div>
                                </div>
                                {/* <div className="text-center mt-4 flex gap-2 items-center justify-center">
                                    <h3 className="text-[18px] leading-[30px] text-headingColor font-bold">Điểm:</h3>
                                    <p>{userData.point}</p>

                                </div> */}
                                <div className="mt-5">
                                    <div className="mb-2">
                                        <div onClick={toggleAccordion} className="flex justify-center items-center gap-3 cursor-pointer font-normal">
                                            <FaRegUser className="text-indigo-600" />
                                            <h3>Tài khoản của tôi</h3>

                                        </div>
                                        {isOpen && (
                                            <div className="ml-[50px]  text-gray-600">
                                                <ul>
                                                    <li onClick={()=>setTab('infor')} className={`${tab==='infor'?'text-indigo-600':''} cursor-pointer hover:text-indigo-600 text-[16px]  pb-2`}>Hồ sơ</li>
                                                    <li onClick={()=>setTab('repassword')} className={`${tab==='repassword'?'text-indigo-600':''} cursor-pointer hover:text-indigo-600 text-[16px]  pb-2`}>Đổi mật khẩu</li>
                                                </ul>
                                                
                                                
                                            </div>
                                        )}
                                    </div>
                                    <div onClick={()=>selectInfor('orders')} className={`${tab==='orders'?'text-indigo-600':''} mb-2 flex justify-start hover:text-indigo-600 pl-5 items-center gap-3 cursor-pointer font-normal`}>
                                    <MdOutlineEventNote className="text-indigo-600 text-xl" />
                                    <h3>Đơn mua</h3>
                                    </div>
                                    <div onClick={()=>selectInfor('notification')} className={`${tab==='notification'?'text-indigo-600':''} mb-2 flex justify-start hover:text-indigo-600 pl-5 items-center gap-3 cursor-pointer font-normal`}>
                                    <FaRegBell className="text-orange-500 text-xl"/>
                                    <h3>Thông báo</h3>
                                    </div>
                                    <div onClick={()=>selectInfor('vouchers')} className={`${tab==='vouchers'?'text-indigo-600':''} mb-2 flex justify-start hover:text-indigo-600 pl-5 items-center gap-3 cursor-pointer font-normal`}>
                                    <BiSolidDiscount className="text-orange-500 text-xl" />
                                    <h3>Kho voucher</h3>
                                    </div>
                                    <div onClick={handleLogout}
                                        className="flex justify-start  hover:text-indigo-600 pl-5 items-center gap-3 cursor-pointer font-normal mb-2">
                                        <BiPowerOff className="text-red-500 text-xl" />
                                        Đăng xuất
                                    </div>
                                    
                                  

                                </div>

                                {/* <div className="mt-[50px] md:mt-[100px]">
                                    <button className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white" onClick={handleLogout}>Đăng Xuất</button>
                                    <button className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white">Xóa Tài Khoản</button>
                                </div> */}

                            </div>
                            <div className=" lg:col-span-8 ">
                               
                                {tab === 'orders' && <MyOrder  />}
                                {tab === 'infor' && <Profile user={userData} />}
                                {tab === 'repassword' && <ChangePassword user={userData} />}
                                {tab==='vouchers'&& <VoucherDashboard user={userData}  />}
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
};

export default Account;