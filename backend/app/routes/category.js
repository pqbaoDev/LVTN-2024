const express = require('express');
const {createCategory,getAll}=require("../controllers/categoryController");

const router = express.Router();

router.post('/',createCategory).get('/',getAll);

module.exports = router;