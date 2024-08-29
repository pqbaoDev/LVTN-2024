const express = require('express');
const { register,login } = require('../controllers/authController'); // Đảm bảo đường dẫn chính xác

const router = express.Router();

router.post('/register', register).post('/login',login)

module.exports = router;
