const CartModel = require('../models/CartSchema');
const Order = require('../models/OrderSchema');
const Product = require('../models/ProductSchema');
const PromotionModel = require('../models/PromotionSchema');
const User = require('../models/UserSchema');
let express = require('express');
let router = express.Router();
// let $ = require('jquery');
// const request = require('request');
require('dotenv').config();

const moment = require('moment');

const createOrder = async (req, res) => {
    try {
        const { userId, products, phone, address, name, note, payment, totalAmountAfterDiscount,method, discount, totalSale, promotionId } = req.body;

        const orderProducts = [];
        let totalAmount = 0;

        const productPromises = products.map(async (item) => {
            const { productId, quantity } = item;
            const product = await Product.findById(productId);
            
            if (!product) {
                throw new Error(`Sản phẩm ${productId} không tồn tại!`);
            }

            if (quantity > product.stock) {
                throw new Error(`Số lượng sản phẩm ${productId} không đủ!`);
            }

            // Tính toán tổng tiền cho sản phẩm
            totalAmount += quantity * product.price - ((quantity * product.price) * (product.discount / 100));

            // Thêm thông tin sản phẩm vào mảng orderProducts
            orderProducts.push({ product: productId, quantity });

            // Cập nhật số lượng tồn kho
            product.stock -= quantity;
            await product.save();
        });

        // Chờ tất cả các promises (sản phẩm) hoàn thành
        await Promise.all(productPromises);

        // Kiểm tra và giảm số lượng voucher nếu có
        if (promotionId) {
            const promotion = await PromotionModel.findById(promotionId);
            if (promotion) {
                promotion.quantity -= 1;
                await promotion.save();
            }
        }

        // Cập nhật điểm cho người dùng nếu có
        if (totalAmountAfterDiscount > 0) {
            let userPoint = totalAmountAfterDiscount / 100;
            if (discount > 0) {
                userPoint -= discount;
            }
            const user = await User.findById(userId);
            user.point += userPoint;
            await user.save();
        }

        // Tạo mã đơn hàng
        const today = moment().format('DDMMYY');
        const orderCount = await Order.countDocuments({ createdAt: { $gte: moment().startOf('day'), $lt: moment().endOf('day') } });
        const orderId = `VN-${today}${(orderCount + 1).toString().padStart(3, '0')}`;

        // Tạo đơn hàng mới
        const order = new Order({
            user: userId,
            products: orderProducts,
            orderID: orderId,
            salePrice: totalSale,
            totalAmount: totalAmountAfterDiscount,
            voucher:promotionId,
            payment: payment || 'COD',
            phone,
            method,
            address,
            name,
            note,
        });

        await order.save();

        // Tìm và xóa sản phẩm khỏi giỏ hàng
        const cart = await CartModel.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Giỏ hàng không tìm thấy' });
        }

        // Duyệt qua từng sản phẩm trong đơn hàng và xóa khỏi giỏ hàng
        const productIdsInOrder = products.map(item => item.productId.toString());

        // Xóa các sản phẩm đã đặt trong đơn hàng khỏi giỏ hàng
        cart.products = cart.products.filter(item => !productIdsInOrder.includes(item.product._id.toString()));

        // Lưu giỏ hàng sau khi xóa sản phẩm
        await cart.save();

        res.status(200).json({ success: true, message: 'Tạo đơn hàng thành công', data: order });
    } catch (error) {
        console.error('Lỗi máy chủ', error);
        res.status(500).json({ success: false, message: error.message || "Lỗi server" });
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

const getOneOrderWithUserId = async(req,res)=>{
    try {
        const userId = req.params.userId;


        // Lấy tất cả đơn hàng của người dùng
        const orders = await Order.find({ user: userId });

        // Kiểm tra nếu không tìm thấy đơn hàng
        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: "Không có đơn hàng nào được tìm thấy." });
        }

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Lỗi lấy đơn hàng:", error);
        res.status(500).json({ success: false, message: "Lỗi không lấy được đơn hàng." });
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

        return res.status(200).json({ success: true, message: "Đã xóa đơn hàng thành công", deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message }); // Trả về mã lỗi 500 cho lỗi máy chủ
    }
}

// orderController.js

const createPaymentUrl = async (req, res, next) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    // const today = moment().format('DDMMYY');
    // const orderCount = await Order.countDocuments({ createdAt: { $gte: moment().startOf('day'), $lt: moment().endOf('day') } });
    
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    // let config = require('config');
    
    let tmnCode = '1H2E6VZS';
    let secretKey = "44CUMA54LS065L0ZPIXIZ96ZANNL9AL0";
    let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    let returnUrl = "http://localhost:3002/2002Store.com/order/vnpay_return";
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;
    let orderId = req.body.orderId;
    console.log(req.body)

    
    let locale = req.body.language;
    if(locale === null || locale === ''){
        locale = 'vn';
    }
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;

    const paymentUrl = `${vnpUrl}?${querystring.stringify(vnp_Params, { encode: false })}`;

    res.json({ paymentUrl });
};

const vnpayReturn = async (req, res, next) => {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let config = require('config');
    let tmnCode = "1H2E6VZS";
    let secretKey = "44CUMA54LS065L0ZPIXIZ96ZANNL9AL0";

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

    if(secureHash === signed){
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

        res.json('success', {code: vnp_Params['vnp_ResponseCode']})
    } else{
        res.json('success', {code: '97'})
    }
}
const sendMail = require('../service/mail.service');

const vnpayIPN = async (req, res, next) =>  {
    try {
        let vnp_Params = req.query;

        const secureHash = vnp_Params['vnp_SecureHash'];
        const orderId = vnp_Params['vnp_TxnRef'];
        const rspCode = vnp_Params['vnp_ResponseCode'];

        // Xóa các tham số không cần thiết
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        // Sắp xếp các tham số theo thứ tự
        vnp_Params = sortObject(vnp_Params);

        const querystring = require('qs');
        const signData = querystring.stringify(vnp_Params, { encode: false });
        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha512', "44CUMA54LS065L0ZPIXIZ96ZANNL9AL0");
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        // Kiểm tra mã bảo mật
        if (secureHash === signed) {
            // Tìm đơn hàng theo orderId
            const order = await Order.findOne({ orderId: orderId });

            if (order) {
                // Kiểm tra mã phản hồi
                if (rspCode === "00") {
                    order.payment = "Đã thanh toán";
                    await order.save();

                    // Gửi email xác nhận thanh toán thành công
                    await sendMail(
                        "Xác nhận thanh toán thành công",
                        "payment-success.html",
                        {
                            orderId: orderId,
                            amount: vnp_Params.vnp_Amount / 100,
                            date: new Date().toLocaleDateString(),
                        }
                    );

                    // Trả về phản hồi JSON
                    return res.status(200).json({
                        RspCode: '00',
                        Message: 'Success',
                        OrderId: orderId,
                    });
                } else {
                    order.payment = "Thanh toán thất bại";
                    await order.save();

                    // Gửi email thông báo thanh toán thất bại
                    await sendMail(
                        "Thông báo thanh toán thất bại",
                        "payment-failed.html",
                        {
                            orderId: orderId,
                            amount: vnp_Params.vnp_Amount / 100,
                            date: new Date().toLocaleDateString(),
                        }
                    );

                    // Trả về phản hồi JSON
                    return res.status(200).json({
                        RspCode: '01',
                        Message: 'Transaction failed',
                        OrderId: orderId,
                    });
                }
            } else {
                // Đơn hàng không tìm thấy
                return res.status(200).json({
                    RspCode: '02',
                    Message: 'Order not found for the given orderId.',
                });
            }
        } else {
            // Kiểm tra checksum thất bại
            return res.status(200).json({
                RspCode: '97',
                Message: 'Checksum failed. The secure hash does not match.',
            });
        }
    } catch (error) {
        console.error("Error in /vnpay_ipn:", error);
        return res.status(500).json({
            RspCode: '99',
            Message: 'Internal Server Error. Please try again later.',
        });
    }
};

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
const updateAndEmail = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        // Lấy các tham số từ body của yêu cầu (yêu cầu của VNPay)
        const { vnp_ResponseCode, vnp_Amount } = req.body;  // Giả sử thông tin phản hồi thanh toán được gửi trong body

        // Cập nhật thông tin đơn hàng
        const order = await Order.findOne({ orderID: orderId });
        if (order) {
            // Kiểm tra mã phản hồi
            if (vnp_ResponseCode === "00") {  // Thành công
                order.payment = "Đã thanh toán";
                order.method = "Chuyển khoản"
                await order.save();

                // Gửi email xác nhận thanh toán thành công
                await sendMail(
                    "Xác nhận thanh toán thành công",
                    "payment-success.html",
                    {
                        orderId: orderId,
                        amount: vnp_Amount / 100,  
                        date: new Date().toLocaleDateString(),
                    }
                );

                // Trả về phản hồi JSON
                return res.status(200).json({
                    RspCode: '00',
                    Message: 'Success',
                    OrderId: orderId,
                });
            } else {  // Thanh toán thất bại
                order.payment = "Thanh toán thất bại";
                await order.save();

                // Gửi email thông báo thanh toán thất bại
                await sendMail(
                    "Thông báo thanh toán thất bại",
                    "payment-failed.html",
                    {
                        orderId: orderId,
                        amount: vnp_Amount / 100,
                        date: new Date().toLocaleDateString(),
                    }
                );

                // Trả về phản hồi JSON
                return res.status(200).json({
                    RspCode: '01',
                    Message: 'Transaction failed',
                    OrderId: orderId,
                });
            }
        } else {
            // Đơn hàng không tìm thấy
            return res.status(404).json({
                RspCode: '02',
                Message: 'Order not found for the given orderId.',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi cập nhật đơn hàng." });
    }
};


module.exports = { createOrder,updateAndEmail, getOrder,getOneOrder,updateOrder,deleteOrder,deleteManyOrder,getOneOrderWithUserId,createPaymentUrl,vnpayIPN,vnpayReturn };
