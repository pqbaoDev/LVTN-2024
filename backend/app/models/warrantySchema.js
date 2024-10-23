const mongoose = require('mongoose');

const WarrantySchema = new mongoose.Schema({
    nameCustomer:{
        type:String,
        required:true
    },
    phoneCustomer:{
        type:String,
        required:true
    },
    address:{
        type:String
    },
    product:{
        type:String,
        required:true
    },
    type:{
        color:[String],
        ram:[String]
    },
    warrantyPeriod: { // Thời gian bảo hành (tính bằng tháng)
        type: Number,
        required: true
    },
    startDate: { // Thời gian bắt đầu khuyến mãi
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
        
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: { // Warranty status
        type: String,
        enum: ['active', 'expired', 'claimed'],
        default: 'active'
    }
    
});
WarrantySchema.methods.updateStatus = function() {
    const currentDate = new Date();
    if (this.endDate < currentDate) {
        this.status = 'expired';
    }
};

WarrantySchema.index({ status: 1 });
const WarrantyModel = mongoose.model('Warranty', WarrantySchema);
module.exports = WarrantyModel;
