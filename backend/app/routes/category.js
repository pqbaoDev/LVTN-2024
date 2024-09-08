const express = require('express');
const {createCategory,getAll}=require("../controllers/categoryController");

const router = express.Router();

router.post('/',createCategory).get('/:id',getAll);

module.exports = router;