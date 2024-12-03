const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'Category' },
    manuFacture: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'ManuFacture' },
    avatar:{type:String},
    photo: [{ type: String }],  // Có thể thêm validation nếu cần thiết cho ảnh
    color: {
      hex: { type: String },  // Mã màu (Hex hoặc RGB)
      name: { type: String }, // Tên màu
    },
    size: { type: String },
    discount: { type: Number, min: 0, max: 100, default: 0 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 1, min: 0 },
    care: { type: Number, default: 0 },
    tags: [String],
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
    locations: [{ type: mongoose.Types.ObjectId, ref: "Location" }],
    averageRating: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
    alt:{type:Boolean, default: true}
  },
  { timestamps: true }
);

// Middleware để populate dữ liệu liên quan (tùy chọn theo nhu cầu)
ProductSchema.pre(/^find/, function (next) {
  // Chỉ populate những thông tin cần thiết
  this.populate('category')
      .populate({
        path: 'manuFacture',
        select: 'name phone'  // Chỉ lấy thông tin name và phone của manuFacture
      })
     
  next();
});

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
