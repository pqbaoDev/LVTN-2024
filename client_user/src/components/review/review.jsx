/* eslint-disable react/prop-types */
import { useState } from "react";
import { FormatDay } from "../../utils/formatDay";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import ReviewForm from "./reviewForm";
import useFetchData from "../../../../client/src/Hook/userFecthData";
import { BASE_URL } from "../../../config";

const Review = ({  totalRating, averageRating, productId }) => {
  const {data:reviews} =useFetchData(`${BASE_URL}/product/review/${productId}`)
  const [isOpen, setIsOpen] = useState(false);
  const maxStars = 5;
  const ratingCounts = reviews.reduce((acc, review) => {
    const rating = review.rating;
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {});

  const totalRatings = reviews.length;

  return (
    <div>

      <div className="flex gap-x-2 items-center mb-5">
        <div className="text-[22px]  font-bold text-yellow-400">
          {averageRating.toFixed(1)}
        </div>
        <div className="flex gap-x-1">
          {Array.from({ length: maxStars }).map((_, index) => {
            const starRating = averageRating - index;
            return (
              <span key={index} className="text-[18px]">
                {starRating >= 1 ? (
                  <BsStarFill className="text-yellow-400" />
                ) : starRating > 0 ? (
                  <BsStarHalf className="text-yellow-400" />
                ) : (
                  <BsStar className="text-gray-300" />
                )}
              </span>
            );
          })}
        </div>
        <p className="text-primaryColor text-[16px] pl-2">{totalRating} đánh giá</p>
      </div>
      <div className="space-y-1 ">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingCounts[rating] || 0; // Số lượng đánh giá cho mức sao này
          const percentage = totalRatings
            ? Math.round((count / totalRatings) * 100)
            : 0;

          return (
            <div key={rating} className="flex space-x-2  items-center">
              <div className="w-[25px]">
                <div className="flex items-center gap-1 ">
                  <span className="text-sm font-medium">{rating}</span>
                  <BsStarFill className="text-gray-800 text-[13px]" />
                </div>
              </div>
              <div className="w-[280px] px-2">
                <div className="flex-1 bg-gray-200 h-2 rounded">
                  <div
                    className="bg-yellow-400 h-2 rounded"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              <span className="text-sm text-gray-600">{percentage}%</span>
            </div>
          );
        })}
      </div>





      <div className="my-8">
        {reviews.map((review, index) => (
          <div key={index} className="flex justify-between gap-6 mb-6 border-b pb-4">
            <div className="flex gap-4">
              <figure className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={review?.user?.photo || "/default-avatar.png"}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </figure>
              <div>
                <h5 className="text-base font-bold text-primaryColor">
                  {review?.user?.name || "Người dùng ẩn danh"}
                </h5>
                <p className="text-sm text-gray-400">{FormatDay(review?.createdAt)}</p>
                <p className="mt-2 text-sm">{review?.reviewText}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: maxStars }).map((_, i) => {
                const star = review?.rating - i;
                return star >= 1 ? (
                  <BsStarFill key={i} className="text-yellow-400" />
                ) : star > 0 ? (
                  <BsStarHalf key={i} className="text-yellow-400" />
                ) : (
                  <BsStar key={i} className="text-gray-300" />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Nút viết đánh giá */}
      <div className="flex justify-center gap-4">
        <button className="w-60 py-2 text-center border border-gray-400">
          Xem tất cả
        </button>

        <button
          className="w-60 py-2 text-center border border-gray-400"
          onClick={() => setIsOpen(true)}
        >
          Viết đánh giá
        </button>

        <ReviewForm productId={productId} open={isOpen} setOpen={setIsOpen} />

      </div>
    </div>
  );
};

export default Review;
