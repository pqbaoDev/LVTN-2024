const express = require('express');
const Auth = require("./auth");
const User = require("./user");
const Product = require("./product")
const Employee = require("./employee");
const Order = require("./order");
const Category = require("./category");
const ManuFacture = require("./manuFacture");
const WareHouse = require("./warehouse");
const Promotion = require("./promotion");
const Warranty = require("./warranty");
const Cart = require("./cart");
const Retail = require("./retail");
const Zone = require("./zone");
const Location = require("./location");
const StockIn = require("./stockIn");
const StockOut = require("./stockOut");

const router = express.Router();

router.use("/auth",Auth);
router.use("/user",User);
router.use("/product",Product);
router.use("/employee",Employee);
router.use("/order",Order);
router.use("/category",Category);
router.use("/manuFacture",ManuFacture)
router.use("/warehouse",WareHouse);
router.use("/promotion",Promotion);
router.use("/warranty",Warranty);
router.use("/cart",Cart);
router.use("/retail",Retail)
router.use("/zone",Zone);
router.use("/location",Location);
router.use("/stockIn",StockIn);
router.use("/stockOut",StockOut);


module.exports = router;