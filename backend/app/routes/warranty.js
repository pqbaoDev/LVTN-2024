const express = require('express');
const { createWarranty, getWarranties, updateWarranty, deleteWarranty, getOne } = require("../controllers/warrantyController");

const router = express.Router();

router.post("/", createWarranty).get("/", getWarranties).put("/:id", updateWarranty).delete("/:id", deleteWarranty).get("/:id",getOne);

module.exports = router;