import axios from 'axios';
import { BASE_URL, token } from '../../config';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });


class ViewedProductService {
    // Thêm sản phẩm vào danh sách đã xem
    static async addViewedProduct(userId, productId) {
        try {
            const response = await api.post(`${BASE_URL}/product/viewed/add`, { userId, productId });
            return response.data; // Trả về dữ liệu nhận được từ server
        } catch (error) {
            throw new Error('Lỗi khi thêm sản phẩm vào danh sách đã xem: ' + error.message);
        }
    }

    // Lấy tất cả sản phẩm đã xem của người dùng
    static async getViewedProducts() {
        try {
            const response = await axios.get(`${BASE_URL}/product/viewed`);
            return response.data; // Trả về danh sách sản phẩm đã xem
        } catch (error) {
            throw new Error('Lỗi khi lấy sản phẩm đã xem: ' + error.message);
        }
    }

    // Xóa sản phẩm khỏi danh sách đã xem
    static async deleteViewedProduct(userId, productId) {
        try {
            const response = await axios.delete(`${BASE_URL}/product/viewed/delete`,{
                data: { userId, productId }
        });
            return response.data; // Trả về kết quả xóa
        } catch (error) {
            throw new Error('Lỗi khi xóa sản phẩm khỏi danh sách đã xem: ' + error.message);
        }
    }
    static async deleteAllViewedProduct(userId) {
        try {
            const response = await axios.delete(`${BASE_URL}/product/viewed/${userId}`);
            return response.data; // Trả về kết quả xóa
        } catch (error) {
            throw new Error('Lỗi khi xóa sản phẩm khỏi danh sách đã xem: ' + error.message);
        }
    }
}

export default ViewedProductService;
