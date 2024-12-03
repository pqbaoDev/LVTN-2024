const mongoose = require('mongoose');

const PositionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Tên chức vụ (ví dụ: Manager, Staff, etc.)
    baseSalary: { type: Number, required: true }, // Mức lương cơ bản cho chức vụ
    allowances: { type: Number, default: 0 }, // Phụ cấp cho chức vụ
    description:{type: String},
    status:{type:Boolean, default: true},
    createdAt: { type: Date, default: Date.now }, // Ngày tạo
});

// Tạo model từ schema Position
const PositionModel = mongoose.model('Position', PositionSchema);

module.exports = PositionModel;
