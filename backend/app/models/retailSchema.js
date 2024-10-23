const mongoose = require('mongoose');

const RetailSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    employee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

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
    totalAmount: {
        type: Number,
        default: 0
    },
    salePrice:{
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    payment:{
        type:String,
        enum:['Tiền mặt','Chuyển khoản','Thẻ'],
        default:'Tiền mặt'
    },
    
});

// Populate user and products
RetailSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name address phone'
    }).populate({
        path:'products.product',
        select:'name manuFacture price discount'
    }).populate({
        path:'employee',
        select: 'name employeeId'
    }); // Thay đổi đây để populate đúng
    next();
});

const RetailModel = mongoose.model('Retail', RetailSchema);
module.exports = RetailModel;
