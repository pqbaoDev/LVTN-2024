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
  position: { type: String },
  startDate: { type: Date },
  salary: { type: Number },
  subsidy: { type: Number },
  isActive: { type: Boolean, default: true },
  employeeId: { type: String, unique: true }
});
const EmployeeModel = mongoose.model('Employee', EmployeeSchema);

module.exports = EmployeeModel;
