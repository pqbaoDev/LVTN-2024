const express = require('express');
const {createZone, getZone, getOne} = require('../controllers/zoneController');

const router = express.Router();

router.post('/',createZone).get("/",getZone).get("/:id",getOne);

module.exports = router;