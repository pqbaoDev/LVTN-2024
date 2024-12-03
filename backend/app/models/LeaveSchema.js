const mongoose = require('mongoose');


const LeaveSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, // Liên kết với nhân viên
    startDate: { type: Date, required: true }, // Ngày bắt đầu phép
    endDate: { type: Date, required: true }, // Ngày kết thúc phép
    type: { type: String, enum: ['sick', 'vacation', 'other'], required: true }, // Loại phép
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // Trạng thái phép
    reason: { type: String, required: true }, // Lý do xin phép
    createdAt: { type: Date, default: Date.now }
  });
  LeaveSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'employee',
        select: 'name employeeId phone'
    });
    
    next();
});

const LeaveModel = mongoose.model('Leave', LeaveSchema);

module.exports = LeaveModel;
  