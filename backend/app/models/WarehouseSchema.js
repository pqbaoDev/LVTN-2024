const mongoose = require('mongoose');

const WarehouseSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    warehousequantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    // Thêm thông tin vị trí quản lý
    zone: {
        type: String,
        required: [true, 'Zone is required'] // Khu
    },
    shelf: {
        type: String,
        required: [true, 'Shelf is required'] // Kệ
    },
    level: {
        type: String,
        required: [true, 'Level is required'] // Tầng
    }
});

// Populate thông tin sản phẩm
WarehouseSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'product',
        select: 'name photo price discount'
    });
    next();
});

const WarehouseModel = mongoose.model('Warehouse', WarehouseSchema);
module.exports = WarehouseModel;
