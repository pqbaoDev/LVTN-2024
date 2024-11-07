const express = require('express');
const {createLocation, getAll, getZone, updateZone, getOne} = require('../controllers/locationController');

const router = express.Router();

router.post("/",createLocation)
        .get("/",getAll)
        .get("/:zoneId",getZone)
        .put("/:id",updateZone)
        .get("/getOneLocation/:id",getOne);

module.exports=router;