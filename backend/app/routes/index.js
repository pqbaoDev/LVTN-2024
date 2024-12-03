const express = require('express');
const Auth = require("./auth");
const User = require("./user");
const Product = require("./product")
const ProductTemp = require("./productTemp")
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
const ViewedProduct = require("./viewedProduct")
const ReviewProduct = require("./review")
const Leave = require("./leave");
const Salary = require("./salary");
const Attendance = require("./attendance");
const Position = require("./position");

const router = express.Router();

router.use("/auth",Auth);
router.use("/user",User);

router.use("/product/viewed",ViewedProduct);
router.use("/product/review",ReviewProduct);
router.use("/productTemp",ProductTemp);
router.use("/product",Product);
router.use("/employee/leave",Leave);
router.use("/employee/salary",Salary);
router.use("/employee/attendance",Attendance);
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
router.use("/position",Position);


module.exports = router;