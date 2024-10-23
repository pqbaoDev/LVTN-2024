/* eslint-disable react/prop-types */

import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter
} from "@material-tailwind/react";
import closeIcon from "../../assets/images/close.png";
import { BASE_URL, token } from "../../../config";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import useFetchData from "../../Hook/userFecthData";

const PromotionEditDialog = ({ open, handleClose, promotionId }) => {
    const { data: promotion } = useFetchData(`${BASE_URL}/promotion/${promotionId}`);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        promotionId: '',
        quantity: '',
        sale: '',
        startDate: '',
        endDate: ''
    });
    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0]; // Chuyển đổi thành định dạng YYYY-MM-DD
    };
    useEffect(() => {
        setFormData({
            name: promotion.name,
            promotionId: promotion.promotionId,
            quantity: promotion.quantity,
            sale: promotion.sale,
            startDate: formatDate (promotion.startDate),
            endDate: formatDate(promotion.endDate)
        })
    }, [promotion])
    const handleInputChange = e => {
        setFormData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    };
    const submitHandle = async (event) => {
        event.preventDefault();
        setLoading(true)

        try {
            const res = await fetch(`${BASE_URL}/promotion/${promotionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,

                },
                body: JSON.stringify(formData)
            })
            const result = await res.json();
            handleClose();
            toast.success(result.message);
            if (!res.ok) {
                throw Error(result.message)
            }
        } catch (error) {
            toast.error(error.message);

        }
    }
    return (
        <Dialog
            open={open}
            handler={handleClose}
            animate={{
                mount: { x: 0, y: 0 },
                unmount: { x: 100, y: 0 }
            }}
            className="fixed right-0 top-0 h-screen w-full max-w-md border border-gray-300 shadow-2xl bg-white"


        >
            <form action="" onSubmit={submitHandle}>

                <DialogHeader className="  text-white justify-center rounded-t-lg bg-blue-400">
                    <span className="heading">

                        Chỉnh sửa khuyến mãi
                    </span>
                    <div className=" absolute top-2 right-2">
                        <img src={closeIcon} onClick={handleClose} className='w-5 h-5' alt="" />

                    </div>
                </DialogHeader>
                <DialogBody className="p-2 overflow-y-auto" style={{ maxHeight: '80vh' }}>
                    <div className="mb-5">
                        <p className="form__label">Tên chương trình</p>
                        <input type="text" name="name" className="form__input" placeholder="Tên chương trình khuyến mãi" onChange={handleInputChange} value={formData.name} />
                    </div>
                    <div className="mb-5">
                        <p className="form__label">Mã chương trình</p>
                        <input type="text" name="promotionId" className="form__input" placeholder="Mã khuyến mãi" onChange={handleInputChange} value={formData.promotionId} />
                    </div>
                    <div className="mb-5 grid grid-cols-2 gap-5">
                        <div>
                            <p className="form__label">Số lượng</p>
                            <input type="number" name="quantity" className="form__input" placeholder="Số lương khuyến mãi" onChange={handleInputChange} value={formData.quantity} />

                        </div>
                        <div>
                            <p className="form__label">Giá trị (%)</p>
                            <input type="number" name="sale" className="form__input" placeholder="Giá trị khuyến mãi" onChange={handleInputChange} value={formData.sale} />
                        </div>
                    </div>
                    <div className="mb-5 grid grid-cols-2 gap-5">
                        <div>
                            <p className="form__label">Ngày áp dụng</p>
                            <input type="date" name="startDate" className="form__input" onChange={handleInputChange} value={formData.startDate} />
                        </div>
                        <div>
                            <p className="form__label">Ngày kết thúc</p>
                            <input type="date" name="endDate" className="form__input" onChange={handleInputChange} value={formData.endDate} />
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
                            {loading ? <HashLoader size={35} color="#ffffff" /> : 'Lưu'}
                        </button>
                    </div>
                </DialogFooter>
            </form>

        </Dialog>
    );
}

export default PromotionEditDialog;
