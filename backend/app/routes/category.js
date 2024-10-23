const express = require('express');
const {createCategory,getAll,deleteMany, updateCategories,getOne}=require("../controllers/categoryController");
const router = express.Router();

router.post('/',createCategory).get('/',getAll).delete('/',deleteMany).put("/:id",updateCategories).get('/:id',getOne);

module.exports = router;