const Product = require("../models/ProductSchema");
const ManuFacture = require("../models/ManufactureSchema");
const Category = require("../models/CategorySchema")

const createProduct = async(req,res)=>{
    try {
        const {name,stock,price,manuFacture,category} = req.body;
        const existingProduct = await Product.findOne({name});
        if(existingProduct){
            existingProduct.stock += stock;
           const updateProduct = await existingProduct.save();
           return res.status(200).json({success:true,data:updateProduct});
        }
        const newproduct = new Product(req.body);
        await newproduct.save();
        res.status(201).json({success:true,data:newproduct});
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
        res.status(200).json({data:product});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const getAllProduct = async(req,res)=>{
    try {
        const {query}=req.query;
        let products;
        if(query){
            const manuFactures = await ManuFacture.find({name:{$regex:query,$options:'i'}});
            const categorys = await Category.find({name:{$regex:query,$options:'i'}});

            const manuFactureId = manuFactures.map(manuFacture=>manuFacture._id);
            const categoryId = categorys.map(category=>category._id);

            products = await Product.find({
                $or:[
                    { name: { $regex: query, $options: 'i' } },
                    { category: { $in:categoryId } },
                    {manuFacture:{$in:manuFactureId}},
                    
                ],
            });
        }else{
            products = await Product.find();
        }
        res.status(200).json({success:true,data:products});
    } catch (error) {
        console.error("Lỗi lấy danh sách sản",error)
        res.status(500).json({
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