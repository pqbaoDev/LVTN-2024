/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import uploadImageToCloudinary from "../../utils/uploadCloudinary";
import { BASE_URL, token } from "../../../config";
import { toast } from "react-toastify";
import HashLoader from 'react-spinners/HashLoader';
import { authContext } from "../../context/AuthContext";

const Profile = ({ user }) => {
    const {dispatch} = useContext(authContext);

    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        photo: null,
        gender: '',
        phone: '',
        address: ''
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Set initial data from the user prop
    useEffect(() => {
        setFormData({
            name: user.name,
            email: user.email,
            photo: user.photo,
            gender: user.gender,
            phone: user.phone,
            address: user.address,
        });
    }, [user]);
    console.log(formData.gender)


    const handleInputChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file input change and upload to Cloudinary
    const handleFileInputChange = async (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            const data = await uploadImageToCloudinary(file);
            setSelectedFile(data.url);
            setFormData({ ...formData, photo: data.url });
        } else {
            toast.error("Vui lòng chọn file ảnh có định dạng .jpg hoặc .png");
        }
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/user/${user._id}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Cập nhật thông tin thất bại");
            }
            setLoading(false);
            toast.success(data.message);
            dispatch({ type: 'LOGOUT' });
            navigate("/login");
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    };

    return (
        <div className=" p-5 bg-white mt-5">

            <div className="border-b border-gray-800 pb-5">
                <h2 className="text-[20px] font-normal">Hồ Sơ Của Tôi</h2>
                <p className="text-gray-500 text-[16px]">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
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
                <div className="w-[542px] flex justify-center items-center">
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-[70px] bg-primaryColor text-white text-[18px] leading-[30px] rounded-sm px-2 py-2"
                    >
                        {loading ? <HashLoader size={25} color="#ffffff" /> : 'Lưu'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
