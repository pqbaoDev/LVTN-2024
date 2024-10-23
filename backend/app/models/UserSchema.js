const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  photo: { type: String },
  address:{type:String},
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  point:{
    type:Number,
    default:0
  },
  gender: { type: String, enum: ["Nam", "Nữ", "Khác"] },
  bloodType: { type: String },
});
UserSchema.pre('save', function (next) {
  if (this.point) {
    this.point = Math.round(this.point); // Làm tròn số về số nguyên
  }
  next();
});
const UserModel = mongoose.model("User",UserSchema);
module.exports = UserModel;

