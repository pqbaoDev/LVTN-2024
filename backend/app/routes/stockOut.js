const express = require ('express');
const {createStockOut, getStockOut, getStockOutByIdLocation, getStockOutByDateRange} =require("../controllers/stockOutController");

const router = express.Router();
router.get('/daterange/:id',getStockOutByDateRange);
router.post('/',createStockOut).get("/",getStockOut).get("/getLocationId/:id",getStockOutByIdLocation);
module.exports = router;
