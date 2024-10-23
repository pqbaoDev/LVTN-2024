const Product = require("../models/ProductSchema");
const ManuFacture = require("../models/ManufactureSchema");
const Category = require("../models/CategorySchema");
const Location = require("../models/LocationSchema");
const StockInSModel = require("../models/StockInSchema");

const createProduct = async (req, res) => {
    try {
        const { 
            
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
            rack,
            pallet,
            level,
            type,
            quantity,
            employeeId
        } = req.body;

        const location = await Location.findOne({
            type:type,
            rack: (type=='rack')? rack : null,
            pallet: (type=='pallet')? pallet : null,
            level: (type=='rack') ? level : null,
        })

        if(!location){
            return res.status(409).json({message:'Vị trí không tồn tại'});
        }
        const getProduct = await Product.findOne({ name });
        
        if (getProduct) {
            getProduct.stock += quantity;
            const updatedProduct = await getProduct.save();
            return res.status(200).json({ success: true, data: updatedProduct });
        }

        const newProduct = new Product({
           
            name,
            manuFacture,
            category,
            photo,
            color,
            size,
            discount,
            price,
            stock:quantity,
            tags,
            rating,
        });
        
        await newProduct.save();
        const newStock = new StockInSModel({
            product:newProduct._id,
            location:location._id,
            employee:employeeId,
            quantity,

        })
        await newStock.save();
        location.product = newProduct._id;
        location.quantity = quantity;
        await location.save();
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error('Lỗi khi tạo sản phẩm:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};


const updateProduct = async(req, res)=>{

    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id, req.body, { 
                new: true, runValidators: true 
            });
        if (!product) {
        return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }
        res.status(200).json({success:true,message:"Cập nhật thành công",data:product});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const getAllProduct = async (req, res) => {
    try {
        const { manuFactureName, query, categoryName } = req.query;

        // Khởi tạo mảng lưu trữ ID
        let manuFactureIds = [];
        let categoryIds = [];

        // Nếu có tham số manuFactureName, thực hiện tìm kiếm và lấy ID
        if (manuFactureName ) {
            const manuFactures = await ManuFacture.find({ name: { $regex: manuFactureName, $options: 'i' } });
            manuFactureIds = manuFactures.map(mf => mf._id);  // Lấy danh sách ID
        }

        // Nếu có tham số categoryName, thực hiện tìm kiếm và lấy ID
        if (categoryName ) {
            const categories = await Category.find({ name: { $regex: categoryName, $options: 'i' } });
            categoryIds = categories.map(cat => cat._id);  // Lấy danh sách ID
        }

        // Xây dựng truy vấn tìm kiếm sản phẩm
        const queryObject = {};

        // Thêm điều kiện vào truy vấn nếu có tham số query
        if (query ) {
            queryObject.name = { $regex: query, $options: 'i' };
        }
        if (categoryIds.length > 0) {
            queryObject.category = { $in: categoryIds };
        }
        if (manuFactureIds.length > 0) {
            queryObject.manuFacture = { $in: manuFactureIds };
        }

        // Tìm các sản phẩm dựa trên truy vấn đã xây dựng
        let products;
        if (Object.keys(queryObject).length > 0) {
            products = await Product.find(queryObject);
        } else {
            products = await Product.find();
        }

        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error.message);
        res.status(500).json({
            success: false,
            error: "Đã xảy ra lỗi khi lấy danh sách sản phẩm."
        });
    }
}


const getSingleProduct = async(req, res)=>{
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({success: false,error: 'Sản phẩm không tồn tại'})
        }
        res.status(200).json({success:true,data:product})
    } catch (error) {
        
        res.status(400).json({
            error: error.message
        })
        
    }
}
const deleteProduct = async(req,res)=>{
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product){
            return res.status(404).json({success:false,error:'Sản phẩm không tồn tại!'})
        }
        res.status(200).json({success:true,message:'Xóa sản phẩm thành công!'})
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}
const deleteAllProduct = async(req,res)=>{
    try {
        const { _id } = req.body; // Lấy _id từ req.body
        if (!Array.isArray(_id) || _id.length === 0) {
            return res.status(400).json({ success: false, error: 'Không có ID sản phẩm nào được cung cấp!' });
        }
    
        const result = await Product.deleteMany({ _id: { $in: _id } }); // Sử dụng toán tử $in để xóa nhiều ID
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm nào để xóa!' });
        }
    
        res.status(200).json({ success: true, message: "Đã xóa sản phẩm thành công", deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message }); // Trả về mã lỗi 500 cho lỗi máy chủ
    }
}
module.exports = {createProduct,updateProduct,getSingleProduct,getAllProduct,deleteProduct,deleteAllProduct}