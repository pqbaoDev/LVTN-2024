const Review = require("../models/ReviewSchema");
const Product = require("../models/ProductSchema");
const User = require("../models/UserSchema");

class ReviewService {
  // Trong ReviewService.js
  async getReviews(queryParams) {
    const { productName, query, userName, startDate, endDate, rating } = queryParams;
    let productIds = [];
    let userIds = [];

    if (productName) {
      const products = await Product.find({ name: { $regex: productName, $options: "i" } });
    
      productIds = products.map(product => product._id); 
  }

    // Lọc theo tên người dùng
    if (userName) {
      const users = await User.find({ name: { $regex: userName, $options: "i" } });
    
      userIds = users.map(user => user._id); // Gán userIds từ kết quả tìm kiếm
  }

    // Xây dựng queryObject với các điều kiện tìm kiếm
    
    const queryObject = {};

    if (query) {
        queryObject.reviewText = { $regex: query, $options: 'i' };
    }

    if (rating) {
        queryObject.rating = Number(rating); // Lọc trực tiếp theo số sao
    }

    if (userIds.length) {
        queryObject.user = { $in: userIds }; // Lọc theo userIds
    }

    if (productIds.length) {
        queryObject.product = { $in: productIds }; // Lọc theo productIds
    }

    if (startDate || endDate) {
      // Chuyển đổi ngày bắt đầu sang GMT+7
      const start = startDate
          ? new Date(new Date(startDate).setHours(new Date(startDate).getHours() - 7)) // Giảm 7 giờ để chuyển sang GMT+7
          : new Date('1970-01-01'); // Mốc thời gian bắt đầu mặc định
  
      // Chuyển đổi ngày kết thúc sang GMT+7 và thiết lập giờ là 23:59:59.999
      const end = endDate
          ? new Date(new Date(endDate).setHours(new Date(endDate).getHours() - 7)) // Giảm 7 giờ để chuyển sang GMT+7
          : new Date(); // Ngày hiện tại
  
      // Thiết lập giờ cho endDate là 23:59:59.999 (cuối ngày)
      end.setHours(23, 59, 59, 999);
  
      if (start > end) {
          return { message: "Thời gian không phù hợp." }; // Kiểm tra ngày không hợp lệ
      }
  
      queryObject.createdAt = { 
          $gte: start, 
          $lte: end 
      };
  }
  
  

   
   
        return await Review.find(queryObject);
      
       
   
}


  
  // Lấy tất cả đánh giá của một sản phẩm
  async getAllReviews(productId) {
    try {
      const reviews = await Review.find({ product: productId, status: true }).populate('user', 'name photo');
      if (reviews.length > 0) {
        return { success: true, data: reviews };
      } else {
        return { success: false, message: "No reviews found" };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  
  async createReview(reviewData) {
    try {
        const newReview = new Review(reviewData);
        const savedReview = await newReview.save();
        await Product.findByIdAndUpdate(reviewData.product, {
          $push: { reviews: savedReview._id }
        });
      return { success: true, data: savedReview };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  async updateStatus(reviewId) {
    const review = await Review.findById(reviewId);
        if (!review) {
            throw new Error("Review not found");
        }

        const newStatus = review.status === true ? false : true;
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { status: newStatus },
            { new: true }
        );

        return updatedReview;
}

  
  async updateReview(reviewId, updateData) {
    try {
      const review = await Review.findById(reviewId);

      if (!review) {
        return { success: false, message: "Review not found" };
      }

      // Kiểm tra xem người dùng có quyền cập nhật không (phải là người đã tạo đánh giá)
      if (review.user.toString() !== updateData.userId) {
        return { success: false, message: "You are not authorized to update this review" };
      }

      // Cập nhật thông tin đánh giá
      review.reviewText = updateData.reviewText || review.reviewText;
      review.rating = updateData.rating || review.rating;

      const updatedReview = await review.save();

      // Cập nhật lại điểm trung bình đánh giá của sản phẩm
      await Review.calcAverageRatings(review.product);

      return { success: true, data: updatedReview };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Xóa đánh giá
  async deleteReview(reviewId, userId) {
    try {
      const review = await Review.findById(reviewId);

      if (!review) {
        return { success: false, message: "Review not found" };
      }

      // Kiểm tra xem người dùng có quyền xóa không (phải là người đã tạo đánh giá)
      if (review.user.toString() !== userId) {
        return { success: false, message: "You are not authorized to delete this review" };
      }

      // Xóa đánh giá
      await review.remove();

      // Cập nhật lại điểm trung bình đánh giá của sản phẩm
      await Review.calcAverageRatings(review.product);

      return { success: true, message: "Review deleted successfully" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = new ReviewService();
