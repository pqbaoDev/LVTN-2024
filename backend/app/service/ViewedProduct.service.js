const ViewedProductModel = require('../models/ViewedProductSchema');

class ViewedProductService {
    // Thêm sản phẩm đã xem
    async addViewedProduct(userId, productId) {
        try {
           
            let viewedProduct = await ViewedProductModel.findOne({ user: userId });
            

            // Nếu không tìm thấy, tạo mới
            if (!viewedProduct) {
                viewedProduct = new ViewedProductModel({
                    user: userId,
                    products: [{ product: productId, view: 1 }]
                });
            } else {
                // Kiểm tra sản phẩm đã tồn tại hay chưa
                const existingProduct = viewedProduct.products.find(
                    p => p.product._id.toString() === productId.toString()
                );


                if (existingProduct) {
                    // Nếu đã tồn tại, tăng lượt xem
                    existingProduct.view += 1;
                } else {
                    // Nếu chưa tồn tại, thêm mới
                    viewedProduct.products.push({ product: productId, view: 1 });
                }
            }

            // Lưu vào DB
            await viewedProduct.save();
            return viewedProduct;
        } catch (error) {
            throw new Error(`Error adding viewed product: ${error.message}`);
        }
    }

    // Xóa sản phẩm đã xem
    async deleteAllViewedProduct(userId, productId) {
        try {
            const viewedProduct = await ViewedProductModel.findOne({ user: userId });
            if (!viewedProduct) {
                throw new Error('Viewed product not found for this user.');
            }

            // Lọc bỏ sản phẩm cần xóa
            viewedProduct.products =[];

            // Lưu lại thay đổi
            await viewedProduct.save();
            return viewedProduct;
        } catch (error) {
            throw new Error(`Error deleting viewed product: ${error.message}`);
        }
    }
    async deleteViewedProduct(userId, productId) {
        try {
            const viewedProduct = await ViewedProductModel.findOne({ user: userId });
            if (!viewedProduct) {
                throw new Error('Viewed product not found for this user.');
            }

            // Lọc bỏ sản phẩm cần xóa
            viewedProduct.products = viewedProduct.products.filter(
                p => p.product._id.toString() !== productId
            );

            // Lưu lại thay đổi
            await viewedProduct.save();
            return viewedProduct;
        } catch (error) {
            throw new Error(`Error deleting viewed product: ${error.message}`);
        }
    }


    // Lấy tất cả sản phẩm đã xem
    async getAllViewedProducts(userId) {
        try {
            const viewedProducts = await ViewedProductModel.findOne({ user: userId });
            if (!viewedProducts) {
                return { message: 'No viewed products found for this user.' };
            }
            return viewedProducts;
        } catch (error) {
            throw new Error(`Error retrieving viewed products: ${error.message}`);
        }
    }
}

module.exports = new ViewedProductService();
