/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

// import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import FormatPrice from '../../utils/formatPrice'
import { FaCartPlus } from "react-icons/fa";
import { BASE_URL, token } from '../../../config';
import { useContext, useState } from 'react';
import { authContext } from '../../context/AuthContext';
import {  useNavigate } from 'react-router-dom';
import ViewedProductService from '../../services/viewedproduct.service';


const ProductCard = ({ products }) => {
    const { name, photo, price, discount,_id,care,size } = products;
    const priceAfterSale = price * (1 - discount / 100);
    const {user} = useContext(authContext);
    const userId = user? user._id :null;
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleAddOrder = async (id) => {
        setLoading(true);
    
        try {
            
            const response = await fetch(`${BASE_URL}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId, productId: id, quantity: 1 })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add order');
            }
    
            const { message } = await response.json();
            toast.success(message);
            
        } catch (error) {
            toast.error(error.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };
    const handleDetailProduct = async (event) => {
        event.preventDefault();
    
        try {
            // Cập nhật thông tin sản phẩm (care + 1)
            const updateRes = await fetch(`${BASE_URL}/product/${_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ care: care + 1 }),
            });
    
            // Nếu cập nhật sản phẩm không thành công, ném lỗi
            if (!updateRes.ok) {
                const { message } = await updateRes.json();
                throw new Error(message);
            }
            const viewedProductRes = await ViewedProductService.addViewedProduct(userId, _id);
            if (!viewedProductRes.success) {
                throw new Error('Không thể thêm sản phẩm vào danh sách đã xem');
            }
            navigate('/product/detail',{
                state: {
                    products
                },
            });
            
        } catch (error) {
            // Hiển thị thông báo lỗi nếu có
            toast.error(error.message);
        }
    };
    
    return (
        <div className="py-3 px-1 lg:b-5  border border-slate-400 rounded-lg" >
            <div onClick={handleDetailProduct}>
                <div className="h-[160px] flex justify-center">
                    {
                        photo.slice(0,1).map((img, index) => (
                            <img key={index} src={img} className="max-w-[217px]" alt={`product-img-${index}`} />
                        ))
                    }
                    
                </div>
                <h2 className="text-[14px] h-[30px]  text-headingColor font-semibold overflow-x-clip ">{name + size}</h2>
                {
                    discount !== 0 && discount !== null ? (
                        <div className="h-[65px]">
                            <div className="flex items-left mt-2 ">
                                <span className=" pt-1 px-2   text-[12px]
                    leading-4 lg:text-[16px]  text-red-500 rounded flex justify-start font-[900]">
                                    {FormatPrice(priceAfterSale)} <sup className="underline px-2  text-[12px] leading-4 lg:leading-6 lg:text-[13px] rounded flex justify-center">đ</sup>
                                </span>
                            </div>
                            <div className="flex items-left">
                                <span className=" py-1 px-2   text-[12px]
                        leading-4 lg:text-[16px]    font-semibold text-slate-400 line-through rounded flex justify-start">
                                    {FormatPrice(price)} <sup className=" py-1 pl-2  text-[12px] leading-4 lg:text-[16px]  font-semibold rounded flex justify-center">đ</sup>
                                </span>
                                <span className="font-semibold text-[16px] text-red-500">
                                    -{discount}%
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-left mt-2 h-[65px]">
                            <span className=" pt-1 px-2   text-[12px]
                    leading-4 lg:text-[16px]  text-red-500 rounded flex justify-start font-[900]">
                                {FormatPrice(price)} <sup className="underline px-2  text-[12px] leading-4 lg:leading-6 lg:text-[13px] rounded flex justify-center">đ</sup>
                            </span>
                        </div>
                    )}
            </div>
                <div className="flex items-center justify-around">
                    <button className="px-3 py-2 inset-5 text-white border rounded-md bg-indigo-300 hover:bg-indigo-500">
                        Mua ngay
                    </button>
                    <button className="text-orange-500 inset-5" onClick={() => handleAddOrder(_id)}>
                        <FaCartPlus />
                    </button>

                </div>

        </div>
    );
}

export default ProductCard;