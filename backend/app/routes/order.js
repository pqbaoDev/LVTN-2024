const express = require('express');
const {createOrder, getOrder,getOneOrder,updateOrder, deleteOrder,deleteManyOrder} = require('../controllers/orderController');

const router = express.Router();

router.post("/",createOrder)
    .get("/",getOrder)
    .get("/:id",getOneOrder)
    .put("/:id",updateOrder)
    .delete("/:id",deleteOrder)
    .delete("/",deleteManyOrder)

module.exports = router;