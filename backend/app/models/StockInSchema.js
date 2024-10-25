const mongoose = require("mongoose");

const StockInSchema = new mongoose.Schema({
    _id:{
        type:String,
    },
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
    status:{type:String,enum:['Đã hoàn tất','Chưa hoàn tất'],default:'Chưa hoàn tất'},
    note:{type:String},
    
}, {
    timestamps: true // Thêm timestamps cho thời gian tạo và cập nhật
});
StockInSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'employee',
        select: 'name employeeId phone'
    }).populate({
        path:'product',
        select:'name photo manuFacture price discount'
    }).populate({
        path:'location',
        select:'zone rack pallet type '
    }); // Thay đổi đây để populate đúng
    next();
});

const StockInSModel = mongoose.model("StockIn", StockInSchema);
module.exports = StockInSModel;
