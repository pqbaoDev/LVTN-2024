const express = require('express');
const {createProduct} = require('../controllers/warehouseController');

const router = express.Router();

router.post("/",createProduct);

module.exports = router;