const mongoose = require('mongoose');
// Định nghĩa schema cho Employee
const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String },
  phone: { type: String },
  photo: { type: String },
  address: { type: String },
  gender: { type: String, enum: ["Nam", "Nữ", "Khác"] },
  position: { type: mongoose.Schema.Types.ObjectId, ref: 'Position', required: true },
  startDate: { type: Date },
  isActive: { type: Boolean, default: true },
  employeeId: { type: String, unique: true }
});

EmployeeSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'position',
    select: 'name ' 
  });
  next();
});

const EmployeeModel = mongoose.model('Employee', EmployeeSchema);

module.exports = EmployeeModel;
