/* eslint-disable react/prop-types */
import { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';
import reviewService from '../../services/reviewproduct.service';
import { IoClose } from "react-icons/io5";

const ReviewForm = ({ productId, open,setOpen,orderID }) => {
  const [rating, setRating] = useState(0); // Giá trị đánh giá (1-5)
  const [hover, setHover] = useState(0); // Trạng thái hover tạm thời
  const [reviewText, setReviewText] = useState(''); // Nội dung đánh giá
  const [loading, setLoading] = useState(false); // Trạng thái loading khi gửi đánh giá

  // Hàm xử lý gửi đánh giá
  const handleSubmitReview = async (e) => {
    e.preventDefault(); // Ngăn tải lại trang
    setLoading(true); // Bật trạng thái loading

    try {
      // Kiểm tra các trường bắt buộc
      if (!rating || !reviewText) {
        setLoading(false);
        return toast.error('Vui lòng cung cấp cả số sao và nội dung đánh giá!');
      }

      // Gọi API qua service
      const result = await reviewService.createReview(productId, {
        rating,
        reviewText,
        orderID
      });

      setLoading(false); // Tắt trạng thái loading
      setOpen(false)
      toast.success(result.message || 'Đánh giá của bạn đã được gửi!');
    } catch (error) {
      setLoading(false); // Tắt trạng thái loading khi lỗi xảy ra
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.'
      );
    }
  };

  return (
    <>
      {open ? (
        <div
          onClick={() => setOpen(!open)}
          className="justify-center bg-[#0005] items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        >
          <div
            className="relative w-1/3 my-5 mx-auto max-w-3xl"
            onClick={(e) => { e.stopPropagation(); }}
          >
            <div className="border-0 bg-white rounded-md shadow-lg relative flex flex-col w-full outline-none focus:outline-none">

            <div className="text-[18px] border-b border-gray-900 p-5 pb-2 font-bold">
                                <h3>Đánh giá sản phẩm</h3>
                            </div>
              <div className='p-10'>
                <form onSubmit={handleSubmitReview}>
                  <div>
                    <h3 className="text-headingColor text-[15px] leading-6 font-semibold mt-0">
                      Bạn đánh giá trải nghiệm như thế nào?
                    </h3>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, index) => {
                        index += 1; // Tính chỉ số từ 1-5
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setRating(index)} // Đặt số sao khi nhấn
                            onMouseEnter={() => setHover(index)} // Hiển thị hover
                            onMouseLeave={() => setHover(0)} // Xóa trạng thái hover khi rời chuột
                            onDoubleClick={() => {
                              setHover(0);
                              setRating(0); // Đặt lại giá trị khi nhấn đúp
                            }}
                            className={`
                                  ${index <= (hover || rating) // Kiểm tra trạng thái hover hoặc rating
                                ? 'text-yellow-400' // Màu vàng nếu được chọn
                                : 'text-gray-400' // Màu xám nếu chưa chọn
                              } bg-transparent border-none outline-none text-[22px] cursor-pointer
                                `}
                          >
                            <AiFillStar /> {/* Icon ngôi sao */}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Phần nội dung đánh giá */}
                  <div className="mt-[30px]">
                    <h3 className="text-headingColor text-[15px] leading-6 font-semibold mt-0">
                      Chia sẻ ý kiến của bạn
                    </h3>
                    <textarea
                      className="border border-solid border-[#0066ff34] focus:outline-none w-full px-4 py-3 rounded-md"
                      rows="5"
                      placeholder="Viết ý kiến của bạn..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)} // Cập nhật nội dung
                    ></textarea>
                  </div>
                  {/* Nút gửi đánh giá */}
                  <div className='flex justify-end items-center'>
                  <button
                    type="submit"
                    className={`px-3 py-2 rounded-md border border-indigo-600 mt-3 ${loading
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-indigo-400 text-white' 
                      }`}
                    disabled={loading}
                  >
                    {loading ? <HashLoader size={25} color="#fff" /> : 'Gửi đánh giá'}
                  </button>
                  </div>
                </form>
              </div>
              <div onClick={()=>setOpen(!open)} className='absolute top-0 right-0 w-6 h-6 hover:bg-red-600 hover:text-white text-[22px]'>
              <IoClose />
              </div>
            </div>
          </div>
        </div>) : null}
    </>
  );
};


export default ReviewForm;
