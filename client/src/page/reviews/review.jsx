import { Link } from "react-router-dom";
import chatimg from "../../assets/images/Chat.png";
import useFetchData from "../../Hook/userFecthData";
import { BASE_URL } from "../../../config";
import { useState } from "react";
import { useEffect } from "react";
import ReviewTable from "./reviewTable";

const Review = () => {
    const [isProduct, setIsProduct] = useState('');
    const [isUser, setIsUser] = useState('');
    const [isStartDate, setIsStartDate] = useState('');
    const [isEndDate, setIsEndDate] = useState('');
    const [isRating, setIsRating] = useState('');
    const [debounceProduct,setDebounceProduct] = useState('');
    const [debounceUser,setDebounceUser] = useState('');
    const [refetch,setRefetch] = useState(false);
    const { data: reviews,loading, refetch: refetchData } = useFetchData(`${BASE_URL}/product/review/filterReview?productName=${debounceProduct}&userName=${debounceUser}&startDate=${isStartDate}&endDate=${isEndDate}&rating=${isRating}`,refetch);
    useEffect(() => {
        const timeout = setTimeout(() => {
            // Thực hiện debounce các giá trị cần thiết
            setDebounceProduct(isProduct);
            setDebounceUser(isUser);
        }, 400);
        return () => clearTimeout(timeout);
    }, [isProduct, isUser]);
    useEffect(() => {
        if (!loading && refetch) {
            refetchData();
            setRefetch(false);  // Reset refetch state
        }
    }, [loading, refetch, refetchData]);
    
   
    return (
        <div>
            <div className="text-left p-5 w-1/3 flex gap-2 cursor-pointer">
                <img src={chatimg} className="w-6 h-6" alt="" />
                <Link to={`/feedback`} className="heading">Quản Lý Phản Hồi</Link>
            </div>

            {/* Form lọc */}
            <div className="p-5 flex justify-center items-end border-y-[20px] border-blue-500">
                <div>
                    <div className="text-sm">Sản phẩm: </div>
                
                <input
                    type="text"
                    placeholder="Tên sản phẩm"
                    value={isProduct}
                    onChange={(e) => setIsProduct(e.target.value)}
                    className="border p-2 m-2"
                />
                </div>
                <div>
                    <div className="text-sm">Khách hàng: </div>
               
                <input
                    type="text"
                    placeholder="Tên người dùng"
                    value={isUser}
                    onChange={(e) => setIsUser(e.target.value)}
                    className="border p-2 m-2"
                />
                 </div>
                <div>
                    <div className="text-sm">Từ ngày:</div>
                <input
                    type="date"
                    value={isStartDate}
                    onChange={(e) => setIsStartDate(e.target.value)}
                    className="border p-2 m-2"
                />
                </div>
                <div>
                    <div className="text-sm">Đến ngày:</div>

                <input
                    type="date"
                    value={isEndDate}
                    onChange={(e) => setIsEndDate(e.target.value)}
                    className="border p-2 m-2"
                />
                </div>
                <div>
                    <div className="text-sm">Đánh giá:</div>
                    <select
                        value={isRating}
                        onChange={(e) => setIsRating(e.target.value)}
                        className="border p-2 m-2"
                    >
                        <option value="">Chọn đánh giá</option>
                        <option value="1">1 sao</option>
                        <option value="2">2 sao</option>
                        <option value="3">3 sao</option>
                        <option value="4">4 sao</option>
                        <option value="5">5 sao</option>
                    </select>
                </div>
                {/* <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 m-2">
                    Tìm kiếm
                </button> */}
            </div>

            {/* Hiển thị kết quả review */}
            <div className="reviews">
                {reviews && reviews.length > 0 ? (
                   <ReviewTable reviews={reviews} setRefetch={()=>setRefetch(true)} />
                ) : (
                    <p className="text-center">Không có kết quả tìm kiếm.</p>
                )}
            </div>
        </div>
    );
}

export default Review;
