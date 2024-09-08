const express = require('express');
const {createManufacture} = require('../controllers/manuFactureController');

const router = express.Router();

router.post('/',createManufacture);

module.exports = router;