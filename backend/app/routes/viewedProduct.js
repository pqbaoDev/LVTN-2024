const express = require('express');
const router = express.Router();
const viewedProductController = require('../controllers/viewedProduct.controller');
const { authenticate, restrict } = require("../../auth/verifyToken");



router.get('/',authenticate, restrict(['user']), viewedProductController.getAllViewedProducts);
router.post('/add', viewedProductController.addViewedProduct);
router.delete('/delete', viewedProductController.deleteViewedProduct);
router.delete('/:userId', viewedProductController.deleteAllViewedProduct);

module.exports = router;
