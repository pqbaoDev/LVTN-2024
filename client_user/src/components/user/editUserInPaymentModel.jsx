/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react';
import { BASE_URL, token } from '../../../config';
import { toast } from 'react-toastify';
import Loading from "../../components/Loader/Loading";


const EditUserInPaymentModel = ({ open, handleClose, user,stopPropagation }) => {

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
    });
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
            handleClose();
            toast.success(message);
        } catch (error) {
            toast.error(error.message);
            setSubmitLoading(false);
        }
    };

    return (
        <>
            {
                open ? (
                    <div
                        onClick={handleClose}
                        className="justify-center bg-[#0005] items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div
                            className="relative w-1/3 mt-5 mx-auto max-w-3xl"
                            onClick={stopPropagation}
                        >
                            <div className="border-0 bg-white shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                                <div className='h-[56px] text-[18px] leading-6  flex items-center justify-start px-5 border-b-2 border-slate-300'>
                                    <h3>Thông tin người nhận</h3>
                                </div>
                                <div className='mt-5'>
                                    <div className='grid grid-cols-2'>
                                        <div className='flex justify-center items-center relative'>
                                            <p className='text-[14px] absolute -top-3 left-9 bg-white'>Họ và tên</p>
                                            <input type="text" onChange={handleInputChange} name='name' value={formData.name} className='border border-slate-300 focus:outline-none px-2 py-2 rounded-sm w-[217px] ' />
                                        </div>
                                        <div className='flex justify-center items-center relative'>
                                            <p className='text-[14px] absolute -top-3 left-9 bg-white'>Số điện thoại</p>
                                            <input type="number" onChange={handleInputChange} name='phone' value={formData.phone} className='border border-slate-300 focus:outline-none px-2 py-2 rounded-sm w-[217px]' />
                                        </div>
                                    </div>
                                    <div>
                                    <div className='flex justify-start my-3 mx-4  items-center relative'>
                                            <p className='text-[14px] absolute -top-3 left-9 bg-white'>Địa chỉ</p>
                                            <input type="text" onChange={handleInputChange} name='address' value={formData.address} className='border border-slate-300 focus:outline-none px-2 py-2 rounded-sm w-full' />
                                        </div>
                                    </div>
                                </div>
                                <div className='m-5 flex justify-end' onClick={submitHandler}>
                                <button className='w-[210px] hover:bg-indigo-400 py-3 bg-indigo-600 text-[18px] text-white rounded-md'>
                                {submitLoading ? <Loading size={25} color="#ffffff" /> : 'Lưu'}
                                </button>
                                
                                </div>

                            </div>

                        </div>

                    </div>
                ) : null
            }

        </>
    );
}

export default EditUserInPaymentModel;
