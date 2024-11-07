/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import SaveIcon from "../../../assets/images/saveIcon.png";
import CategoryIcon from "../../../assets/images/category2.png";
import { useState } from "react";
import { BASE_URL } from "../../../../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddRackAndPallet = ({ open, handleClose, stopPropagation, location, zoneName, zone, zoneId }) => {
    const [formData, setFormData] = useState({
        zoneId:zoneId,
        type: 'rack', // sẽ thay đổi giữa 'pallet' và 'rack'
        capacity: 20,
        rack: '', // Đổi thành chuỗi
        pallet: '', // Đổi thành chuỗi
        level: '',
    });

    const [loading, setLoading] = useState(false);
    const [isPallet, setIsPallet] = useState(false); // State để theo dõi checkbox pallet

    const navigate = useNavigate();

    // Cập nhật form khi có thay đổi từ input
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Toggle giữa pallet và rack
    const handleCheckboxChange = () => {
        const newIsPallet = !isPallet;  // Lưu trạng thái mới của checkbox
        setIsPallet(newIsPallet);  // Cập nhật checkbox
        setFormData((prevFormData) => ({
            ...prevFormData,
            type: newIsPallet ? 'pallet' : 'rack' // Cập nhật type dựa trên trạng thái mới
        }));
    };

    // Cập nhật zoneId khi người dùng chọn khu vực khác
    const handleZoneChange = (event) => {
        const { value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            zoneId: value,
        }));
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/location`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const { message } = await response.json();
            if (!response.ok) {
                throw new Error(message);
            }
            toast.success(message);
            navigate('/warehouse');
        } catch (error) {
            toast.error(`Lỗi: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {open ? (
                <div>
                    <div
                        onClick={() => handleClose()}
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-2/3 my-5 mx-auto max-w-3xl" onClick={stopPropagation}>
                            <div className="border-0 p-5 bg-blue-500 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                                <div className="flex items-start justify-between border-b border-solid border-blueGray-200 rounded-t">
                                    <div className="flex gap-2 items-center">
                                        <img src={CategoryIcon} className="w-4 h-4" alt="Category Icon" />
                                        <h3 className="text-[14px] font-normal">Danh sách khu vực</h3>
                                    </div>
                                    <button
                                        className="p-2 ml-auto border-0 rounded-b-none hover:bg-red-500 hover:text-white text-black float-right text-lg leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => handleClose()}
                                    >
                                        <span className="mx-auto">x</span>
                                    </button>
                                </div>

                                <div className="relative  flex-auto">
                                    <div className="border-b-2 px-2 py-1 bg-white">
                                        <div className="items-center cursor-pointer" >
                                            <div className="w-6" onClick={submitHandler}>
                                            <img src={SaveIcon} className="w-6 h-6" alt="Save Icon" />
                                            <p className="text-[12px] font-normal">Lưu</p>
                                            </div>
                                        </div>
                                    </div>
                                        <div className="h-3 bg-blue-500">

                                        </div>
                                    <div className="bg-white h-[300px] overflow-auto relative ">
                                        <table className="border-slate-400 border-t-2">
                                            <thead className="bg-blue-300  sticky top-0 z-10">
                                                <tr>
                                                    <th className=" border-0 border-r-2 border-solid border-slate-400 p-1"></th>
                                                    <th className=" border-0 border-r-2 border-solid border-slate-400 p-1">Kệ</th>
                                                    <th className=" border-0 border-r-2 border-solid border-slate-400 p-1">TẦNG</th>
                                                    <th className=" border-0 border-r-2 border-solid border-slate-400 p-1">SỨC CHỨA</th>
                                                    <th className="w-1/3 border-2 border-r-0 border-solid border-slate-400 p-1"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {location.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="w-4 bg-white hover:bg-blue-200 text-center items-center border-2 border-l-0 border-solid border-slate-400 p-1"></td>
                                                        <td className={`bg-white hover:bg-blue-200 border-2 border-solid border-slate-400 uppercase p-1 ${item.type == 'pallet' ? 'text-primaryColor' : ''}`}>
                                                            {item.rack ? item.rack : item.pallet}
                                                        </td>
                                                        <td className="bg-white hover:bg-blue-200 w-1/6 border-2 border-solid border-slate-400 p-1">{item.level}</td>
                                                        <td className="bg-white hover:bg-blue-200 w-1/6 border-2 border-solid border-slate-400 p-1">{item.capacity}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="border-2 border-solid border-slate-400 px-2">
                                        <h1 className="text-[16px] font-bold text-black">Thông tin</h1>
                                        <form onSubmit={submitHandler}>
                                            <div className="grid grid-cols-8 w-3/4 items-center mx-auto">
                                                <div className="flex gap-3 col-span-5">
                                                    <p className="form__label text-black">Khu</p>
                                                    <select 
                                                        name="zoneId" 
                                                        className="border-2 p-1 w-2/3 border-slate-300 focus:outline-none"
                                                        onChange={handleZoneChange}
                                                        value={formData.zoneId}
                                                    >
                                                        <option value={zoneId}>{zoneName}</option>
                                                        {zone?.map((item, index) => (
                                                            <option key={index} value={item._id}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="mx-auto mt-3 w-3/4">
                                            <div className="grid grid-cols-2">
                                                <div className="flex items-center justify-center mb-5">
                                                    <p className="form__label text-black w-1/6">Mã</p>
                                                    <input
                                                        type="text"
                                                        name={isPallet ? "pallet" : "rack"}
                                                        value={isPallet ? formData.pallet : formData.rack}
                                                        onChange={handleChange}
                                                        placeholder="Nhập mô tả"
                                                        className="border-2 p-1 w-full border-slate-300 focus:outline-none"
                                                    />
                                                </div>
                                                <div className="flex  justify-center  mb-5">
                                                    <input
                                                        type="checkbox"
                                                        name="type"
                                                        className=""
                                                        checked={isPallet}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className=" w-1/6 mt-1 mx-2">pallet</label>
                                                </div>
                                                </div>
                                                {
                                                    !isPallet && (
                                                      <div className="grid grid-cols-2 ga-3">
                                                        <div className="flex items-center mb-5">
                                                            <p className="form__label text-black w-1/4">Tầng</p>
                                                            <input 
                                                                type="number" 
                                                                name="level" 
                                                                className="border-2 p-1 w-1/3 border-slate-300 focus:outline-none" 
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                        <div className="flex items-center mb-5">
                                                            <p className="form__label text-black w-1/3">Sức chức:</p>
                                                            <input 
                                                                type="number" 
                                                                name="capacity" 
                                                                className="border-2 p-1 w-1/3 border-slate-300 focus:outline-none" 
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                        </div>
                                                    )
                                                }
                                                
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </div>
            ) : null}
        </>
    );
};

export default AddRackAndPallet;
