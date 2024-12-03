
const ManuFacture = require("../models/ManufactureSchema");
const Category = require("../models/CategorySchema");
const ProductTempModel = require("../models/ProductTempSchema");


class ProductService {
    async createProducts(productValue) {
        const { products } = productValue;
    
        // Nếu không có sản phẩm, trả về mảng rỗng
        if (!products || products.length === 0) return [];
    
        try {
            // Duyệt qua từng sản phẩm và tạo các promises
            const productPromises = products.map((item) => {
                const {
                    name,
                    manuFacture,
                    category,
                   avatar, // Mặc định là mảng rỗng nếu không có photo
                    color = {}, // Mặc định là object rỗng nếu không có color
                    size,
                    discount = 0, // Mặc định giảm giá là 0
                    price,
                    quantity, // Trường quantity để tính stock
                    tags = [], // Mặc định là mảng rỗng
                    rating = 0, // Mặc định rating là 0
                } = item;
    
                // Tạo sản phẩm mới
                const product = new ProductTempModel({
                    name,
                    manuFacture,
                    category,
                    avatar,
                    color: {
                        hex: color.hex || '', // Nếu không có hex, dùng chuỗi trống
                        name: color.name || '', // Nếu không có name, dùng chuỗi trống
                    },
                    size,
                    discount,
                    price,
                    stock: quantity,
                    tags,
                    rating,
                });
    
                return product.save();
            });
    
            // Chờ tất cả promises hoàn thành
            const newProducts = await Promise.all(productPromises);
    
            // Trả về danh sách sản phẩm đã tạo
            return newProducts;
        } catch (error) {
            console.error('Error creating products:', error);
            throw new Error('Failed to create products: ' + error.message);
        }
    }
    

    // Cập nhật sản phẩm
    async updateProduct(productId, updateData) {
        const product = await ProductTempModel.findByIdAndUpdate(productId, updateData, {
            new: true, runValidators: true,
        });
        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }
        return product;
    }

    // Lấy danh sách sản phẩm
    async getAllProduct(filters) {
        const { manuFactureName, query, categoryName } = filters;
        let manuFactureIds = [];
        let categoryIds = [];

        if (manuFactureName) {
            const manuFactures = await ManuFacture.find({ name: { $regex: manuFactureName, $options: 'i' } });
            manuFactureIds = manuFactures.map(mf => mf._id);
        }

        if (categoryName) {
            const categories = await Category.find({ name: { $regex: categoryName, $options: 'i' } });
            categoryIds = categories.map(cat => cat._id);
        }

        const queryObject = {};
        if (query) queryObject.name = { $regex: query, $options: 'i' };
        if (categoryIds.length) queryObject.category = { $in: categoryIds };
        if (manuFactureIds.length) queryObject.manuFacture = { $in: manuFactureIds };

        return await ProductTempModel.find(queryObject);
    }
    // Thêm vào trong class ProductService
async getProductWithCategoriesName(categories) {
    try {
        if (!categories) {
            throw new Error("Danh mục không được để trống");
        }

        const itemCategory = await Category.findOne({ name: categories });
        if (!itemCategory) {
            throw new Error(`Không tìm thấy danh mục với tên ${categories}`);
        }

        const products = await Product.find({ category: itemCategory._id });

        if (products.length > 0) {
            return products;
        } else {
            throw new Error(`Không có sản phẩm nào thuộc danh mục ${categories}`);
        }
    } catch (error) {
        throw new Error(error.message);
    }
}


    // Lấy chi tiết sản phẩm
    async getSingleProduct(productId) {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }
        return product;
    }

    // Xóa sản phẩm
    async deleteProduct(productId) {
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }
        return product;
    }

    // Xóa nhiều sản phẩm
    async deleteAllProduct(productIds) {
        const result = await Product.deleteMany({ _id: { $in: productIds } });
        if (result.deletedCount === 0) {
            throw new Error("Không tìm thấy sản phẩm nào để xóa");
        }
        return result.deletedCount;
    }
}

module.exports = new ProductService();
