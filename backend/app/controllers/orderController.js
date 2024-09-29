const Order = require('../models/OrderSchema');
const Product = require('../models/ProductSchema');
const User = require('../models/UserSchema')

const moment = require('moment');

const createOrder = async (req, res) => {
    try {
        const { userId, products,phone,address,name,note } = req.body;

        // Kiểm tra xem các sản phẩm có tồn tại và số lượng có đủ không
        const orderProducts = [];
        let totalAmount = 0;

        for (const item of products) {
            const { productId, quantity } = item;
            const product = await Product.findById(productId);
            
            if (!product) {
                return res.status(404).json({ success: false, message: `Sản phẩm ${productId} không tồn tại!` });
            }

            if (quantity > product.stock) {
                return res.status(400).json({ message: `Số lượng sản phẩm ${productId} không đủ!` });
            }

            // Tính toán tổng tiền cho sản phẩm
            totalAmount += quantity * product.price  - ((quantity * product.price) * (product.discount/100));

            // Thêm thông tin sản phẩm vào mảng orderProducts
            orderProducts.push({ product: productId, quantity });

            // Cập nhật số lượng tồn kho
            product.stock -= quantity;
            await product.save();
        }

        // Tạo orderId
        const today = moment().format('DDMMYY');
        const orderCount = await Order.countDocuments({ createdAt: { $gte: moment().startOf('day'), $lt: moment().endOf('day') } });
        const orderId = `VN-${today}${(orderCount + 1).toString().padStart(3, '0')}`;

        // Tạo đơn hàng mới
        const order = new Order({
            user: userId,
            products: orderProducts,
            orderID: orderId,
            totalAmount,
            phone:phone,
            address:address,
            name:name,
            note:note,
        });

        await order.save();
        res.status(200).json({ success: true,message:'Tạo đơn hàng thành công', data: order });
    } catch (error) {
        console.error('Lỗi máy chủ', error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

const getOrder = async (req, res) => {
    try {
        const { query } = req.query;
        let orders;

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
                    { name: { $regex: query, $options: 'i' } },
                    { orderID: { $regex: query, $options: 'i' } },
                    { user: { $in: userIds } },
                    { 'products.product': { $in: productIds } }
                ]
            })
        } else {
            // Nếu không có truy vấn, lấy tất cả đơn hàng
            orders = await Order.find()
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
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại!' });
        }

        // Nếu số lượng được cập nhật, tính toán tổng tiền mới
        if (updates.quantity !== undefined) {
            // Kiểm tra số lượng mới và giá của sản phẩm
            const newQuantity = updates.quantity;
            const productPrice = order.products.product.price;
            
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

        res.status(200).json({ success: true,message:'Cập nhật thành công', data: updatedOrder });

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
const deleteManyOrder = async (req, res) => {
    try {
        const { _id } = req.body; // Lấy _id từ req.body
        if (!Array.isArray(_id) || _id.length === 0) {
            return res.status(400).json({ success: false, error: 'Không có ID đơn hàng nào được cung cấp!' });
        }

        const result = await Order.deleteMany({ _id: { $in: _id } }); // Sử dụng toán tử $in để xóa nhiều ID
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy đơn hàng nào để xóa!' });
        }

        res.status(200).json({ success: true, message: "Đã xóa đơn hàng thành công", deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message }); // Trả về mã lỗi 500 cho lỗi máy chủ
    }
}

module.exports = { createOrder, getOrder,getOneOrder,updateOrder,deleteOrder,deleteManyOrder };
