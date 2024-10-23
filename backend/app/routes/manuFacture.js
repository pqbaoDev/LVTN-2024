const express = require('express');
const {createManufacture, getAll, updateManufacture, getOne, deleteMany} = require('../controllers/manuFactureController');

const router = express.Router();

router.post('/',createManufacture).get('/',getAll).get('/:id',getOne).put("/:id",updateManufacture).delete('/',deleteMany);

module.exports = router;