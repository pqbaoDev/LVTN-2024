/* eslint-disable react/prop-types */

import { Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';
import closeIcon from "../../../assets/images/close.png";
import { BASE_URL, token } from "../../../../config";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HashLoader from 'react-spinners/HashLoader';
import useFetchData from '../../../Hook/userFecthData';

const EditCategoriesDialog = ({ open, handleClose, categoriesIds }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { data: categories, loading: categoryLoading } = useFetchData(`${BASE_URL}/category/${categoriesIds}`);

    const [formData, setFormData] = useState({ name: '' });

    // Khởi tạo formData khi tải dữ liệu danh mục thành công
    useEffect(() => {
        if (categories) {
            setFormData({ name: categories.name });
        }
    }, [categories]);

    const handleInputChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/category/${categoriesIds}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const { message } = await response.json();
            if (!response.ok) {
                throw new Error(message);
            }
            handleClose();
            toast.success(message);
            navigate('/warehouse');
        } catch (error) {
            toast.error(`Lỗi: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            handler={handleClose}
            animate={{
                mount: { x: 1, y: 0 },
                unmount: { x: 0.9, y: -100 },
            }}
            className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50"
        >
            <div className="relative w-full max-w-lg bg-white border border-gray-300 shadow-2xl rounded-lg">
                <form onSubmit={submitHandler}>
                    <DialogHeader className="text-white justify-center text-[16px] rounded-t-lg bg-blue-400">
                        <span>Chỉnh sửa danh mục</span>
                        <div className="absolute top-2 right-2">
                            <img src={closeIcon} onClick={handleClose} className="w-5 h-5 cursor-pointer" alt="close" />
                        </div>
                    </DialogHeader>
                    <DialogBody className="p-4">
                        {categoryLoading ? (
                            <HashLoader size={35} color="#36D7B7" />
                        ) : (
                            <div className="flex gap-3 items-center">
                                <label className="form__label">Tên danh mục:</label>
                                <input
                                    name="name"
                                    onChange={handleInputChange}
                                    value={formData.name}
                                    type="text"
                                    placeholder="Nhập tên danh mục mới..."
                                    className="border-2 py-3 px-2 border-solid rounded-lg focus:outline-none flex-grow"
                                />
                            </div>
                        )}
                    </DialogBody>
                    <DialogFooter className="bg-gray-100 justify-end rounded-b-lg">
                        <div className="mt-7 mr-3">
                            <button type="submit" className="bg-red-500 text-white text-[18px] leading-[30px] w-full py-3 px-4 rounded-lg">
                                {loading ? <HashLoader size={35} color="#ffffff" /> : 'Lưu'}
                            </button>
                        </div>
                    </DialogFooter>
                </form>
            </div>
        </Dialog>
    );
};

export default EditCategoriesDialog;
