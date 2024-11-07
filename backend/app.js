const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
const ApiError = require("./app/api-error");
const Auth = require("./app/routes/auth");
const User = require("./app/routes/user");
const Product = require("./app/routes/product")
const Employee = require("./app/routes/employee");
const Order = require("./app/routes/order");
const Category = require("./app/routes/category");
const ManuFacture = require("./app/routes/manuFacture");
const WareHouse = require("./app/routes/warehouse");
const Promotion = require("./app/routes/promotion");
const Warranty = require("./app/routes/warranty");
const Cart = require("./app/routes/cart");
const Retail = require("./app/routes/retail");
const Zone = require("./app/routes/zone");
const Location = require("./app/routes/location");
const StockIn = require("./app/routes/stockIn");
const StockOut = require("./app/routes/stockOut");
// const Bin = require("./app/routes/warhouse/bin");
// const Shelf = require("./app/routes/warhouse/shelf");
// const Shelf = require("./app/routes/warhouse/shelf");


const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",Auth);
app.use("/api/user",User);
app.use("/api/product",Product);
app.use("/api/employee",Employee);
app.use("/api/order",Order);
app.use("/api/category",Category);
app.use("/api/manuFacture",ManuFacture)
app.use("/api/warehouse",WareHouse);
app.use("/api/promotion",Promotion);
app.use("/api/warranty",Warranty);
app.use("/api/cart",Cart);
app.use("/api/retail",Retail)
app.use("/api/zone",Zone);
app.use("/api/location",Location);
app.use("/api/stockIn",StockIn);
app.use("/api/stockOut",StockOut);
// app.use("/api/warehouse/bin",Bin);
// app.use("/api/warehouse/shelf",Shelf);




app.get("/",(req,res)=>{
    res.json({message: "wellcome"})
});

app.use((req, res, next) => {
	return next(new ApiError(404, "Resource not found"));
});

// define error-handling middleware last, after other app.use() and routes calls
app.use((error, req, res, next) => {
	return res.status(error.statusCode || 500).json({
		message: error.message || "Internal Server Error",
	});
});

module.exports = app;