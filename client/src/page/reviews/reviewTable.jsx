/* eslint-disable react/prop-types */

import { FormatDay, FormatTime } from '../../../../client_user/src/utils/formatDay';
import FormatPrice from '../../../../client_user/src/utils/formatPrice';
import { BsStarFill } from "react-icons/bs";
import { FaRegEye,FaRegEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify'; // Import thư viện thông báo
import { useNavigate } from 'react-router-dom'; // Import điều hướng
import { BASE_URL } from '../../../config';

const ReviewTable = ({ reviews,setRefetch}) => {
    const navigate = useNavigate();

    const handleUpdate = async (id) => {
       

        try {
            const res = await fetch(`${BASE_URL}/product/review/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
               
            });

            const { message } = await res.json();

            if (!res.ok) {
                throw new Error(message);
            }

            toast.success(message);
            setRefetch();
            navigate('/feedback'); // Điều hướng đến trang feedback
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="overflow-x-auto px-5">
            <table className="w-full text-sm mt-5 text-center border-2 border-slate-300">
                <thead className="text-xs uppercase border-b-2 border-b-slate-300">
                    <tr>
                        <th className="px-4 py-2 text-left">STT</th>
                        <th className="px-4 py-2 text-left">Tên Người Dùng</th>
                        <th className="px-4 py-2 text-left">Sản Phẩm</th>
                        <th className="px-4 py-2 text-left">Đánh Giá</th>
                        <th className="px-4 py-2 text-center"></th>
                    </tr>
                </thead>
                <tbody className="bg-slate-50">
                    {reviews && reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <tr
                                key={review._id}
                                className={`border-b ${
                                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                } hover:bg-gray-100`}
                            >
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">
                                    <div className="font-semibold text-sm">
                                        {review.user.name} - {review.user.phone}
                                    </div>
                                    <div className="text-xs text-gray-500 italic">
                                        <p>Mã đơn hàng: <span>{review.order.orderID}</span></p>
                                        <p>Ngày nhận: <span>{FormatDay(review.order.createdAt)}</span></p>
                                        <p>
                                            Tổng thanh toán: 
                                            <span className="text-red-600 font-bold">
                                                {FormatPrice(review.order.totalAmount)} <sup className="underline">đ</sup>
                                            </span>
                                        </p>
                                    </div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="text-sm font-semibold">
                                        {review.product.name}
                                    </div>
                                    <div className="text-xs text-gray-500 italic">
                                        <p>Thương hiệu: <span>{review.product.manuFacture.name}</span></p>
                                        <p>Danh mục: <span>{review.product.category.name}</span></p>
                                        <p>Kích thước: <span>{review.product.size}</span></p>
                                        {review.product.color.hex && (
                                            <p>Màu: <span style={{ backgroundColor: review.product.color.hex }} className="inline-block w-4 h-4 rounded-full border"></span></p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>{review.rating}</span>
                                        <BsStarFill className="text-yellow-400" />
                                        <span>{FormatDay(review.createdAt)}</span>
                                        <span>{FormatTime(review.createdAt)}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{review.reviewText}</p>
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {
                                        review.status === true ? (
                                        <FaRegEye
                                        onClick={() => handleUpdate(review._id)}
                                        className="text-gray-500 hover:text-gray-700 text-[30px] cursor-pointer"
                                    />
                                        ):(
                                            <FaRegEyeSlash
                                        onClick={() => handleUpdate(review._id)}
                                        className="text-gray-500 hover:text-gray-700 text-[30px] cursor-pointer"
                                    />
                                        )
                                    }
                                    
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                                Không có đánh giá nào.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReviewTable;
