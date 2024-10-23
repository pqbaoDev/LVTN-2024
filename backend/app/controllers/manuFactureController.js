
const Manufacture = require("../models/ManufactureSchema");

// Hàm tạo một nhà sản xuất mới
const createManufacture = async (req, res) => {
  try {
    const { name,phone,photo,email,address } = req.body;
    const manuFacture = await Manufacture.findOne({ name });
    if (manuFacture) {
      return res.status(401).json({ message: "Tên nhãn hàng đã tồn tại" });
    }
    if (!name) {
      return res.status(400).json({ message: "Tên là bắt buộc" });
    }
    const newManufacture = new Manufacture({
      name,
      phone,
      photo,
      email,
      address,
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
const updateManufacture = async(req,res)=>{
  try {
    const id = req.params.id;
    const manufactures = await Manufacture.findByIdAndUpdate(id,req.body,{
      new: true, runValidators: true 
    });
    if (!manufactures) {
      return res.status(404).json({ error: 'Nhà phân phối không tồn tại' });
      }
      res.status(200).json({success:true,message:"Cập nhật thành công",data:manufactures});
  } catch (error) {
    
  }
}
const getOne = async(req,res)=>{
  try {
    const id = req.params.id;
    const manufacture = await Manufacture.findById(id);
    res.status(200).json({success:true,data:manufacture});

    
  } catch (error) {
    res.status(500).json({ error: error.message });
    
  }
}
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
const deleteMany = async(req,res)=>{
  try {
    const { _id } = req.body; // Lấy _id từ req.body
    if (!Array.isArray(_id) || _id.length === 0) {
        return res.status(400).json({ success: false, error: 'Không có ID nhà phân phối nào được cung cấp!' });
    }

    const result = await Manufacture.deleteMany({ _id: { $in: _id } }); // Sử dụng toán tử $in để xóa nhiều ID
    
    if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, error: 'Không tìm thấy nhà phân phối nào để xóa!' });
    }

    res.status(200).json({ success: true, message: "Đã xóa nhà phân phối thành công", deletedCount: result.deletedCount });
} catch (error) {
    res.status(500).json({ success: false, error: error.message }); // Trả về mã lỗi 500 cho lỗi máy chủ
}
}

module.exports = { createManufacture, getAll,updateManufacture,getOne,deleteMany };
