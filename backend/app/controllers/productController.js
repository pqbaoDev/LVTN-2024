const Product = require("../models/ProductSchema");
const { param } = require("../routes/product");

const createProduct = async(req,res)=>{
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
      } catch (error) {
        res.status(400).json({ error: error.message });
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
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const getAllProduct = async(req,res)=>{
    try {
        const {query}=req.query;
        let products;
        if(query){
            products = await Product.find({
                $or:[
                    { name: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } },
                    
                ],
            });
        }else{
            products = await Product.find();
        }
        res.status(200).json({success:true,data:products});
    } catch (error) {
        console.error("Lỗi lấy danh sách sản",error)
        res.status(400).json({
            success:false,
            error: error.message
        })
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
        const product = await Product.deleteMany();
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
module.exports = {createProduct,updateProduct,getSingleProduct,getAllProduct,deleteProduct,deleteAllProduct}