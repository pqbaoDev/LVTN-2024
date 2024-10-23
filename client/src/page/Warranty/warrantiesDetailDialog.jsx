/* eslint-disable react/prop-types */
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import useFetchData from "../../Hook/userFecthData";
import { BASE_URL, token } from "../../../config";
import { useEffect, useState } from "react";
import closeIcon from "../../assets/images/close.png";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";


const WarrantiesDetailDialog = ({ open, handleClose, warrantiesId }) => {
    const { data: warranties } = useFetchData(`${BASE_URL}/warranty/${warrantiesId}`);
    const [loading,setLoading] = useState(false)
    const [formData, setFormData] = useState({
        nameCustomer: '',
        phoneCustomer: '',
        address: '',
        product: '',
        type: {
            color: '',
            ram: ''
        },
        warrantyPeriod: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        if (warranties) {
            setFormData({
                nameCustomer: warranties.nameCustomer || '',
                phoneCustomer: warranties.phoneCustomer || '',
                address: warranties.address || '',
                product: warranties.product || '',
                type: {
                    color: warranties.type?.color || '',
                    ram: warranties.type?.ram || ''
                },
                warrantyPeriod: warranties.warrantyPeriod || '',
                startDate: warranties.startDate ? new Date(warranties.startDate).toISOString().substring(0, 10) : '',
                endDate: warranties.endDate ? new Date(warranties.endDate).toISOString().substring(0, 10) : '',
            });
        }
    }, [warranties]);

    const handleInputChange = e => {
        const { name, value } = e.target;

        if (name === 'color' || name === 'ram') {
            setFormData(prevData => ({
                ...prevData,
                type: {
                    ...prevData.type,
                    [name]: value
                }
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handlePrint = () => {
        window.print();
    };
    const submitHandle = async (event) => {
        event.preventDefault();
        setLoading(true)

        try {
            const res = await fetch(`${BASE_URL}/warranty/${warrantiesId}`, {
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
                mount: { x: 1, y: 0 },
                unmount: { x: 0.9, y: -100 }
            }}
            className="mx-auto max-w-2xl border border-gray-300 shadow-2xl bg-white"
        >
            <form onSubmit={submitHandle}>
            <DialogHeader className="  text-white justify-center rounded-t-lg bg-blue-400">
          <span className="heading">
  
              Chi tiết bảo hành
          </span>
          <div className=" absolute top-2 right-2">
                          <img src={closeIcon} onClick={handleClose} className='w-5 h-5' alt="" />
                          
                      </div>
        </DialogHeader>
                <DialogBody>
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                        <label className="form__label w-1/5">Khách hàng:</label>
                        <input
                            type="text"
                            name="nameCustomer"
                            value={formData.nameCustomer}
                            onChange={handleInputChange}
                            className="border-0 border-b-2 w-full border-dashed focus:outline-none"
                        />
                        </div>
                        <div className="flex gap-2 items-center justify-between mb-3">

                        <label className="form__label w-1/6">Điện thoại:</label>
                        <input
                            type="text"
                            name="phoneCustomer"
                            value={formData.phoneCustomer}
                            onChange={handleInputChange}
                            className="border-0 border-b-2 w-full border-dashed focus:outline-none"
                        />
                        </div>
                        <div className="flex gap-2 items-center justify-between mb-3">

                        <label className="form__label w-1/6">Địa chỉ:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="border-0 border-b-2 w-full border-dashed focus:outline-none"
                        />
                        </div>
                        <div className="grid grid-cols-8">
                        <div className="flex gap-2 items-center justify-between mb-3 col-span-5">

                            <label className="form__label w-1/3">Sản phẩm:</label>
                            <input
                                type="text"
                                name="product"
                                value={formData.product}
                                onChange={handleInputChange}
                                className="border-0 border-b-2 w-full border-dashed focus:outline-none"
                            />
                            </div>

                        <div className="flex items-center justify-between gap-2 col-span-3">

                        <label className="form__label w-1/6">Loại:</label>
                        <div className="flex">
                        <input
                            type="text"
                            name="color"
                            value={formData.type.color}
                            onChange={handleInputChange}
                            placeholder="Màu"
                            className="border-0 border-b-2 w-full border-dashed focus:outline-none"
                        />
                        <input
                            type="text"
                            name="ram"
                            value={formData.type.ram}
                            onChange={handleInputChange}
                            placeholder="RAM"
                            className="border-0 border-b-2 w-full border-dashed focus:outline-none"
                        />
                        </div>
                        </div>
                        </div>
                        <div className="flex justify-between gap-1 items-center mb-3">
                        <label className="form__label w-1/2">Thời gian bảo hành(tháng):</label>
                        <input
                            type="number"
                            name="warrantyPeriod"
                            value={formData.warrantyPeriod}
                            onChange={handleInputChange}
                            className="border-0 border-b-2 w-full border-dashed focus:outline-none"
                        /></div>

                        <div className="grid grid-cols-2 gap-2 mb-3">

                       
                        <div className="flex justify-between items-center">

                        
                        <label className="form__label w-2/3">Ngày bắt đầu:</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className="border-0 border-b-2 w-full border-dashed focus:outline-none"
                        /></div>
                        <div className="flex justify-between items-center">
                        <label className="form__label w-2/3">Ngày kết thúc:</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            className="border-0 border-b-2 w-full border-dashed focus:outline-none"
                        /></div></div>

                    </div>
                </DialogBody>
                <DialogFooter>
                <div className="m-0 grid grid-cols-2 gap-5 no-print">
                    <button
                            type="button"
                            className="w-full bg-primaryColor text-white text-[18px] rounded-lg px-2 py-1"
                            onClick={handlePrint}
                        >
                            IN
                        </button>
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-green-500 text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                        >
                            {loading ? <HashLoader size={35} color="#ffffff" /> : 'Lưu'}
                        </button>
                    </div>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

export default WarrantiesDetailDialog;
