const express = require('express');
const {createLocation, getAll, getZone, updateZone} = require('../controllers/locationController');

const router = express.Router();

router.post("/",createLocation).get("/",getAll).get("/:zoneId",getZone).put("/:zoneId",updateZone);

module.exports=router;