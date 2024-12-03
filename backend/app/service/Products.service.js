const Product = require("../models/ProductSchema");
const ManuFacture = require("../models/ManufactureSchema");
const Category = require("../models/CategorySchema");


class ProductService {
    // async createProducts(productValue) {
        
    //     const {products} = productValue;
    //     console.log(products)
    //     let newProducts = []; 
        
    
        
      
    //     for (const item of products) {
    //         const { 
    //             name, 
    //             manuFacture, 
    //             category, 
    //             photo, 
    //             color, 
    //             size, 
    //             discount, 
    //             price, 
    //             quantity,  // Thêm trường quantity
    //             tags = [],  // Giả sử tags có thể rỗng, sẽ mặc định là mảng rỗng
    //             rating = 0  // Giả sử rating có thể rỗng, sẽ mặc định là 0
    //         } = item;
    
           
          
    //         // Tạo sản phẩm mới
    //         try {
    //             const product = new ProductTempModel({
    //                 name,
    //                 manuFacture,
    //                 category,
    //                 photo,
    //                 color: {
    //                     hex: color ? color.hex : '',  // Nếu không có color, dùng chuỗi trống
    //                     name: color ? color.name : '',  // Nếu không có color, dùng chuỗi trống
    //                 },
    //                 size,
    //                 discount,
    //                 price,
    //                 stock: quantity,
    //                 tags,
    //                 rating,
    //             });
    
    //             // Lưu sản phẩm và thêm vào danh sách
    //             await product.save();
    //             newProducts.push(product);
    //         } catch (error) {
    //             throw new Error(error.message);
    //         }
    //     }
    
    //     // Trả về phản hồi thành công
    //     return newProducts
    // }
    

    // Cập nhật sản phẩm
    async updateProduct(productId, updateData) {
        const product = await Product.findByIdAndUpdate(productId, updateData, {
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

        const queryObject = {alt:true};
        if (query) queryObject.name = { $regex: query, $options: 'i' };
        if (categoryIds.length) queryObject.category = { $in: categoryIds };
        if (manuFactureIds.length) queryObject.manuFacture = { $in: manuFactureIds };

        return await Product.find(queryObject);
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

        const products = await Product.find({ category: itemCategory._id,alt:true });

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
        const product = await Product.findOne({ _id: productId, alt: true });
        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }
        return product;
    }

    // Xóa sản phẩm
    async deleteProduct(productId) {
        const product = await Product.findByIdAndUpdate(productId,
            { alt: false }, 
            { new: true } );
        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }
        return product;
    }

    // Xóa nhiều sản phẩm
    async deleteAllProduct(productIds) {
        const result = await Product.updateMany(
            { _id: { $in: productIds } }, // Lọc các sản phẩm có _id nằm trong danh sách
            { $set: { alt: false } }      // Cập nhật trường alt thành false
        );
        if (result.deletedCount === 0) {
            throw new Error("Không tìm thấy sản phẩm nào để xóa");
        }
        return result.deletedCount;
    }
}

module.exports = new ProductService();
