const express = require('express');
const {createCategory,getOne}=require("../controllers/categoryController");

const router = express.Router();

router.post('/',createCategory).get('/:id',getOne);

module.exports = router;