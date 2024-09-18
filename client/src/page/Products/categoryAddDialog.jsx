/* eslint-disable react/prop-types */
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import closeIcon from "../../assets/images/close.png";
import HashLoader from 'react-spinners/HashLoader';
import { toast } from "react-toastify";
import { BASE_URL } from "../../../config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CategoryAddDialog = ({ open, handleClose }) => {
    const [formData, setFormData] = useState({ name: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = e => {
        setFormData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const { message } = await response.json();

            if (!response.ok) {
                throw new Error(message);
            }

            toast.success(message);
            handleClose();
            // Optional: Refresh the list or navigate
            navigate('/product'); // Redirect if needed
        } catch (error) {
            toast.error(`Lỗi: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            handler={handleClose}
            open={open}
            size="lg"
            animate={{
                mount: { x: 1, y: 0 },
                unmount: { x: 0.9, y: -100 }
            }}
            className="mx-auto max-w-lg border border-gray-300 shadow-2xl bg-white"
        >
            <form onSubmit={submitHandler}>
                <DialogHeader className="text-white justify-center text-[16px] bg-blue-400 rounded-t-lg">
                    <h3 className="text-headingColor text-[22px] leading-9 font-bold">
                        Thêm <span className="text-primaryColor">Danh mục</span>
                    </h3>
                    <div className="absolute top-2 right-2">
                        <img src={closeIcon} onClick={handleClose} className='w-5 h-5 cursor-pointer' alt="Close" />
                    </div>
                </DialogHeader>
                <DialogBody className="p-2">
                    <div className="max-w-[1170px] mx-auto">
                        <div className="mb-5">
                            <input
                                type="text"
                                name="name"
                                placeholder="Tên danh mục"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full pr-4 py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none"
                                required
                            />
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <div className="m-0">
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                        >
                            {loading ? <HashLoader size={35} color="#ffffff" /> : 'Thêm'}
                        </button>
                    </div>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

export default CategoryAddDialog;
