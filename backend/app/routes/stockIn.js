const express = require("express");
const {createStockIn, getOne, getAll, getStockInByDateRange}=require("../controllers/stockInController");

const router = express.Router();
router.post("/",createStockIn).get("/getone/:id",getOne)
router.get('/', getAll)
router.get('/daterange',getStockInByDateRange);
module.exports = router;