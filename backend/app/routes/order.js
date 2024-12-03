const express = require('express');
const {
    createOrder,
    getOrder,
    getOneOrder,
    updateOrder,
    deleteOrder,
    deleteManyOrder,
    getOneOrderWithUserId,
    createPaymentUrl,
    vnpayIPN,
    vnpayReturn,
    updateAndEmail,
    // getVNpayReturn,
    // getVNpayipn
} = require('../controllers/orderController');

const router = express.Router();
router.post("/", createOrder);
router.post("/create_payment_url",createPaymentUrl);
router.post("/:orderId", updateAndEmail);
router.get("/", getOrder);
router.get("/users/:userId", getOneOrderWithUserId);
router.get("/vnpay_ipn", vnpayIPN);
router.get("/vnpay_return", vnpayReturn);
router.get("/:id", getOneOrder);
router.patch("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.delete("/", deleteManyOrder);

module.exports = router;
