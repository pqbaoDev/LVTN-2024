const Order = require('../models/OrderSchema');
const Product = require('../models/ProductSchema');
const User = require('../models/UserSchema')

const createOrder = async (req, res) => {
    try {
        const {userId,productId,quantity} = req.body;
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({success:false, message:"Sản phẩm không tồn tại!"});
    
        }
        
        if(quantity > product.stock){
            return res.status(400).json({message:"Số lượng sản phẩm không đủ!"});
        }
        const totalAmount = quantity * product.price;
        if(totalAmount <= 0){
            return res.status(401).json({success:false,message:"Sản phẩm không hợp lệ!"});

        }
        const order = new Order({
            user:userId,
            product:productId,
            quantity,
            totalAmount,
        })
        await order.save();
        product.stock -=quantity;
        await product.save();
        res.status(200).json({success:true,data:order});
    } catch (error) {
        console.error('Lỗi máy chủ',error);
        res.status(500).json({success:false,message:"Lỗi server"})
        
    }
};
const getOrder = async (req, res) => {
    try {
        const { query } = req.query;
        let orders;

        console.log('Query:', query);

        if (query) {
            // Tìm tất cả người dùng và sản phẩm phù hợp với truy vấn
            const users = await User.find({ name: { $regex: query, $options: 'i' } });
            const products = await Product.find({ name: { $regex: query, $options: 'i' } });

            // Lấy tất cả ID của người dùng và sản phẩm tìm được
            const userIds = users.map(user => user._id);
            const productIds = products.map(product => product._id);

            // Tìm tất cả đơn hàng liên quan đến người dùng hoặc sản phẩm đã tìm được
            orders = await Order.find({
                $or: [
                    { user: { $in: userIds } },
                    { product: { $in: productIds } }
                ]
            }).populate('user').populate('product');
        } else {
            // Nếu không có truy vấn, lấy tất cả đơn hàng
            orders = await Order.find().populate('user').populate('product');
        }

        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, message: 'Không có đơn hàng nào' });
        }

        res.status(200).json({ success: true, data: orders });

    } catch (error) {
        console.error('Lỗi lấy đơn hàng', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

const getOneOrder = async(req,res)=>{
    try {
        const orderId = req.params.id
        const orders = await Order.findById(orderId);
        console.log(orderId)
        if(!orders){
            return res.status(404).json({success:false,message:"Đơn hàng không tồn tại"})
        }
        res.status(200).json({success:true,data:orders})
    } catch (error) {
        console.log('Lỗi lấy đơn hàng',error);
        res.status(500).json({success:false,message:'Lỗ không lấy được đơn hàng'})
        
    }

}
const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const updates = req.body;

        // Tìm đơn hàng cần cập nhật
        const order = await Order.findById(orderId).populate('product');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại!' });
        }

        // Nếu số lượng được cập nhật, tính toán tổng tiền mới
        if (updates.quantity !== undefined) {
            // Kiểm tra số lượng mới và giá của sản phẩm
            const newQuantity = updates.quantity;
            const productPrice = order.product.price;
            
            // Tính toán tổng tiền mới
            updates.totalAmount = newQuantity * productPrice;
        }

        // Cập nhật đơn hàng với các thông tin mới
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại!' });
        }

        res.status(200).json({ success: true, data: updatedOrder });

    } catch (error) {
        console.error('Lỗi server', error);
        res.status(500).json({ success: false, message: 'Không thể cập nhật đơn hàng!' });
    }
};
const deleteOrder = async (req,res)=>{
    try {
        const orderId = req.params.id;

        const orders = await Order.findByIdAndDelete(orderId)
        if(!orders){
            return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại!' });
        }
        res.status(200).json({ success: true, message:"Đơn đã được xóa thành công!" });

    } catch (error) {
        console.error('Lỗi server', error);
        res.status(500).json({ success: false, message: 'Không thể lấy đơn hàng!' });
    
    }
}
module.exports = { createOrder, getOrder,getOneOrder,updateOrder,deleteOrder };
