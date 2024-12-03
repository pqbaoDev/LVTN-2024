const mongoose = require("mongoose");

const ProductTempSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'Category' },
    manuFacture: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'ManuFacture' },
    photo: [{ type: String }],
    color: {
      hex: { type: String }, // Mã màu (Hex hoặc RGB)
      name: { type: String }, // Tên màu
    },
    size: { type: String },
    stock: { type: Number, default: 1, min: 0 },

    discount: { type: Number, min: 0, max: 100, default: 0 },
    price: { type: Number, required: true, min: 0 },
    
  },
  { timestamps: true }
);

// Middleware để populate dữ liệu liên quan
ProductTempSchema.pre(/^find/, function (next) {
  this.populate('category').populate({
    path: 'manuFacture',
    select: 'name phone'
  });
  next();
});

const ProductTempModel = mongoose.model("ProductTemp", ProductTempSchema);

module.exports = ProductTempModel;
