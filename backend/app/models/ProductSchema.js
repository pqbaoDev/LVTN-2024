const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  category: { type: String },
  stock: { type: Number, default: 0, min: 0 },
  images: [String],
  tags: [String],
  discount: { type: Number, min: 0, max: 100 },
  rating: { type: Number, min: 0, max: 5 },
}, { timestamps: true });

// Cập nhật trường `updatedAt` mỗi khi lưu
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;
