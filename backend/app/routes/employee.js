const express = require("express")
const {updateEmployee,getAllEMployee,getSingleEMployee,deleteEmployee} = require("../controllers/employeeController")

const router = express.Router();

router.get("/",getAllEMployee).get("/:id",getSingleEMployee).put("/:id",updateEmployee).delete("/:id",deleteEmployee);

module.exports  = router;