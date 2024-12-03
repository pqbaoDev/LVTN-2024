/* eslint-disable no-unused-vars */
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
    const { data: product = [] } = useFetchData(`${BASE_URL}/productTemp`);
    // const { data: category = [] } = useFetchData(`${BASE_URL}/category`);
    // const { data: manuFacture = [] } = useFetchData(`${BASE_URL}/manuFacture`);
    const [isPallet, setIsPallet] = useState(false);
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

    // const handleFileInputChange = async (event, index) => {
    //     const files = event.target.files; // Lấy tất cả các file
    //     const updatedProducts = [...formData.products]; // Tạo bản sao của mảng products
    
    //     // Nếu có file, tải lên ảnh và lưu URL vào mảng photo của sản phẩm
    //     if (files.length > 0) {
    //         const newUrls = await Promise.all(
    //             Array.from(files).map(file => uploadImageToCloudinary(file)) // Tải lên từng file
    //         );
            
    //         // Lưu tất cả URL ảnh vào mảng photo của sản phẩm
    //         const newPhotos = newUrls.map(urlData => urlData.url);
    //         updatedProducts[index].photo = [...updatedProducts[index].photo, ...newPhotos]; // Cập nhật mảng ảnh
    
    //         // Cập nhật formData với mảng products mới
    //         setFormData(prevFormData => ({
    //             ...prevFormData,
    //             products: updatedProducts
    //         }));
    //     }
    // };

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

    const handleProductChange = (index, name, value, subField = null) => {
        const updatedProducts = formData.products.map((product, i) => {
            if (i === index) {
                if (subField && name === 'color') {
                    return {
                        ...product,
                        color: { ...product.color, [subField]: value }
                    };
                }
                return { ...product, [name]: value };
            }
            return product;
        });
        setFormData({ ...formData, products: updatedProducts });
    };
    

    const addProducts = (e) => {
        e.preventDefault();
        addItem({quantity: 0, name: '', manuFacture: '', category: '', color: { hex: '', name: '' }, size: '', discount: '', price: '', photo: [] });
    };

    const deleteProduct = (e, index) => {
        e.preventDefault();
        deleteItem('products', index);
    };
    const handleSelectedProductChange = (index, productId) => {
        const selectedProduct = product.find(prod => prod._id === productId);
    
        if (selectedProduct) {
            const updatedProducts = formData.products.map((prod, i) => {
                if (i === index) {
                    return {
                        ...prod,
                        _id: productId  // Chỉ lưu _id của sản phẩm đã chọn
                    };
                }
                return prod;
            });
    
            setFormData(prevFormData => ({
                ...prevFormData,
                products: updatedProducts
            }));
        }
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
                {formData.products.map((item, index) => {
    // Tìm sản phẩm từ mảng product dựa trên productId
    const selectedProduct = product.find(prod => prod._id === item._id);

    return (
        <div key={index} className="mx-5 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Chọn sản phẩm:</label>
                    <select
                        name="selectedProduct"
                        className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => handleSelectedProductChange(index, e.target.value)}
                        value={item._id || ''}  // Đảm bảo rằng giá trị là productId
                    >
                        <option value="">Chọn sản phẩm</option>
                        {product.map((prod) => (
                            <option key={prod._id} value={prod._id}>
                                {prod.category.name} {prod.name} {prod.size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            {/* Hiển thị thông tin sản phẩm nếu sản phẩm đã được chọn */}
            {selectedProduct && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên sản phẩm:</label>
                            <input
                                type="text"
                                name="name"
                                className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={selectedProduct.name}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Thương hiệu:</label>
                            <input
                                type="text"
                                name="manuFacture"
                                className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={selectedProduct.manuFacture.name}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Danh mục:</label>
                            <input
                                type="text"
                                name="category"
                                className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={selectedProduct.category.name}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kích thước:</label>
                            <input
                                type="text"
                                name="size"
                                className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={selectedProduct.size}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mã màu:</label>
                            <input
                                type="color"
                                name="colorHex"
                                className="mt-1 p-2 w-full h-10 border border-gray-300 rounded-md"
                                value={selectedProduct.color?.hex || ''}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên màu:</label>
                            <input
                                type="text"
                                name="colorName"
                                placeholder="Tên màu"
                                className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={selectedProduct.color?.name || ''}
                                readOnly
                            />
                        </div>
                    </div>
                </>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700">Số lượng:</label>
                <input
                    type="number"
                    name="quantity"
                    className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={item.quantity}
                    onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Giá:</label>
                <input
                    type="number"
                    name="price"
                    className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={item.price}
                />
            </div>
            <div>
                <button onClick={e => deleteProduct(e, index)} className="bg-red-600 rounded-full text-white text-[22px] m-auto mb-[30px] cursor-pointer">
                    <AiOutlineDelete />
                </button>
            </div>
        </div>
    );
})}


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
