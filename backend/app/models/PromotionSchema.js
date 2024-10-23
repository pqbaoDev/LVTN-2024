const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    promotionId: {
        type: String,
        required: true,
        unique: true, // Đảm bảo mỗi khuyến mãi có ID duy nhất
    },
    quantity: {
        type: Number,
        required: true,
    },
    sale: {
        type: Number,
        required: true,
        min: 0, // Đảm bảo giá trị không âm
    },
    startDate: { // Thời gian bắt đầu khuyến mãi
        type: Date,
        required: true,
    },
    endDate: { // Thời gian kết thúc khuyến mãi
        type: Date,
        required: true,
    },
    status: { // Trạng thái của khuyến mãi
        type: String,
        enum: ['upcoming', 'active', 'expired'], // Chỉ nhận 3 giá trị này
        default: 'upcoming'
    },
}, { timestamps: true });


// Middleware để tự động cập nhật trạng thái khuyến mãi
PromotionSchema.pre('save', function(next) {
    const now = new Date();

    if (now < this.startDate) {
        this.status = 'upcoming'; // Nếu chưa đến ngày bắt đầu
    } else if (now >= this.startDate && now <= this.endDate) {
        this.status = 'active'; // Nếu đang trong thời gian khuyến mãi
    } else {
        this.status = 'expired'; // Nếu đã qua thời gian kết thúc
    }
    
    next();
});



const PromotionModel = mongoose.model("Promotion", PromotionSchema);
module.exports = PromotionModel;
