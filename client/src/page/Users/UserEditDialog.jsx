/* eslint-disable react/prop-types */
import  { useState, useEffect } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import useGetProfile from "../../Hook/userFecthData";
import uploadImageToCloudinary from '../../utils/uploadCloudinary';
import { BASE_URL, token } from '../../../config';
import { toast } from "react-toastify";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import { useNavigate } from "react-router-dom";
import closeIcon from "../../assets/images/close.png"

const UserEditDialog = ({ open, handleClose, userId }) => {
    const { data: user } = useGetProfile(userId?`${BASE_URL}/user/${userId}`:null);

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

    return (
        <Dialog
            size='lg'
            open={open}
            handler={handleClose}
            animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.9, y: -100 },
            }}
            className="mx-auto max-w-lg border border-gray-300 shadow-2xl bg-white "
            
        >
            <form onSubmit={submitHandler}>
                <DialogHeader className=" bg-blue-400 relative rounded-t-lg">
                    <span className='text-white justify-center text-[18px] font-semibold'>

                        Chỉnh sửa thông tin Khách hàng
                    </span>
                    <div className=" absolute top-2 right-2">
                        <img src={closeIcon} onClick={handleClose} className='w-5 h-5' alt="" />
                        
                    </div>
                </DialogHeader>
                <DialogBody className="p-4">
                    <div className="mt-10">
                        
                    <div className="mb-5 items-center gap-3 flex">
                            
                            {formData.photo && (
                                <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
                                    <img src={formData.photo} alt="Profile" className="w-full rounded-full" />
                                </figure>
                            )}
                            <div className="relative w-[130px] h-[50px]">
                                <input 
                                    type="file"
                                    name="photo"
                                    id="customfile"
                                    accept=".jpg, .png"
                                    onChange={handleFileInputChange}
                                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" 
                                />
                                <label 
                                    htmlFor="customfile"
                                    className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
                                >
                                    {selectedFile ? selectedFile.name : 'Tải ảnh lên'}
                                </label>
                            </div>
                        </div>
                        <div className="mb-5 flex items-end justify-between">
                            <label htmlFor="" className="text-headingColor font-bold text-[16px] leading-7 w-1/3">Họ tên:</label>
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Họ và tên!" 
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full pr-4 py-3 text-[16px] border-b border-solid focus:outline-none placeholder:text-textColor cursor-pointer" 
                                required 
                            />
                        </div>
                        <div className="mb-5 flex items-end justify-between">
                            <label htmlFor="" className="text-headingColor font-bold text-[16px] leading-7 w-1/3">Email:</label>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Nhập email" 
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pr-4 py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none placeholder:text-textColor cursor-pointer" 
                                readOnly 
                            />
                        </div>
                        <div className="mb-5 flex items-end justify-between">
                            <label htmlFor="" className="text-headingColor font-bold text-[16px] leading-7 w-1/3">SĐT:</label>
                            <input 
                                type="number" 
                                name="phone" 
                                placeholder="Nhập SĐT" 
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full pr-4 py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none placeholder:text-textColor cursor-pointer" 
                            />
                        </div>
                        <div className="mb-5 flex items-end justify-between">
                            <label htmlFor="" className="text-headingColor font-bold text-[16px] leading-7 w-1/3">Mật khẩu:</label>
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Password" 
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full pr-4 py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none placeholder:text-textColor cursor-pointer" 
                            />
                        </div>
                        
                        <div className="mb-5 flex items-center justify-between">
                            <label htmlFor="" className="text-headingColor font-bold text-[16px] leading-7">
                                Giới tính:
                                <select 
                                    name="gender" 
                                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Chọn</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter >
                
                    <div className="mt-7">
                        <button 
                            disabled={submitLoading}
                            type="submit" 
                            className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                        >
                            {submitLoading ? <Loading size={25} color="#ffffff" /> : 'Cập nhật'}
                        </button>
                    </div>
                    
                </DialogFooter>
            </form>
        </Dialog>
    );
};

export default UserEditDialog;
