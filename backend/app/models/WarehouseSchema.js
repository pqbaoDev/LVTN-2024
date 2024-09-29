const mongoose = require('mongoose');

const WarehouseSchema = new mongoose.Schema({
    

});

const WarehouseModel = mongoose.model('Warehouse',WarehouseSchema);
module.exports = WarehouseModel;