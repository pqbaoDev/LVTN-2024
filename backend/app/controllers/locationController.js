const Location = require('../models/LocationSchema');
const Product = require('../models/ProductSchema');
const Zone = require('../models/zoneSchema');

const createLocation = async (req, res) => {
    try {
        const { productId, zoneId, type, rack, pallet, level, quantity, capacity } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!zoneId) {
            return res.status(400).json({
                message: 'Yêu cầu cung cấp đầy đủ các trường: zoneId.'
            });
        }

        if (type === 'rack' && !level) {
            return res.status(400).json({
                message: 'Vị trí tầng không được để trống khi loại là "rack".'
            });
        }

        if (type !== 'rack' && type !== 'pallet') {
            return res.status(400).json({
                message: 'Loại vị trí (type) chỉ có thể là "rack" hoặc "pallet".'
            });
        }

        if (type === 'rack' && !rack) {
            return res.status(400).json({
                message: 'Khi loại là "rack", trường "rack" là bắt buộc.'
            });
        }

        if (type === 'pallet' && !pallet) {
            return res.status(400).json({
                message: 'Khi loại là "pallet", trường "pallet" là bắt buộc.'
            });
        }

        if (level && level <= 0) {
            return res.status(400).json({
                message: 'Tầng (level) phải là số dương lớn hơn 0.'
            });
        }

        // Kiểm tra sự tồn tại của sản phẩm và khu vực
        const product = await Product.findById(productId);
        if (product && !quantity) {
            return res.status(400).json({
                message: 'Số lượng sản phẩm không được để trống.'
            });
        }

        const zone = await Zone.findById(zoneId);
        if (!zone) {
            return res.status(404).json({
                message: 'Khu vực không tồn tại.'
            });
        }

        // Kiểm tra vị trí đã tồn tại
        const existingLocation = await Location.findOne({
            zone: zoneId,
            rack: type === 'rack' ? rack : null,
            pallet: type === 'pallet' ? pallet : null,
            level: level
        });

        if (existingLocation) {
            return res.status(409).json({
                message: 'Vị trí đã tồn tại.'
            });
        }

        // Kiểm tra sự tồn tại của sản phẩm trong cùng một location
        const productInLocation = await Location.findOne({
            product: productId,
            zone: zoneId,
            rack: type === 'rack' ? rack : null,
            pallet: type === 'pallet' ? pallet : null,
            level:type === 'rack' ? level:null
        });

        if (productInLocation && quantity) {
            // Cập nhật quantity nếu sản phẩm đã tồn tại
            const totalQuantity = productInLocation.quantity + quantity;

            if (totalQuantity > productInLocation.capacity) {
                return res.status(400).json({
                    message: `Số lượng sản phẩm vượt quá sức chứa tối đa là ${productInLocation.capacity}.`
                });
            }

            productInLocation.quantity = totalQuantity;
            await productInLocation.save();

            return res.status(200).json({
                message: 'Cập nhật thành công sức chứa cho vị trí đã tồn tại',
                location: productInLocation
            });
        }

        // Kiểm tra xem vị trí có rack hoặc pallet khác không
        const conflictingLocation = await Location.findOne({
            type:'rack',
            zone: zoneId,
            // $or: [
            //     { rack: rack, type: 'pallet' },  // Kiểm tra xem có pallet ở cùng rack không
            //     { pallet: pallet, type: 'rack' },  // Kiểm tra xem có rack ở cùng pallet không
            //     { level: level, rack: rack, type: 'rack' }, // Kiểm tra cùng tầng có rack không
            //     { level: level, pallet: pallet, type: 'pallet' } // Kiểm tra cùng tầng có pallet không
            // ]
            rack: pallet,

        });

        if (conflictingLocation) {
            return res.status(409).json({
                message: 'Vị trí này đã có rack hoặc pallet khác.'
            });
        }
        const conflictingLocationRack = await Location.findOne({
            type:'pallet',
            zone: zoneId,
            // $or: [
            //     { rack: rack, type: 'pallet' },  // Kiểm tra xem có pallet ở cùng rack không
            //     { pallet: pallet, type: 'rack' },  // Kiểm tra xem có rack ở cùng pallet không
            //     { level: level, rack: rack, type: 'rack' }, // Kiểm tra cùng tầng có rack không
            //     { level: level, pallet: pallet, type: 'pallet' } // Kiểm tra cùng tầng có pallet không
            // ]
            pallet: rack,

        });

        if (conflictingLocationRack) {
            return res.status(409).json({
                message: 'Vị trí này đã có rack hoặc pallet khác.'
            });
        }

        // Tạo mới location nếu không có vị trí trùng lặp
        const newLocation = new Location({
            product: productId ? productId : null,
            zone: zoneId,
            type: type,
            rack: type === 'rack' ? rack : null,
            pallet: type === 'pallet' ? pallet : null,
            level: level,
            quantity: quantity,
            capacity: capacity,
        });

        // Lưu vào cơ sở dữ liệu
        await newLocation.save();

        // Phản hồi thành công
        return res.status(201).json({
            message: 'Vị trí đã được thêm thành công',
            location: newLocation
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Lỗi server',
            error: error.message
        });
    }
};

  
const getAll = async (req, res) => {
  try {
    const location = await Location.find();
    res.status(200).json({ data: location });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

const getZone = async (req, res) => {
  try {
    const zoneId = req.params.zoneId;
    const location = await Location.find({ zone: zoneId });
    res.status(200).json({ data: location });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};
const updateZone = async (req, res) => {
    try {
      const zoneId = req.params.zoneId;
      const updateData = req.body;
  
      // Kiểm tra xem zone có tồn tại không
      const zone = await Location.findById(zoneId);
      if (!zone) {
        return res.status(404).json({
          message: 'Khu vực không tồn tại.'
        });
      }
  
      // Cập nhật khu vực với dữ liệu mới
      const updatedZone = await Location.findByIdAndUpdate(zoneId, updateData, { new: true, runValidators: true });
  
      return res.status(200).json({
        message: 'Cập nhật khu vực thành công',
        zone: updatedZone
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Lỗi server',
        error: error.message
      });
    }
  };
  

module.exports = { createLocation, getAll, getZone,updateZone };
