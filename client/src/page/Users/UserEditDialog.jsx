/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

import useGetProfile from "../../Hook/userFecthData";
import uploadImageToCloudinary from '../../utils/uploadCloudinary';
import { BASE_URL, token } from '../../../config';
import { toast } from "react-toastify";
import Error from "../../components/Error/Error";
import { useNavigate } from "react-router-dom";
import HashLoader from 'react-spinners/HashLoader';

const UserEditDialog = ({ open, handleClose, userId}) => {
    const { data: user } = useGetProfile(userId ? `${BASE_URL}/user/${userId}` : null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        photo: null,
        gender: '',
        address: ''

    });
    const navigate = useNavigate();
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                photo: user.photo || '',
                gender: user.gender || '',
                address: user.address || ''

            });
        }
    }, [user]);

    const handleInputChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileInputChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const data = await uploadImageToCloudinary(file);
            setSelectedFile(data.url);
            setFormData({ ...formData, photo: data.url });
        }
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setSubmitLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/user/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const { message } = await res.json();

            if (!res.ok) {
                throw new Error(message);
            }
            setSubmitLoading(false);
            navigate('/user');
            handleClose();
            toast.success(message);
        } catch (error) {
            toast.error(error.message);
            setSubmitLoading(false);
        }
    };
    const stopPropagation = (e) => {
        e.stopPropagation();
      };

    return (
        <>
            {open ?
                (
                    <div
                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                            onClick={handleClose} // Đóng modal khi click ra ngoài
                        >
                            <div
                                className="relative w-1/2 my-6 mx-auto max-w-3xl"
                                onClick={stopPropagation} // Ngăn chặn đóng modal khi click vào chính modal
                            >
                                <div className="border-2 border-slate-500 rounded-lg shadow-2xl relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="border-b border-gray-800 p-5">
                <h2 className="text-[20px] font-normal">Chi tiết khách hàng</h2>
                <p className="text-gray-500 text-[16px]">Quản lý thông tin tài khoản khách hàng</p>
            </div>

                                <form onSubmit={submitHandler}>
                
                {/* Name Input */}

                <div className="grid grid-cols-3">
                    <div className="col-span-2 my-8">
                        <div className="mb-5 grid grid-cols-4 gap-4 mr-9">
                            <p className=" text-right text-[16px] text-slate-600 col-span-1">Họ và tên</p>
                            <input
                                type="text"
                                name="name"
                                placeholder="Họ và Tên"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 text-[16px] col-span-3 border border-solid focus:outline-none placeholder:text-textColor cursor-pointer"
                                
                            />
                        </div>
                        {/* Email Input */}
                        <div className="mb-5 grid grid-cols-4 gap-4 mr-9">
                        <p className=" text-right text-[16px] text-slate-600 col-span-1">Email</p>

                            <p
                                className="w-full text-[16px]">
                                {formData.email}

                                </p>
                        </div>
                        {/* Phone Input */}
                        <div className="mb-5 grid grid-cols-4 gap-4 mr-9">
                        <p className=" text-right text-[16px] text-slate-600 col-span-1">Số điện thoại</p>

                            <input
                                type="number"
                                name="phone"
                                placeholder="Số điện thoại.."
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 text-[16px] col-span-3 border border-solid focus:outline-none placeholder:text-textColor cursor-pointer"
                                
                            />
                        </div>
                        {/* Address Input */}
                        <div className="mb-5 grid grid-cols-4 gap-4 mr-9">
                        <p className=" text-right text-[16px] text-slate-600 col-span-1">Số điện thoại</p>

                            <input
                                type="text"
                                name="address"
                                placeholder="Địa chỉ"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 text-[16px] col-span-3 border border-solid focus:outline-none placeholder:text-textColor cursor-pointer"
                                
                            />
                        </div>
                        {/* Gender Select */}
                        <div className="mb-5 grid grid-cols-4 gap-4 mr-9">
                            <p  className="text-right text-[16px] text-slate-600 col-span-1">
                                Giới tính:
                            </p>
                                <select
                                    name="gender"
                                    className="w-full px-4 py-2 text-[16px] col-span-1 border border-solid focus:outline-none placeholder:text-textColor cursor-pointer"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="other">Khác</option>
                                </select>
                        </div>
                    </div>
                    {/* Photo Upload */}
                    <div className="my-8 border-l border-slate-300 pt-5 ">
                        {formData.photo && (
                            <figure className="w-[100px] h-[100px] rounded-full  flex items-center justify-center mx-auto">
                                <img src={formData.photo} alt="User Avatar" className=" w-full rounded-full"  />
                            </figure>
                        )}
                        <div className="flex items-center justify-center">
                            <div className="w-[170px] mx-auto">
                            <input
                                type="file"
                                name="photo"
                                id="customfile"
                                accept=".jpg, .png"
                                onChange={handleFileInputChange}
                                className="  opacity-0 cursor-pointer"
                            />
                            <label
                                htmlFor="customfile"
                                className=" border px-3 py-2  ml-[40px]  overflow-hidden  text-headingColor  truncate cursor-pointer"
                            >
                                Chọn Ảnh
                            </label>
                            <p className="text-justify ml-[px] text-[14px] text-slate-500 italic mt-3">Dụng lượng file tối đa 1 MB
                            Định dạng:.JPEG, .PNG</p>
                        </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="w-[542px] flex justify-center items-center mb-5">
                    <button
                        disabled={submitLoading}
                        type="submit"
                        className="w-[70px] bg-primaryColor text-white text-[18px] leading-[30px] rounded-sm px-2 py-2"
                    >
                        {submitLoading ? <HashLoader size={25} color="#ffffff" /> : 'Lưu'}
                    </button>
                </div>
            </form>
                                </div>
                            </div>
                        </div>
                    
                ) : ''}
        </>
    );
};

export default UserEditDialog;
