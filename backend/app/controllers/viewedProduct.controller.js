const viewedProductService = require('../service/ViewedProduct.service');

// Thêm sản phẩm đã xem
const addViewedProduct = async (req, res) => {
    const { userId, productId } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!userId || !productId) {
        return res.status(400).json({
            success: false,
            message: 'Cần cung cấp User ID và Product ID.'
        });
    }

    try {
        // Thực hiện hành động thêm sản phẩm vào danh sách đã xem
        const result = await viewedProductService.addViewedProduct(userId, productId);

        // Nếu không có kết quả trả về
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Không thể thêm sản phẩm vào danh sách đã xem. Có thể sản phẩm hoặc người dùng không tồn tại.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Đã thêm sản phẩm vào danh sách đã xem thành công.',
            data: result
        });

    } catch (error) {
        // Xử lý lỗi chi tiết hơn
        console.error('Lỗi khi thêm sản phẩm vào danh sách đã xem:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Đã xảy ra lỗi khi thêm sản phẩm vào danh sách đã xem.'
        });
    }
};


// Xóa sản phẩm đã xem
const deleteViewedProduct = async (req, res) => {
    const { userId, productId } = req.body;
    console.log(req.body)

    try {
        const result = await viewedProductService.deleteViewedProduct(userId, productId);
        return res.status(200).json({
            success: true,
            message: 'Viewed product deleted successfully.',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const deleteAllViewedProduct = async (req, res) => {
    const userId  = req.params.userId;

    try {
        const result = await viewedProductService.deleteAllViewedProduct(userId);
        return res.status(200).json({
            success: true,
            message: 'Viewed product deleted successfully.',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy tất cả sản phẩm đã xem
const getAllViewedProducts = async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required.'
        });
    }

    try {
        // Gọi service để lấy danh sách sản phẩm đã xem
        const result = await viewedProductService.getAllViewedProducts(userId);

        return res.status(200).json({
            success: true,
            message: 'Retrieved all viewed products successfully.',
            data: result,
        });
    } catch (error) {
        console.error(`Error fetching viewed products: ${error.message}`);
        
        return res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving viewed products.',
        });
    }
};

module.exports = {
    addViewedProduct,
    deleteViewedProduct,
    deleteAllViewedProduct,
    getAllViewedProducts
};
