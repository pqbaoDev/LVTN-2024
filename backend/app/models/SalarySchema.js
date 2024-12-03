const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, // Liên kết với nhân viên
    position: { type: mongoose.Schema.Types.ObjectId, ref: 'Position', required: true },
    bonus: { type: Number, default: 0 }, // Thưởng
    totalSalary: { type: Number }, // Tổng lương (tính toán từ lương cơ bản, thưởng, phụ cấp)
    paymentDate: { type: Date, required: true }, // Ngày thanh toán
  });

  SalarySchema.pre('save', function(next) {
    // Tính tổng lương = lương cơ bản + thưởng + phụ cấp
    const position = this.position;

    if (position) {
        this.totalSalary = position.baseSalary + this.bonus + position.allowances;
    } else {
        this.totalSalary = this.bonus;
    }
    
    next();
});

// Tự động điền thông tin nhân viên và chức vụ khi truy vấn
SalarySchema.pre(/^find/, function(next) {
    this.populate({
        path: 'employeeId',
        select: 'name employeeId phone'
    }).populate({
        path: 'position',
        select: 'name baseSalary allowances' // Lấy tên chức vụ, lương cơ bản, và phụ cấp
    });
    
    next();
});

const SalaryModel = mongoose.model('Salary', SalarySchema);

module.exports = SalaryModel;
  