const mongoose = require('mongoose')

const ManuFactureSchema = new mongoose.Schema ({
    name:{type: String,require:true,unique:true},
    photo:{type:String}
})
const ManuFactureModel = mongoose.model("ManuFacture",ManuFactureSchema)
module.exports = ManuFactureModel;
