/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { BASE_URL } from "../../../../config";
import useFetchData from "../../../Hook/userFecthData";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import uploadImageToCloudinary from "../../../utils/uploadCloudinary";
import { AiOutlineDelete } from "react-icons/ai";

const DetailStokIn = ({ zone, submitHandler, formData, setFormData, location }) => {
    const [selectZoneId, setSelectedZoneId] = useState('');
    const { data: category = [] } = useFetchData(`${BASE_URL}/category`);
    const { data: manuFacture = [] } = useFetchData(`${BASE_URL}/manuFacture`);
    const [isPallet, setIsPallet] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState("");

    const handleCheckboxChange = () => {
        const newIsPallet = !isPallet;
        setIsPallet(newIsPallet);
        setFormData((prevFormData) => ({
            ...prevFormData,
            type: newIsPallet ? 'pallet' : 'rack'
        }));
    };

    const handleInputChange = (e) => {
        setFormData(prevData => ({
            ...prevData, [e.target.name]: e.target.value
        }));
    };

    const handleFileInputChange = async (event, index) => {
        const files = event.target.files; // Lấy tất cả các file
        const updatedProducts = [...formData.products]; // Tạo bản sao của mảng products
    
        // Nếu có file, tải lên ảnh đầu tiên và lưu URL
        if (files.length > 0) {
            const file = files[0]; // Lấy file đầu tiên
            const data = await uploadImageToCloudinary(file);
            setSelectedFile(data.url)
            updatedProducts[index].photo = data.url; // Lưu URL vào trường photo
        }
    
        // Cập nhật formData với mảng products mới
        setFormData(prevFormData => ({
            ...prevFormData,
            products: updatedProducts
        }));
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

    const addItem = (item) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            products: [...prevFormData.products, item]
        }));
    };

    const deleteItem = (key, index) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [key]: prevFormData[key].filter((_, i) => i !== index)
        }));
    };

    const handleProductChange = (index, name, value) => {
        const updatedProducts = formData.products.map((product, i) =>
            i === index ? { ...product, [name]: value } : product
        );
        setFormData({ ...formData, products: updatedProducts });
    };

    const addProducts = (e) => {
        e.preventDefault();
        addItem({quantity: 0, name: '', manuFacture: '', category: '', color: '', size: '', discount: '', price: '',photo:'' });
    };

    const deleteProduct = (e, index) => {
        e.preventDefault();
        deleteItem('products', index);
    };


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
                            <option value={location.zone._id}>{location.zone.name}</option>
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
                            checked={formData.type === 'pallet' ? true : isPallet}
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
                            Vị trí ({isPallet || formData.type ? 'Pallet' : 'Rack'}):
                        </label>
                        <input
                            type="text"
                            name={isPallet || formData.type ? 'pallet' : 'rack'}
                            className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData[isPallet || formData.type === 'pallet' ? 'pallet' : 'rack']}
                            onChange={handleInputChange}
                        />
                    </div>

                    {(!isPallet && formData.type !== 'pallet') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tầng:</label>
                            <input
                                type="number"
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
                {formData.products.map((item,index)=>(
                    <div key={index} className="mx-5 mb-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                                <label className="block text-sm font-medium text-gray-700">Danh mục:</label>
                                <select
                                    name="category"
                                    className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={item.category}
                                    onChange={e => handleProductChange(index, 'category', e.target.value)}
                                >
                                    <option value="">Chọn danh mục</option>
                                    {category.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Thương hiệu:</label>
                                <select
                                    name="manuFacture"
                                    className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={item.manuFacture}
                                    onChange={e => handleProductChange(index, 'manuFacture', e.target.value)}
                                >
                                    <option value="">Chọn thương hiệu</option>
                                    {manuFacture.map(manu => (
                                        <option key={manu._id} value={manu._id}>{manu.name}</option>
                                    ))}
                                </select>
                            </div>
                    </div>

                    <div className="grid grid-cols-12 mb-6">
                        <div className="mb-5 flex items-center justify-center col-span-2 col-start-3">
                            {item.photo && (
                                <figure className="w-[130px] shadow-xl p-2 border-2 border-solid border-primaryColor flex items-center justify-center">
                                    <img
                                        src={item.photo}
                                        alt="Uploaded product"
                                        className="toZoom"
                                        onClick={() => openModal(item.photo)}
                                    />
                                </figure>
                            )}
                            <div className="relative">
                                <input
                                    type="file"
                                    name="photo"
                                    id={`file-input-${index}`}
                                    accept=".jpg, .png"
                                    onChange={(e) => handleFileInputChange(e, index)}
                                    className="absolute bottom-0 left-10 w-full h-full opacity-0 cursor-pointer"
                                />
                                <label
                                    htmlFor={`file-input-${index}`}
                                    className="absolute top-9 -left-28 flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-primaryColor text-white font-semibold rounded-lg truncate cursor-pointer"
                                >
                                    {selectedFile || item.photo ? 'Thay đổi' : 'Tải ảnh lên'}
                                </label>
                            </div>
                        </div>
                        <div className="col-span-7 col-start-7">
                        <label className="block text-sm font-medium text-gray-700">Tên sản phẩm:</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={item.name}
                                    onChange={e => handleProductChange(index, 'name', e.target.value)}
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
                                value={item.color}
                                onChange={e => handleProductChange(index, 'color', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kích thước:</label>
                            <input
                                type="text"
                                name="size"
                                className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={item.size}
                                onChange={e => handleProductChange(index, 'size', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                        <label className="block text-sm font-medium text-gray-700">Số lượng:</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={item.quantity}
                                    onChange={e => handleProductChange(index, 'quantity', e.target.value)}
                                />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Giá:</label>

                            <input
                                type="number"
                                name="price"
                                placeholder="Giá"
                                className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={item.price}
                                onChange={e => handleProductChange(index, 'price', e.target.value)}
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
                            value={item.note}
                            onChange={e => handleProductChange(index, 'note', e.target.value)}
                        />
                    </div>
                    <div >

                                <button  onClick={e => deleteProduct(e, index)} className="bg-red-600 rounded-full text-white text-[22px] m-auto mb-[30px] cursor-pointer">
                                        <AiOutlineDelete />
                                </button>
                            </div>
                </div> ))}
                <button onClick={addProducts} className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer">Thêm sản phẩm</button>
                
                
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
