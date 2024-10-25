/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { BASE_URL } from "../../../../config";
import useFetchData from "../../../Hook/userFecthData";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import uploadImageToCloudinary from "../../../utils/uploadCloudinary";

const DetailStokIn = ({ zone,submitHandler,formData,setFormData }) => {

    const [selectZoneId, setSelectedZoneId] = useState('')
    const { data: category = [] } = useFetchData(`${BASE_URL}/category`);
    const { data: manuFacture = [] } = useFetchData(`${BASE_URL}/manuFacture`);
    const [isPallet, setIsPallet] = useState(false);
    const [categoryId, setCategoryId] = useState("");
    const [manuFactureId, setManuFactureId] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState("");


    // const [formData, setFormData] = useState({
    //     name: '',
    //     category: categoryId,
    //     manuFacture: manuFactureId,
    //     photo: '',
    //     color: '',
    //     size: '',
    //     discount: '',
    //     price: '',
    //     stock: '',
    //     tags: '',
    //     rating: '',
    //     rack: '',
    //     pallet: '',
    //     level: '',
    //     type: 'rack',
    //     date: '',
    //     status:'Đã hoàn tất',
    //     note:'',
    //     quantity: '',
    //     employeeId: employee._id
    // })
    const handleCheckboxChange = () => {
        const newIsPallet = !isPallet;  // Lưu trạng thái mới của checkbox
        setIsPallet(newIsPallet);  // Cập nhật checkbox
        setFormData((prevFormData) => ({
            ...prevFormData,
            type: newIsPallet ? 'pallet' : 'rack' // Cập nhật type dựa trên trạng thái mới
        }));
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleFileInputChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const data = await uploadImageToCloudinary(file);
            setSelectedFile(data.url);
            setFormData({ ...formData, photo: data.url });
        }
    };

    const openModal = (imageUrl) => {
        setModalImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalImage("");
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isModalOpen) {
                closeModal();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isModalOpen]);
    // const submitHandler = async (event) => {
    //     event.preventDefault();
    //     setLoading(true);
    //     try {
    //         const response = await fetch(`${BASE_URL}/product`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 ...formData,
                    
    //             })
    //         });
    //         const { message } = await response.json();

    //         if (!response.ok) {
    //             throw new Error(message);
    //         }

    //         toast.success(message);
    //         navigate('/warehouse');
    //     } catch (error) {
    //         toast.error(error.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    return (
        <div className="container mx-auto p-8 bg-gray-100 rounded-lg shadow-lg">
        <form onSubmit={submitHandler}>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày:</label>
                    <input
                        type="date"
                        name="date"
                        onChange={handleInputChange}
                        className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
    
                <div>
                    <label className="block text-sm font-medium text-gray-700">Kho:</label>
                    <select
                        name="zone"
                        className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={e => setSelectedZoneId(e.target.value)}
                        value={selectZoneId}
                    >
                        <option value="">Chọn khu vực</option>
                        {zone?.map((item, index) => (
                            <option key={index} value={item._id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
    
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="type"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={isPallet}
                        onChange={handleCheckboxChange}
                    />
                    <label className="ml-3 text-sm font-medium text-gray-700">Pallet</label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái:</label>
                    <select
                        name="status"
                        className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={handleInputChange}
                        value={formData.status}
                    >
                        <option value="">Chọn trạng thái</option>
                        <option value="Đã hoàn tất">Đã hoàn tất</option>
                        <option value="Chưa hoàn tất">Chưa hoàn tất</option>
                    </select>
                </div>

            </div>
    
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Vị trí ({isPallet ? 'Pallet' : 'Rack'}):
                    </label>
                    <input
                        type="text"
                        name={isPallet ? 'pallet' : 'rack'}
                        className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData[isPallet ? 'pallet' : 'rack']}
                        onChange={handleInputChange}
                    />
                </div>
    
                {!isPallet && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tầng:</label>
                        <input
                            type="text"
                            name="level"
                            className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.level}
                            onChange={handleInputChange}
                        />
                    </div>
                )}
            </div>
    
                <div className="font-bold mb-2">
                    <h2>Thông tin sản phẩm:</h2>
                </div>
                <div className="mx-5 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Danh mục:</label>
                    <select
                        name="category"
                        className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={categoryId}
                        onChange={e => {
                            setCategoryId(e.target.value);
                            handleInputChange(e);
                        }}
                    >
                        <option value="">Chọn danh mục</option>
                        {category.map(item => (
                            <option key={item._id} value={item._id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
    
                <div>
                    <label className="block text-sm font-medium text-gray-700">Thương hiệu:</label>
                    <select
                        name="manuFacture"
                        className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={manuFactureId}
                        onChange={e => {
                            setManuFactureId(e.target.value);
                            handleInputChange(e);
                        }}
                    >
                        <option value="">Chọn thương hiệu</option>
                        {manuFacture.map(item => (
                            <option key={item._id} value={item._id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
    
            <div className="grid grid-cols-12 mb-6">
                    <div className="mb-5 flex items-center justify-center col-span-2 col-start-3">
                        {formData.photo && (
                            <figure className="w-[130px] shadow-xl p-2 border-2 border-solid border-primaryColor flex items-center justify-center">
                                <img
                                    src={formData.photo}
                                    alt="Uploaded product"
                                    className="toZoom"
                                    onClick={() => openModal(formData.photo)}
                                />
                            </figure>
                        )}
                        <div className="relative">
                            <input
                                type="file"
                                name="photo"
                                id="file-input"
                                accept=".jpg, .png"
                                onChange={handleFileInputChange}
                                className="absolute bottom-0 left-10 w-full h-full opacity-0 cursor-pointer"
                            />
                            <label
                                htmlFor="file-input"
                                className="absolute top-9 -left-28 flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-primaryColor text-white font-semibold rounded-lg truncate cursor-pointer"
                            >
                                {selectedFile || formData.photo ? 'Thay đổi' : 'Tải ảnh lên'}
                            </label>
                        </div>
                    </div>
                <div className="col-span-7 col-start-7">
                    <label className="block text-sm font-medium text-gray-700">Sản phẩm:</label>
                    <input
                        type="text"
                        name="name"
                        className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
    
            <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Màu:</label>
                    <input
                        type="color"
                        name="color"
                        className="mt-1 p-2 w-full h-10 border border-gray-300 rounded-md"
                        value={formData.color}
                        onChange={handleInputChange}
                    />
                </div>
    
                <div>
                    <label className="block text-sm font-medium text-gray-700">Kích thước:</label>
                    <input
                        type="text"
                        name="size"
                        className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.size}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
    
            <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Số lượng:</label>

                    <input
                        type="number"
                        name="quantity"
                        placeholder="Số lượng"
                        className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.quantity}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Giá:</label>

                    <input
                        type="number"
                        name="price"
                        placeholder="Giá"
                        className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.price}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div>
                    <label className="block text-sm font-medium text-gray-700">Ghi chú:</label>

                    <input
                        type="text"
                        name="note"
                        placeholder="ghi chú"
                        className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.note}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
{/*     
            <div className="flex justify-center mt-8">
                <button
                    type="submit"
                    className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    disabled={loading}
                >
                    {loading ? "Đang xử lý..." : "Lưu thông tin"}
                </button>
            </div> */}
        </form>
        {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-5">
                        <button onClick={closeModal} className="absolute top-0 right-0 m-2 text-lg">X</button>
                        <img src={modalImage} alt="Phóng to" className="max-w-full h-auto" />
                    </div>
                </div>
            )}
    </div>
    
    );
}

export default DetailStokIn;
