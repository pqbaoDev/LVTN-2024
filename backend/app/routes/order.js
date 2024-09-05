const express = require('express');
const {createOrder, getOrder,getOneOrder,updateOrder, deleteOrder} = require('../controllers/orderController');

const router = express.Router();

router.post("/",createOrder)
    .get("/",getOrder)
    .get("/:id",getOneOrder)
    .put("/:id",updateOrder)
    .delete("/:id",deleteOrder)

module.exports = router;