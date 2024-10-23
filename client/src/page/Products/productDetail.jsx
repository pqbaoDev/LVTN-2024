/* eslint-disable react/prop-types */
import { toast } from "react-toastify";
import { BASE_URL, token } from "../../../config.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGetFile from "../../Hook/userFecthData.jsx";
import uploadImageToCloudinary from "../../utils/uploadCloudinary.jsx";
import Loading from "../../components/Loader/Loading.jsx";
import Error from "../../components/Error/Error.jsx";

const ProductDetail = ({ productId }) => {
    const { data: product, error } = useGetFile(productId ? `${BASE_URL}/product/${productId}` : null);

    const [formData, setFormData] = useState({
        siri: '',
        name: '',
        price: '',
        discount: '',
        color: '',
        size: '',
        photo: '',
        category: '',
        manuFacture: '',
        description: '',
        stock: ''  // Thêm trường stock vào formData
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState("");

    useEffect(() => {
        if (product) {
            setFormData({
                siri: product.siri || '',
                name: product.name || '',
                price: product.price || '',
                discount: product.discount || '',
                color: product.color || '',
                size: product.size || '',
                photo: product.photo || '',
                category: product.category || '',
                manuFacture: product.manuFacture || '',
                description: product.description || '',
                stock: product.stock || ''  // Cập nhật trường stock từ sản phẩm
            });
        }
    }, [product]);
    console.log("checkmanu",formData.manuFacture)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileInputChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const data = await uploadImageToCloudinary(file);
                setFormData(prevData => ({ ...prevData, photo: data.url }));  // Cập nhật trường photo
            } catch {
                toast.error("Error uploading image. Please try again.");
            }
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

    const submitHandler = async (event) => {
        event.preventDefault();
        setSubmitLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/product/${product._id}`, {
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
            navigate('/product');
            toast.success(message);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (error ) {
        return <Error message={error?.message } />;
    }

    if (!product && submitLoading) {
        return <Loading />;
    }

    return (
        <div className="h-screen">
            <div className="items-center text-center">
                <h1 className="heading">Sản Phẩm</h1>
            </div>
            <form onSubmit={submitHandler}>
                <div className="mx-0">
                    <div className="rounded-l-lg pb-10 pt-5">
                        <div className="mb-2 grid grid-cols-7 justify-center items-center">
                            <div className="col-span-2">
                                <p className="text-left font-semibold text-headingColor pl-2 ">Sản phẩm:</p>
                            </div>
                            <div className="col-span-5 ml-2">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Tên sản phẩm"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full text-[16px] border-0 border-b-2   border-solid  focus:outline-none"
                                    required
                                    
                                />
                            </div>
                        </div>
                        <div className="grid grid-rows-2 gap-y-2 mb-2">
                            <div className="grid grid-cols-2 items-center">
                                <p className="text-left font-semibold text-headingColor pl-2 ">Danh mục:</p>
                                <p className="text-left">{formData.category.name}</p>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-x-2">
                                <p className="text-left font-semibold text-headingColor pl-2 ">Thương hiệu:</p>
                                <p className="text-left">{formData.manuFacture.name}</p>
                            </div>
                        </div>

                        <div className="mt-5">
                            <div className="grid grid-cols-2 mb-8 shadow-lg">
                                <div className="flex flex-col items-center">
                                    <div className="mb-5 items-center flex">
                                        {formData.photo && (
                                            <figure className="w-[150px] shadow-xl p-2 border-2 border-solid border-primaryColor flex items-center justify-center">
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
                                                {formData.photo ? 'Thay đổi' : 'Tải ảnh lên'}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-2">
                                    <div className="flex gap-2 mb-2">
                                        <p>Màu sắc:</p>
                                        <input 
                                            type="color" 
                                            name="color" 
                                            value={formData.color || '#000000'} 
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                    <div className="flex gap-2 mb-2">
                                        <p>KT:</p>
                                        <input
                                            type='text'
                                            name='size'
                                            value={formData.size}
                                            className="w-[70px] border-0 focus:outline-none"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="flex gap-2 mb-2">
                                        <p>SL:</p>
                                        <input
                                            type='text'
                                            name='stock'
                                            value={formData.stock}
                                            className="w-[70px] border-0 focus:outline-none"
                                            onChange={handleInputChange}
                                            readOnly
                                        />
                                    </div>
                                    <div className="flex gap-2 mb-2">
                                        <p>Giá:</p>
                                        <input
                                            type='text'
                                            name='price'
                                            value={formData.price}
                                            className="w-[90px] border-0 focus:outline-none"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="flex gap-2 mb-2">
                                        <p>Giảm:</p>
                                        <input
                                            type='text'
                                            name='discount'
                                            value={formData.discount}
                                            className="w-[90px] border-0 focus:outline-none"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-2 grid grid-cols-1">
                                <p className="form__label">Mô tả:</p>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="border-2 rounded-lg border-solid border-[#0066ff61] focus:outline-none w-full"
                                    rows="4"
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end">
                            <button
                                type="submit"
                                className="py-2 px-5 rounded-lg text-white bg-primaryColor hover:bg-blue-700 duration-150 ease-in"
                            >
                                {submitLoading ? "Đang xử lý..." : "Lưu"}
                            </button>
                        </div>
                    </div>
                </div>
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
};

export default ProductDetail;
