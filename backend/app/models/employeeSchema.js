const mongoose = require('mongoose');

// Định nghĩa schema cho Employee
const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:{type:String},
  phone: { type: String},
  photo: { type: String },
  address: { type: String },
  position: { type: String },
  startDate: { type: Date },
  salary: { type: Number },
  isActive: { type: Boolean, default: true },
  employeeId: { type: String, unique: true },
});

// Tạo mô hình Employee từ schema
const EmployeeModel = mongoose.model('Employee', EmployeeSchema);

module.exports = EmployeeModel;
