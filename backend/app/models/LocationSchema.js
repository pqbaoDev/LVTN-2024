const mongoose = require('mongoose');

// Định nghĩa schema cho Location
const LocationSchema = new mongoose.Schema({
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
  },
    quantity: { type: Number, default: 0 },
  }],
  capacity: { type: Number, default: 20 },
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Zone",
    required: true
  },
  type: {
    type: String,
    enum: ['rack', 'pallet'],
    default: 'rack',
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
});

LocationSchema.pre('save', async function (next) {
  this.products = this.products.filter(productEntry => productEntry.quantity > 0);
  next();
});


// Middleware để populate zone và product
LocationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'zone',
    select: 'name symbol' 
  }).populate({
    path: 'products.product',
    select: 'name size stock price' 
  });
  next();
});

// Tạo mô hình Location từ schema
const Location = mongoose.model('Location', LocationSchema);

module.exports = Location;
