const mongoose = require('mongoose')

const ManufactureSchema = new mongoose.Schema ({
    name:{type: String,require:true},
    photo:{type:String}
})
const ManufactureModel = mongoose.model("Manufacture",ManufactureSchema)
module.exports = ManufactureModel;
