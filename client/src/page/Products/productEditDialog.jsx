/* eslint-disable react/prop-types */
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter
} from "@material-tailwind/react";
import closeIcon from "../../assets/images/close.png";
import { toast } from "react-toastify";
import { BASE_URL, token } from "../../../config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGetFile from "../../Hook/userFecthData.jsx";
import uploadImageToCloudinary from "../../utils/uploadCloudinary";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";


const ProductEditDialog = ({ open, handleClose, productId }) => {
    const { data: product, error: productError } = useGetFile(productId ? `${BASE_URL}/product/${productId}` : null);
    const { data: category = [], error: categoryError } = useGetFile(`${BASE_URL}/category`);
    const { data: manuFacture = [], error: manuFactureError } = useGetFile(`${BASE_URL}/manuFacture`);

    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        photo: '',
        discount: '',
        stock: '',
        price: '',
        category: '',
        manuFacture: '',
        description: '',
    });
    const navigate = useNavigate();
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                discount: product.discount || '',
                stock: product.stock || '',
                photo: product.photo || '',
                category: product.category || '',
                manuFacture: product.manuFacture || '',
                price: product.price || '',
                description: product.description || '',
            });
        }
    }, [product]);

    const handleInputChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileInputChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const data = await uploadImageToCloudinary(file);
                setSelectedFile(data.url);
                setFormData({ ...formData, photo: data.url });
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                toast.error("Error uploading image.");
            }
        }
    };

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
            handleClose();
            toast.success(message);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (productError || categoryError || manuFactureError) {
        return <Error message="Error loading data." />;
    }

    if (!product && submitLoading) {
        return <Loading />;
    }

    return (
        <Dialog
            open={open}
            handler={handleClose}
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
                        Chỉnh sửa <span className="text-primaryColor">Sản phẩm</span>
                    </h3>
                    <div className="absolute top-2 right-2">
                        <img src={closeIcon} onClick={handleClose} className='w-5 h-5 cursor-pointer' alt="Close" />
                    </div>
                </DialogHeader>
                <DialogBody className="p-2">
                    <div className="max-w-[1170px] mx-auto">
                        <div className="rounded-l-lg lg:pl-16 py-10">
                            <div className="mb-5 items-center gap-3 flex">
                                {selectedFile && (
                                    <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
                                        <img src={formData.photo} alt="Preview" className="w-full rounded-full" />
                                    </figure>
                                )}
                                <div className="relative w-[130px] h-[50px]">
                                    <input
                                        type="file"
                                        name="photo"
                                        id="customfile"
                                        accept=".jpg, .png"
                                        onChange={handleFileInputChange}
                                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <label
                                        htmlFor="customfile"
                                        className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
                                    >
                                        Thêm ảnh
                                    </label>
                                </div>
                            </div>
                            <div className="mb-5">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Tên sản phẩm"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full pr-4 py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <input
                                    type="number"
                                    name="stock"
                                    placeholder="Số lượng"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    className="w-full pr-4 py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Giá"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full pr-4 py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <input
                                    type="number"
                                    name="discount"
                                    placeholder="Giá giảm"
                                    value={formData.discount}
                                    onChange={handleInputChange}
                                    className="w-full pr-4 py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <div className="grid grid-cols-2 gap-5 mb-[30px]">
                                    <div>
                                        <p className="form__label">Danh mục:</p>
                                        <select
                                            name="category"
                                            className="form__input py-3.5"
                                            value={formData.category}
                                            onChange={handleInputChange}
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
                                        <p className="form__label">Thương hiệu:</p>
                                        <select
                                            name="manuFacture"
                                            className="form__input py-3.5"
                                            value={formData.manuFacture}
                                            onChange={handleInputChange}
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
                            </div>
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <div >
                        <button 
                            disabled={submitLoading}
                            type="submit" 
                            className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                        >
                            {submitLoading ? <Loading size={25} color="#ffffff" /> : 'Cập nhật'}
                        </button>
                    </div>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

export default ProductEditDialog;
