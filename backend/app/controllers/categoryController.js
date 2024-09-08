const Category = require("../models/CategorySchema");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Tên là bắt buộc" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({ message: "Tên danh mục đã tồn tại" });
    }
    const newCategory = new Category({ name });
    const savedCategory = await newCategory.save();

    res.status(201).json({
      message: "Danh mục đã được tạo thành công",
      data: savedCategory,
    });
  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};
const getOne = async(req,res)=>{
    try {
        const id = req.params.id;
        const category = await Category.findById(id);
        res.status(200).json({success:true,data:category})
    } catch (error) {
        
    }
}

module.exports = { createCategory,getOne };
