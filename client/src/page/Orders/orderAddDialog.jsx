/* eslint-disable react/prop-types */

import closeIcon from "../../assets/images/close.png";
import { useState } from 'react';
import { BASE_URL } from '../../../config';
import useFetchData from '../../Hook/userFecthData';
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import HashLoader from 'react-spinners/HashLoader';




const OrderAddDialog = ({ open, handleClose,setRefetch }) => {
    const [debounceCategory, setDebounceCategory] = useState('');
    const [debounceManuFacture, setDebounceManuFacture] = useState('');
    const { data: products } = useFetchData(
        `${BASE_URL}/product?categoryName=${debounceCategory}&manuFactureName=${debounceManuFacture}`
    );
    const { data: category } = useFetchData(`${BASE_URL}/category`);
    const { data: manuFacture } = useFetchData(`${BASE_URL}/manuFacture`);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        products: [],
        name: '',
        address: '',
        phone: '',
        payment: '',
        note:''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const addItem = (item) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            products: [...prevFormData.products, item]
        }));
    };
    const deleteItem = (key, index)=>{
        setFormData(prevFormData=>({...prevFormData, 
            [key]:prevFormData[key].filter((_,i)=> i !== index)}))

    }


    const handleProductChange = (index, productId) => {
        const updatedProducts = formData.products.map((product, i) => 
            i === index ? { ...product, productId } : product
        );
        setFormData({ ...formData, products: updatedProducts });
    };

    const handleQuantityChange = (index, quantity) => {
        const updatedProducts = formData.products.map((product, i) => 
            i === index ? { ...product, quantity } : product
        );
        setFormData({ ...formData, products: updatedProducts });
    };

    const addProducts = (e) => {
        e.preventDefault();
        addItem({ productId: '', quantity: '' });
    };
    const deleteProduct = (e , index)=>{
        e.preventDefault()
        deleteItem('products', index)
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/order`, {
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
            navigate('/order');
            handleClose();
            setRefetch(true)
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    const stopPropagation = (e) => {
        e.stopPropagation();
      };
    return (
        <div>
            {open ? (
                <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                onClick={handleClose} // Đóng modal khi click ra ngoài
            >
                    <div
                                className="relative w-1/2 my-6 mx-auto max-w-3xl"
                                onClick={stopPropagation} // Ngăn chặn đóng modal khi click vào chính modal
                            >

<div className="border-2 border-slate-500 rounded-lg shadow-2xl relative flex flex-col w-full bg-white outline-none focus:outline-none">

                            <form onSubmit={submitHandler}>
                                <div className="text-white justify-center text-[16px] rounded-t-lg bg-blue-400">
                                    <span>Thêm đơn hàng</span>
                                    <div className="absolute top-2 right-2">
                                        <img src={closeIcon} onClick={handleClose} className='w-5 h-5 cursor-pointer' alt="Close" />
                                    </div>
                                </div>
                                <div className='flex gap-4'>
                                    <div className='w-1/3'>
                                        <h3 className='text-[18px] my-3 font-semibold'>Thông tin khách hàng:</h3>
                                        <div className="mb-5">
                                            <div className="form__label">Khách hàng <sup className='text-red-600'>*</sup></div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Họ và tên"
                                                className="form__input"
                                                required
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <div className="form__label">Địa chỉ <sup className='text-red-600'>*</sup></div>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="Địa chỉ nhận hàng"
                                                className="form__input"
                                                required
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <div className="form__label">Số điện thoại <sup className='text-red-600'>*</sup></div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="Số điện thoại nhận hàng"
                                                className="form__input"
                                                required
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <div className="form__label">Ghi chú </div>
                                            <textarea onChange={handleInputChange} name="note" id="" className='text__para' rows="2" cols="28">
                                                Ghi chú cho đơn hàng..
                                            </textarea>
                                        </div>
                                    </div>
                                    <div className='w-2/3'>
                                        <h3 className='text-[18px] font-semibold my-3'>Thông tin sản phẩm</h3>
                                        <div className='mb-5 grid grid-cols-2 gap-5'>
                                            <div>
                                                <div className="form__label">Danh mục</div>
                                                <select
                                                    name="category"
                                                    onChange={e => setDebounceCategory(e.target.value)}
                                                    className="text-textColor font-semibold text-[15px] cursor-pointer leading-7 px-4 py-2 focus:outline-none border border-slate-500 rounded-lg"
                                                >
                                                    <option value="">Chọn danh mục</option>
                                                    {category.map(item => (
                                                        <option key={item._id} value={item.name}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <div className="form__label">Hãng</div>
                                                <select
                                                    name="manuFacture"
                                                    onChange={e => setDebounceManuFacture(e.target.value)}
                                                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-2 focus:outline-none border border-slate-500 rounded-lg"
                                                >
                                                    <option value="">Chọn hãng</option>
                                                    {manuFacture.map(item => (
                                                        <option key={item._id} value={item.name}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {formData.products.map((item, index) => (
                                            <div key={index} className='flex'>
                                            <div  className='grid grid-cols-3 gap-5'>
                                            <div className='mb-5 col-span-2'>
                                                <div className="form__label">Tên sản phẩm <sup className='text-red-600'>*</sup></div>
                                                <select
                                                    value={item.productId}
                                                    onChange={(e) => handleProductChange(index, e.target.value)}
                                                    className='form__input'
                                                    required
                                                >
                                                    <option value="">Chọn sản phẩm</option>
                                                    {products.map(product => (
                                                        <option key={product._id} value={product._id}>{product.name}</option>
                                                    ))}
                                                </select>
                                                </div>
                                                <div className="mb-5 ">
                                                    <div className="form__label">Số lượng <sup className='text-red-600'>*</sup></div>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                        className='form__input'
                                                        min="1"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div >
                                                <button  onClick={e => deleteProduct(e, index)} className="bg-red-600 rounded-full text-white text-[22px] m-auto mb-[30px] cursor-pointer">
                                                        <AiOutlineDelete />
                                                </button>
                                            </div>
                                            </div>
                                        ))}
                                        <button onClick={addProducts} className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer">Thêm sản phẩm</button>
                                    </div>
                                </div>
                                <div>
                                    <div className="m-0">
                                        <button
                                            disabled={loading}
                                            type="submit"
                                            className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                                        >
                                            {loading ? <HashLoader size={35} color="#ffffff" /> : 'Thêm'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                                        </div>
                       
                    </div>
                </div>
        ):null}
        </div>
    );
}

export default OrderAddDialog;
