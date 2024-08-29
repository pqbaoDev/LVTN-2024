const express = require("express");

const {createProduct,updateProduct,getSingleProduct,getAllProduct,deleteProduct,deleteAllProduct}= require("../controllers/productController");

const router = express.Router();

router.post("/",createProduct)
        .put("/:id",updateProduct)
        .get("/:id",getSingleProduct)
        .get("/",getAllProduct)
        .delete("/:id",deleteProduct)
        .delete("/",deleteAllProduct)

module.exports = router;