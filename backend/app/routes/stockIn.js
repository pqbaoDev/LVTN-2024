const express = require("express");
const {createStockIn, getOne, getAll, getStockInByDateRange, getByIdLocation}=require("../controllers/stockInController");

const router = express.Router();
router.post("/",createStockIn).get("/getone/:id",getOne)
router.get('/', getAll)
router.get('/location/:id', getByIdLocation)
router.get('/daterange/:id',getStockInByDateRange);
module.exports = router;