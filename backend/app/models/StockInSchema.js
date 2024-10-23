const mongoose = require("mongoose");

const StockInSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',  // Giả sử có mô hình Employee
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',  // Giả sử có mô hình Product
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',  // Giả sử có mô hình Location
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1 // Số lượng phải lớn hơn 0
    },
    date: {
        type: Date,
        default: Date.now // Mặc định là thời gian hiện tại
    },
    
}, {
    timestamps: true // Thêm timestamps cho thời gian tạo và cập nhật
});
StockInSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'employee',
        select: 'name employeeId'
    }).populate({
        path:'product',
        select:'name photo manuFacture price discount'
    }).populate('location'); // Thay đổi đây để populate đúng
    next();
});

const StockInSModel = mongoose.model("StockIn", StockInSchema);
module.exports = StockInSModel;
