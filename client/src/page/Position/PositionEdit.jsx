/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { BASE_URL } from '../../../config';
import { toast } from "react-toastify";

const PositionEdit = ({ open, handleClose, setRefetch, position }) => {
    const [formData, setFormData] = useState({
        name: '',
        baseSalary: '',
        allowances: '',
        description: '', // Bổ sung trường description vào formData
    });
    
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Cập nhật formData khi modal mở và position có dữ liệu
    useEffect(() => {
        if (open && position) {
            setFormData({
                name: position.name,
                baseSalary: position.baseSalary,
                allowances: position.allowances,
                description: position.description || '', // Trường hợp nếu không có mô tả
            });
        }
    }, [open, position]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Hàm xử lý chỉnh sửa chức vụ
    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            // Sử dụng PUT thay vì POST để chỉnh sửa
            const res = await fetch(`${BASE_URL}/position/${position._id}`, {
                method: 'PUT', // Chỉnh sửa, nên dùng PUT
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const { message } = await res.json();

            if (!res.ok) {
                throw new Error(message);
            }

            setLoading(false);
            setRefetch(true); // Cập nhật lại danh sách khi chỉnh sửa thành công
            handleClose();
            navigate('/employee/position');
            toast.success(message);
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    };

    return (
        <>
            {open ? (
                <div
                    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    onClick={handleClose}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-1/2 my-6 mx-auto max-w-3xl">
                        <div className="border-2 border-slate-500 rounded-lg shadow-2xl relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className="border-b border-gray-800 p-5">
                                <h2 className="text-[20px] font-normal">Chỉnh Sửa Chức Vụ</h2>
                            </div>

                            <form onSubmit={submitHandler} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tên Chức Vụ</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Nhập tên chức vụ"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mô Tả</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Mô tả về chức vụ"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Lương Cơ Bản</label>
                                    <input
                                        type="number"
                                        name="baseSalary"
                                        value={formData.baseSalary}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Nhập lương cơ bản"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phụ Cấp</label>
                                    <input
                                        type="number"
                                        name="allowances"
                                        value={formData.allowances}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Nhập phụ cấp"
                                    />
                                </div>

                                <div className="flex justify-end space-x-4 mt-4">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="px-4 py-2 bg-gray-300 text-white rounded-md"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                        disabled={loading}
                                    >
                                        {loading ? 'Đang chỉnh sửa...' : 'Chỉnh sửa'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default PositionEdit;
