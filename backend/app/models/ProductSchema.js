const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },

    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId,required:true,index:true,ref:'Category' },
    stock: { type: Number, default: 1, min: 0 },
    photo: [String],
    manuFacture:{type:mongoose.Schema.Types.ObjectId,required:true,index:true,ref:'ManuFacture'},
    tags: [String],
    discount: { type: Number, min: 0, max: 100 },
    rating: { type: Number, min: 0, max: 5 },
  },
  { timestamps: true }
);
ProductSchema.pre(/^find/, function(next) {
  this.populate('category').populate('manuFacture');
  next();
});
const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
