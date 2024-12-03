/* eslint-disable react/prop-types */
import { toast } from "react-toastify";
import { BASE_URL } from "../../../../config.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetCategory from "../../../Hook/userFecthData.jsx";
import uploadImageToCloudinary from "../../../utils/uploadCloudinary.jsx";
import { AiOutlineDelete } from "react-icons/ai";
import ProductCarousel from "./ProductCarousel.jsx";
import HashLoader from 'react-spinners/HashLoader';
import boximg from '../../../assets/images/product.png'


const ProductAddDialog = ({ open, handleClose }) => {
    const { data: category = [] } = useGetCategory(`${BASE_URL}/category`);
    const { data: manuFacture = [] } = useGetCategory(`${BASE_URL}/manuFacture`);

    const defaultProduct = {
        quantity: 1,
        name: '',
        manuFacture: '',
        category: '',
        color: { hex: '#0000', name: '' },
        size: '',
        discount: 0,
        price: 0,
        photo: [],
        note: '',
    };
    const [formData, setFormData] = useState({
        products: [defaultProduct]
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

    const handleFileInputChange = async (event, index) => {
        const files = event.target.files;
        const updatedProducts = [...formData.products];

        if (files.length > 0) {
            const newUrls = await Promise.all(
                Array.from(files).map(file => uploadImageToCloudinary(file))
            );

            const newPhotos = newUrls.map(urlData => urlData.url);
            updatedProducts[index].photo = [...updatedProducts[index].photo, ...newPhotos];

            setFormData(prevFormData => ({
                ...prevFormData,
                products: updatedProducts,
            }));
        }
    };

    const deletePhoto = (index, photoIndex) => {
        const updatedProducts = [...formData.products];
        updatedProducts[index].photo.splice(photoIndex, 1);

        setFormData(prevFormData => ({
            ...prevFormData,
            products: updatedProducts,
        }));
    };


    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/productTemp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,

                })
            });
            const { message } = await response.json();

            if (!response.ok) {
                throw new Error(message);
            }

            toast.success(message);
            navigate('/product');
            handleClose();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    const stopPropagation = (e) => {
        e.stopPropagation();
    };
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

    const addProducts = (e) => {
        e.preventDefault();
        addItem({ quantity: 0, name: '', manuFacture: '', category: '', color: { hex: '', name: '' }, size: '', discount: '', price: '', photo: [] });
    };

    const deleteProduct = (e, index) => {
        e.preventDefault();
        deleteItem('products', index);
    };


    return (
        <>
            {open ? (
                <div
                    className="justify-center items-center bg-[rgba(0,0,0,0.5)] flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    onClick={handleClose} // Đóng modal khi click ra ngoài
                >
                    <div
                        className="relative my-6 mx-auto max-w-[1080px] "
                        onClick={stopPropagation} // Ngăn chặn đóng modal khi click vào chính modal
                    >
                        <div className="border-2 border-slate-500 rounded-lg  shadow-2xl h-[610px] overflow-y-auto relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className=" border-b-2 border-solid border-gray-900 p-5">
                                <div className="flex items-center gap-3 ">
                                    <div className="w-6 h-6"><img src={boximg} alt="" /></div>
                                    <div className="text-[18px] font-bold">Thêm sản phẩm</div>
                                </div>
                                <span className="pl-8">Quản lý thêm sản phẩm vào hệ thống</span>
                            </div>
                            <div className="p-5 px-10">
                                <form onSubmit={submitHandler}>
                                    <div className="font-bold mb-5 text-center text-[22px] ">
                                        <h2>Thông tin sản phẩm</h2>
                                    </div>
                                    {formData.products.map((item, index) => (
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
                                                <div className="mb-8  col-span-2 col-start-2">
                                                    {item.photo && item.photo.length > 0 ? (
                                                        <ProductCarousel photos={item.photo} deletePhoto={deletePhoto} index={index} />
                                                    ) : (
                                                        <p>Chưa có ảnh.</p>
                                                    )}
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            name="photo"
                                                            id={`file-input-${index}`}
                                                            accept=".jpg, .png"
                                                            multiple
                                                            onChange={(e) => handleFileInputChange(e, index)}
                                                            className="absolute bottom-0 left-10 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                        <label
                                                            htmlFor={`file-input-${index}`}
                                                            className=" flex items-center justify-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-primaryColor text-white font-semibold rounded-lg truncate cursor-pointer"
                                                        >
                                                            {item.photo.length > 0 ? 'Thêm ảnh' : 'Tải ảnh lên'}
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
                                                <div className="grid grid-cols-2 gap-6 mb-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Mã màu:</label>
                                                        <input
                                                            type="color"
                                                            name="color"
                                                            className="mt-1 p-2 w-full h-10 border border-gray-300 rounded-md"
                                                            value={item.color.hex}
                                                            onChange={e => handleProductChange(index, 'color', e.target.value, 'hex')}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Tên màu:</label>
                                                        <input
                                                            type="text"
                                                            name="colorName"
                                                            placeholder="Tên màu"
                                                            className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            value={item.color.name}
                                                            onChange={e => handleProductChange(index, 'color', e.target.value, 'name')}
                                                        />
                                                    </div>
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
                                                <button onClick={e => deleteProduct(e, index)} className="bg-red-600 rounded-full text-white text-[22px] m-auto mb-[30px] cursor-pointer">
                                                    <AiOutlineDelete />
                                                </button>
                                            </div>
                                        </div>))}
                                    <button onClick={addProducts} className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer">Thêm</button>
                                    <div className="flex items-center justify-end m-5">
                                    <button type="submit" className="bg-primaryColor py-2 w-[210px] rounded text-white h-fit cursor-pointer">
                                        {
                                            loading ? <HashLoader size={35} color="#ffffff" /> : 'Lưu'
                                        }
                                    </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>) : null}
        </>
    );
};

export default ProductAddDialog;
