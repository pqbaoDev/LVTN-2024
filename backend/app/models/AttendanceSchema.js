const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, // Liên kết với nhân viên
    date: { type: Date, required: true }, // Ngày làm việc
    clockIn: { type: Date, required: true }, // Giờ vào
    clockOut: { type: Date }, // Giờ ra
    hoursWorked: { type: Number }, // Số giờ làm việc (tính toán từ giờ vào và giờ ra)
    status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' }, // Tình trạng (có mặt, vắng mặt, đi trễ)
    date: { type: Date, required: true }, // Ngày chấm công
    createdAt: { type: Date, default: Date.now }
  });

  AttendanceSchema.pre('save', function(next) {
    if (this.clockIn && this.clockOut) {
        const hours = (this.clockOut - this.clockIn) / (1000 * 60 * 60); // Tính số giờ giữa `clockIn` và `clockOut`
        this.hoursWorked = hours;
    }
    next();
});

  AttendanceSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'employee',
        select: 'name employeeId phone'
    });
    
    next();
});

const AttendanceModel = mongoose.model('Attendance', AttendanceSchema);

module.exports = AttendanceModel;
  
  