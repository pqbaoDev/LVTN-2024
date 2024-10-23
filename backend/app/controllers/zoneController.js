const ZoneModel = require('../models/zoneSchema');

// Hàm tạo zone mới
const createZone = async (req, res) => {
  try {
    const { name, description,symbol } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!name) {
      return res.status(400).json({ message: 'Tên khu vực không được để trống.' });
    }

    // Tìm khu vực theo tên
    const zone = await ZoneModel.findOne({ name });

    if (zone) {
      return res.status(200).json({ message: 'khu vực đã tồn tại.', zone });
    } else {
      // Nếu khu vực chưa tồn tại, tạo mới
      const newZone = new ZoneModel({
        name,
        description,
        symbol,
       
      });
      await newZone.save();
      return res.status(201).json({ message: 'Thêm khu vực mới thành công.', zone: newZone });
    }
  } catch (error) {
    // Xử lý lỗi
    res.status(500).json({ message: 'Lỗi khi thêm hoặc cập nhật khu vực.', error: error.message });
  }
};
const getZone = async(req,res)=>{
  try {
    const zone = await ZoneModel.find();
    res.status(200).json({data:zone});
  } catch (error) {
    res.status(500).json({message:'Lấy danh sách khu vực thất bại'})
    
  }
}
const getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const zone = await ZoneModel.findById(id);

    if (!zone) {
      return res.status(404).json({ message: 'Không tìm thấy khu vực hoặc rack' });
    }

    res.status(200).json({ data: zone });
  } catch (error) {
    console.error('Error fetching rack:', error); // Ghi log lỗi cho dễ debug
    res.status(500).json({ message: 'Lấy danh sách khu vực thất bại', error: error.message });
  }
};


module.exports = { createZone,getZone,getOne };
