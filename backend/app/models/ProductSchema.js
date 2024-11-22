const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'Category' },
    manuFacture: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'ManuFacture' },
    // warehouse: { type: mongoose.Schema.Types.ObjectId, index: true, ref: 'Warehouse' },
    photo: { type: String },
    color: { type: String }, // Sửa "require" thành "required"
    size: { type: String },
    discount: { type: Number, min: 0, max: 100, default: 0 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 1, min: 0 },
    care:{type:Number,default:0},
    

    tags: [String],
    rating: { type: Number, min: 0, max: 5, default: 0 },
  },
  { timestamps: true }
);

// Middleware để populate dữ liệu liên quan
ProductSchema.pre(/^find/, function (next) {
  this.populate('category').populate({
    path:'manuFacture',
    select:'name phone'
  }); // Đảm bảo chính xác
  next();
});

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
