const mongoose =require ("mongoose");
const Product = require ("./ProductSchema")

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    order: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
    status:{type:Boolean,default: true}
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function(next){
  this.populate({
    path:'user',
    select:"name photo phone",
  }).populate({
    path:'product',
    select:"name photo size color",
  }).populate({
    path:'order',
    select:"orderID createdAt totalAmount",
  });next();
});
reviewSchema.statics.calcAverageRatings = async function(productId){
  const stats = await this.aggregate([{
    $match: {product: productId}
  },
  {
    $group:{
      _id: '$product',
      numOfRating:{$sum:1},
      avgRating:{$avg:"$rating"},
    }
  }
])

await Product.findByIdAndUpdate(productId, {
  totalRating: stats[0].numOfRating,
  averageRating: stats[0].avgRating,
})
}
reviewSchema.post('save',function(){
  this.constructor.calcAverageRatings(this.product);
});
const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;
