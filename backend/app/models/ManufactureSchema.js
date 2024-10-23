const mongoose = require('mongoose');

// Định nghĩa schema cho Manufacture (Nhà sản xuất)
const ManufactureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Đảm bảo tên nhà sản xuất là duy nhất
        trim: true,   // Loại bỏ khoảng trắng thừa ở đầu và cuối
        maxlength: 100 // Giới hạn độ dài của tên
    },
    photo: {
        type: String,
        required: true, // Bắt buộc phải có ảnh đại diện
    },
    address: {
        type: String,
        maxlength: 200 // Giới hạn độ dài của địa chỉ
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v); // Kiểm tra xem số điện thoại có hợp lệ không (10-11 số)
            },
            message: props => `${props.value} không phải là số điện thoại hợp lệ!`
        }
    },
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'], // Bắt buộc phải có email
        unique: true, // Email phải là duy nhất
        lowercase: true, // Chuyển email thành chữ thường
    },
    createdAt: {
        type: Date,
        default: Date.now // Tự động tạo ngày tạo
    },
    updatedAt: {
        type: Date,
        default: Date.now // Tự động cập nhật ngày cập nhật
    }
});

// Hook trước khi lưu để cập nhật `updatedAt` mỗi khi dữ liệu được sửa
ManufactureSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Tạo mô hình Manufacture từ schema
const ManufactureModel = mongoose.model('ManuFacture', ManufactureSchema);
module.exports = ManufactureModel;
