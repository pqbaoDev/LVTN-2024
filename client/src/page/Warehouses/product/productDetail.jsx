/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { BASE_URL, token } from "../../../../config";
import useFetchData from "../../../Hook/userFecthData";
import uploadImageToCloudinary from "../../../utils/uploadCloudinary";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { useNavigate } from "react-router-dom";

import { FaRegTrashAlt } from "react-icons/fa";

import { toast } from "react-toastify";
import ProductDelete from "./productDelete";




const ProductDetail = ({ productId, open, handleClose,setRefetch }) => {
    const { data: product } = useFetchData(`${BASE_URL}/product/${productId}`);
    const [isOpenDelete,setIsOpenDelete] = useState(false);
    const [selectedId,setSelectedId] = useState('')
    // eslint-disable-next-line no-unused-vars
    const [selectedFile, setSelectedFile] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        photo: [],
        category: '',
        manuFacture: '',
        discount: '',
        stock: '',
        price: '',
        color: {
            hex: '',
            name: '',
        },
        discription: '',
        location: '',
        avatar:'',
        size: '',
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                photo: product.photo || [],
                category: product.category || '',
                manuFacture: product.manuFacture || '',
                discount: product.discount || '',
                avatar:product.avatar || '',
                stock: product.stock || '',
                size: product.size || '',
                price: product.price || '',
                color: {
                    hex: product.color?.hex || '',
                    name: product.color?.name || '',
                },
                discription: product.discription || '',
                location: product.location || '',
            });
        }
    }, [product]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => {
            // Nếu trường cần cập nhật là 'color'
            if (name === 'colorHex') {
                return {
                    ...prevFormData,
                    color: {
                        ...prevFormData.color,
                        hex: value,
                    },
                };
            } else if (name === 'colorName') {
                return {
                    ...prevFormData,
                    color: {
                        ...prevFormData.color,
                        name: value,
                    },
                };
            }

            // Cập nhật các trường khác
            return {
                ...prevFormData,
                [name]: value,
            };
        });
    };
    const handleFileAvatar = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const data = await uploadImageToCloudinary(file);
            setSelectedFile(data.url);
            setFormData({ ...formData, avatar: data.url });
        }
    };


    const stopPropagation = (e) => e.stopPropagation();

    const handleFileInputChange = async (event) => {
        const files = event.target.files;

        if (files.length > 0) {
            const newUrls = await Promise.all(
                Array.from(files).map(file => uploadImageToCloudinary(file))
            );

            const newPhotos = newUrls.map(urlData => urlData.url);

            setFormData(prevFormData => ({
                ...prevFormData,
                photo: [...prevFormData.photo, ...newPhotos],
            }));
        }
    };

    const deletePhoto = (photoIndex) => {
        const updatedPhotos = [...formData.photo];
        updatedPhotos.splice(photoIndex, 1);

        setFormData(prevFormData => ({
            ...prevFormData,
            photo: updatedPhotos,
        }));
    };
    const [submitLoading, setSubmitLoading] = useState(false);
    const navigate = useNavigate();
    const submitHandler = async (event) => {
        event.preventDefault();
        setSubmitLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/product/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const { message } = await res.json();

            if (!res.ok) {
                throw new Error(message);
            }
            handleClose()
            navigate('/warehouse/product');
            toast.success(message);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitLoading(false);
        }
    };
    const handelOpenDelete = (id)=>{
        setSelectedId(id);
        setIsOpenDelete(true);
    }
    const handleCloseDelete = ()=>{
        setIsOpenDelete(false);
        setSelectedId(null)
    }


    return (
        <>
            {open ? (
                <div
                    className="justify-center items-center bg-[rgba(0,0,0,0.5)] flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    onClick={handleClose}
                >
                    <div
                        className="relative my-6 mx-auto w-1/3 h-[613px] overflow-y-auto  "
                        onClick={stopPropagation}
                    >
                        <div className="border-2 border-slate-500 rounded-lg shadow-2xl relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className="border-b border-gray-800 px-3 py-2">
                                <h2 className="text-[20px] font-normal">Chi tiết sản phẩm</h2>
                                <p className="text-gray-500 text-[16px]">Quản lý thông tin sản phẩm</p>
                            </div>

                            {/* Hiển thị ảnh */}
                            <div className="mx-auto overflow-x-roll">


                                <div className="mt-1 flex flex-wrap gap-4 w-[250px]">
                                    <Swiper
                                        modules={[Navigation, Pagination]}
                                        spaceBetween={10}
                                        slidesPerView={1}
                                        navigation
                                        pagination={{ clickable: true }}
                                        className="w-full h-full text-gray-500"
                                    >
                                        {formData.photo.map((photo, idx) => (
                                            <SwiperSlide key={idx}>
                                                <div className="relative">
                                                    <img
                                                        src={photo}
                                                        alt={`Photo ${idx}`}
                                                        className="w-full h-auto object-cover rounded-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => deletePhoto(idx)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                                                    >
                                                        <FaRegTrashAlt />
                                                    </button>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>

                                <div className="relative">
                                    <input
                                        type="file"
                                        name="photo"
                                        accept=".jpg, .png"
                                        multiple
                                        onChange={handleFileInputChange}
                                        className="absolute bottom-0 left-10 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <label

                                        className=" flex items-center mx-auto my-3 w-[180px] justify-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-primaryColor text-white font-semibold rounded-lg truncate cursor-pointer"
                                    >
                                        Thêm ảnh
                                    </label>
                                </div>

                            </div>
                            <div className="p-5">
                            <div className="my-8 border-l border-slate-300 pt-5 ">
                        {formData.avatar && (
                            <figure className="w-[272px]   flex items-center justify-center mx-auto">
                                <img src={formData.avatar} alt="User Avatar" className=" w-full "  />
                            </figure>
                        )}
                        <div className="flex items-center justify-center">
                            <div className="w-[170px] mx-auto">
                            <input
                                type="file"
                                name="avatar"
                                id="customfile"
                                accept=".jpg, .png"
                                onChange={handleFileAvatar}
                                className="  opacity-0 cursor-pointer"
                            />
                            <label
                                htmlFor="customfile"
                                className=" border px-3 py-2  ml-[40px]  overflow-hidden  text-headingColor  truncate cursor-pointer"
                            >
                                Chọn Avatar
                            </label>
                            <p className="text-justify ml-[px] text-[14px] text-slate-500 italic mt-3">Dụng lượng file tối đa 1 MB
                            Định dạng:.JPEG, .PNG</p>
                        </div>
                        </div>
                    </div>

                                <div className=" mb-5">
                                    {/* Thông tin sản phẩm */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tên sản phẩm:</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={formData.name}
                                            readOnly
                                        />
                                    </div>

                                </div>
                                <div className="flex items-center gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Danh mục:</label>
                                        <input
                                            type="text"
                                            name="category"
                                            className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={formData.category.name}
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Thương hiệu:</label>
                                        <input
                                            type="text"
                                            name="manuFacture"
                                            className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={formData.manuFacture.name}
                                            readOnly
                                        />
                                    </div>
                                    {/* <div>
                                        <label className="block text-sm font-medium text-gray-700">Kích thước:</label>
                                        <input
                                            type="text"
                                            name="size"
                                            className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={formData.size}
                                            readOnly
                                        />
                                    </div> */}
                                </div>
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="flex flex-col ">
                                        <input onChange={handleInputChange} type="color" name="colorHex" value={formData.color.hex} id="" />
                                        <input onChange={handleInputChange} type="text" name="colorName" value={formData.color.name} className="mt-1 p-3 block  rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
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
                                <div className="flex items-center gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Số lượng:</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Giá:</label>
                                        <input
                                            type="number"
                                            name="price"
                                            className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Giảm giá:</label>
                                        <input
                                            type="number"
                                            name="discount"
                                            className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={formData.discount}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mô tả:</label>
                                    <textarea 
                                    name="discription" id="" rows="10" cols='50' 
                                    value={formData.discription} 
                                    onChange={handleInputChange}
                                    className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                ></textarea>
                                    

                                </div>
                            </div>
                            <div className="m-5 flex justify-end gap-5">
                            <button
                            onClick={()=>handelOpenDelete(productId)}
                                type="submit"
                                className="py-2 px-5 w-[210px] rounded-lg text-red-500 hover:text-red-400 border border-red-500 duration-150 ease-in"
                            >
                                {submitLoading ? "Đang xử lý..." : "Xóa"}
                            </button>
                            <button
                            onClick={submitHandler}
                                type="submit"
                                className="py-2 px-5 w-[210px] rounded-lg text-white bg-primaryColor hover:bg-blue-700 duration-150 ease-in"
                            >
                                {submitLoading ? "Đang xử lý..." : "Lưu"}
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            ) : null}
            <ProductDelete
                    open={isOpenDelete}
                    handleClose={handleCloseDelete}
                    productId={selectedId}
                    setRefetch={setRefetch}
                 />
        </>
    );
};

export default ProductDetail;
