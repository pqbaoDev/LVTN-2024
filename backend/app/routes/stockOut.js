const express = require ('express');
const {createStockOut, getStockOut} =require("../controllers/stockOutController");

const router = express.Router();
router.post('/',createStockOut).get("/",getStockOut);
module.exports = router;
