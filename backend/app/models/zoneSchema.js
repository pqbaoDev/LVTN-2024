const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
  name: { type: String, required: true },    // Tên khu vực
  symbol:{type:String},
  description: { type: String },             // Mô tả về khu vực
  
}, { timestamps: true });  // Tự động quản lý createdAt và updatedAt

const ZoneModel = mongoose.model('Zone', ZoneSchema);
module.exports = ZoneModel;
