const mongoose = require('mongoose');

// Định nghĩa schema cho Counter
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 }
});

// Tạo mô hình Counter từ schema
const Counter = mongoose.model('Counter', CounterSchema);

module.exports = Counter;
