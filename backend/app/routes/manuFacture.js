const express = require('express');
const {createManufacture, getAll} = require('../controllers/manuFactureController');

const router = express.Router();

router.post('/',createManufacture).get('/',getAll);

module.exports = router;