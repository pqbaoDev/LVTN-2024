const express = require('express');
const {creatPromotion, updatePromotion, deletePromotion, getPromotion, getOne, getPromotionId } = require("../controllers/promotionController");

const router = express.Router();

router.post("/",creatPromotion)
        .put("/:id",updatePromotion)
        .delete("/:id",deletePromotion)
        .get('/',getPromotion)
        .get("/voucher/:promotionId",getPromotionId)
        .get("/:id",getOne)

module.exports = router;
