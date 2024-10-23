const express = require('express');
const {createRetail, getRetail} = require('../controllers/retailController');

const router = express.Router();
 router.post("/",createRetail).get("/",getRetail)
module.exports = router;