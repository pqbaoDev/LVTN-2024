const reviewService = require("../service/Review.service");

// Lấy tất cả đánh giá cho sản phẩm
const getReviews = async (req, res) => {
  try {
    const productId = req.params.productId; // Lấy productId từ query params
    if (!productId) {
      return res.status(400).json({ success: false, message: "ProductId is required" });
    }

    const result = await reviewService.getAllReviews(productId); // Gọi dịch vụ để lấy tất cả các đánh giá cho sản phẩm

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result); // Trả về nếu không tìm thấy đánh giá
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const getReviewsForProduct = async (req, res) => {
 
  try {
    const reviews = await reviewService.getReviews(req.query);
    res.status(200).json({ success: true, data: reviews });
} catch (error) {
    res.status(500).json({ success: false, error: error.message });
}
};
// Gửi đánh giá mới cho sản phẩm
const submitReview = async (req, res) => {
  try {
    const reviewData = {
      product: req.params.productId, 
      user: req.userId,             
      reviewText: req.body.reviewText,
      rating: req.body.rating,
      order:req.body.orderID
    };

    // Gọi dịch vụ để tạo một review mới
    const result = await reviewService.createReview(reviewData);

    if (result.success) {
      return res.status(200).json(result); // Trả về kết quả khi đánh giá được gửi thành công
    } else {
      return res.status(500).json(result); // Trả về lỗi nếu có vấn đề trong quá trình gửi review
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật đánh giá
const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId; // Lấy reviewId từ URL params
    const { reviewText, rating } = req.body; // Lấy dữ liệu từ body

    // Gọi dịch vụ để cập nhật review
    const result = await reviewService.updateReview(reviewId, { reviewText, rating, userId: req.userId });

    if (result.success) {
      return res.status(200).json(result); // Trả về kết quả khi cập nhật thành công
    } else {
      return res.status(404).json(result); // Nếu không tìm thấy đánh giá để cập nhật
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const updateStatus = async (req, res) => {
  try {
      const review = await reviewService.updateStatus(req.params.reviewId);
      res.status(200).json({ success: true, data: review });
  } catch (error) {
      res.status(400).json({ success: false, error: error.message });
  }
};

// Xóa đánh giá
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId; // Lấy reviewId từ URL params

    // Gọi dịch vụ để xóa review
    const result = await reviewService.deleteReview(reviewId, req.userId);

    if (result.success) {
      return res.status(200).json(result); // Trả về kết quả khi xóa thành công
    } else {
      return res.status(404).json(result); // Nếu không tìm thấy đánh giá để xóa
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReviews,
  submitReview,
  updateReview,
  deleteReview,
  getReviewsForProduct,
  updateStatus
};
