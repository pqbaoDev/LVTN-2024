const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
const ApiError = require("./app/api-error");
const Auth = require("./app/routes/auth");
const User = require("./app/routes/user");
const Product = require("./app/routes/product")
const Employee = require("./app/routes/employee")


const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",Auth);
app.use("/api/user",User);
app.use("/api/product",Product);
app.use("/api/employee",Employee);


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