const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1']
        }
    }],
    orderID: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Đang xử lý', 'Chờ thanh toán', 'Đã hoàn tất', 'Đơn hủy'],
        default: 'Đang xử lý'
    }
});

// Populate user and products
OrderSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name address phone'
    }).populate({
        path:'products.product',
        select:'name photo manuFacture price'
    }); // Thay đổi đây để populate đúng
    next();
});

const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;
