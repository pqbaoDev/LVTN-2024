const mongoose = require('mongoose');

const ViewedProductSchema = new mongoose.Schema (
    {
        products: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            view: {
                type: Number,
                required: true,
                default:0,
            }
        }],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

    }, { timestamps: true }
);
ViewedProductSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name address phone'
    }).populate({
        path:'products.product',
        select:'name photo manuFacture price discount type'
    }); // Thay đổi đây để populate đúng
    next();
});
const ViewedProductModel = mongoose.model("ViewedProduct", ViewedProductSchema);

module.exports = ViewedProductModel;