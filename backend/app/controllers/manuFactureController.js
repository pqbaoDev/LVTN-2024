const Manufacture = require("../models/ManufactureSchema");

// Hàm tạo một nhà sản xuất mới
const createManufacture = async (req, res) => {
  try {
    const { name } = req.body;
    const manuFacture = await Manufacture.findOne({ name });
    if (manuFacture) {
      return res.status(401).json({ message: "Tên nhãn hàng đã tồn tại" });
    }
    if (!name) {
      return res.status(400).json({ message: "Tên là bắt buộc" });
    }
    const newManufacture = new Manufacture({
      name,
    });
    await newManufacture.save();
    res.status(201).json({
      message: "Nhà sản xuất đã được tạo thành công",
      data: newManufacture,
    });
  } catch (error) {
    console.error("Lỗi khi tạo nhà sản xuất:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};
const getAll = async (req, res) => {
  try {
    const { query } = req.query;
    let manuFacture;
    if (query) {
      manuFacture = await Manufacture.find({
        name: { $regex: query, $options: "i" },
      });
    } else {
      manuFacture = await Manufacture.find();
    }
    res.status(200).json({ success: true, data: manuFacture });
  } catch (error) {
    res.status(500).json({ success: true, error: error.message });
  }
};

module.exports = { createManufacture, getAll };
