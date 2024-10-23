const WarehouseModel = require('../models/WarehouseSchema');
const ProductModel = require('../models/ProductSchema');

const createProduct = async (req, res) => {
    try {
        const { 
            siri,  
            name,
            manuFacture,
            category,
            photo,
            color,
            size,
            discount,
            price,
            stock,
            tags,
            rating,
            warehousequantity, // Số lượng trong kho
            zone,
            shelf,  
            level
        } = req.body;

        // Kiểm tra xem tất cả các trường bắt buộc có mặt không
        if (!siri || !name || !price || !manuFacture  || !category || !color || !size) {
            return res.status(400).json({ success: false, error: "Thiếu thông tin bắt buộc." });
        }

        // Kiểm tra sản phẩm đã tồn tại trong kho chưa
        const existingProduct = await ProductModel.findOne({ name });

        if (existingProduct) {
            // Cập nhật số lượng sản phẩm nếu đã tồn tại
            existingProduct.stock += stock;
            const updatedProduct = await existingProduct.save();
            return res.status(200).json({ success: true, data: updatedProduct });
        }

        // Tạo sản phẩm mới
        const newProduct = new ProductModel({
            siri,
            name,
            manuFacture,
            category,
            photo,
            color,
            size,
            discount,
            price,
            stock,
            tags,
            rating,
        });

        // Lưu sản phẩm mới và lấy ID
        const savedProduct = await newProduct.save();

        // Tạo bản ghi trong kho với ID sản phẩm vừa tạo
        const warehouseRecord = new WarehouseModel({
            product: savedProduct._id, // Lấy ID sản phẩm vừa tạo
            warehousequantity: warehousequantity, // Số lượng trong kho
            zone,
            shelf,
            level
        });

        await warehouseRecord.save(); // Lưu bản ghi kho

        res.status(201).json({ success: true, data: savedProduct });
    } catch (error) {
        console.error('Lỗi khi tạo sản phẩm:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = { createProduct };
