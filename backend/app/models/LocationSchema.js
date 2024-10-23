const mongoose = require('mongoose');

// Định nghĩa schema cho Location
const LocationSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Zone",
    required: true
  },
  type: {
    type: String,
    enum: ['rack', 'pallet'],
    default:'rack',
    required: true
  },
  rack: {
    type: String,
  },
  pallet: {
    type: String,
  },
  level: {
    type: Number,
    min: [1, 'Tầng phải lớn hơn hoặc bằng 1.'],
    default: 1
  },
  quantity: { type: Number,default:0 },
  capacity: { type: Number ,default:20},
});

// Middleware để populate zone và product
LocationSchema.pre('find', function (next) {
  this.populate({
    path: 'zone',
    select: 'name' // Chỉ lấy tên của zone
  }).populate({
    path: 'product',
    select: 'name' // Chỉ lấy tên của product
  });
  next();
});

// Tạo mô hình Location từ schema
const Location = mongoose.model('Location', LocationSchema);

module.exports = Location;
