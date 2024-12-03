import axios from "axios";
import { BASE_URL,token } from "../../config";

// Khởi tạo axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  },
});

class ReviewService {
  // Tạo mới đánh giá cho sản phẩm
  async createReview(productId, reviewData) {
    try {
      const response = await api.post(`/product/review/${productId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error("Error creating review", error);
      throw error;
    }
  }

  // Cập nhật đánh giá
  async updateReview(reviewId, reviewData) {
    try {
      const response = await api.put(`/product/review/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error("Error updating review", error);
      throw error;
    }
  }

  // Xóa đánh giá
  async deleteReview(reviewId) {
    try {
      const response = await api.delete(`/product/review/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting review", error);
      throw error;
    }
  }
}

const reviewService = new ReviewService();
export default reviewService;
