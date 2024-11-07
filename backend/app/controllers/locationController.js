const Location = require('../models/LocationSchema');
const Product = require('../models/ProductSchema');
const Zone = require('../models/zoneSchema');

const createLocation = async (req, res) => {
    try {
        const { products, zoneId, type, rack, pallet, level,capacity } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!zoneId) {
            return res.status(400).json({ message: 'Yêu cầu cung cấp đầy đủ các trường: zoneId.' });
        }

        if (type === 'rack' && !level) {
            return res.status(400).json({ message: 'Vị trí tầng không được để trống khi loại là "rack".' });
        }

        if (type !== 'rack' && type !== 'pallet') {
            return res.status(400).json({ message: 'Loại vị trí (type) chỉ có thể là "rack" hoặc "pallet".' });
        }

        if (type === 'rack' && !rack) {
            return res.status(400).json({ message: 'Khi loại là "rack", trường "rack" là bắt buộc.' });
        }

        if (type === 'pallet' && !pallet) {
            return res.status(400).json({ message: 'Khi loại là "pallet", trường "pallet" là bắt buộc.' });
        }

        if (level && level <= 0) {
            return res.status(400).json({ message: 'Tầng (level) phải là số dương lớn hơn 0.' });
        }

        const zone = await Zone.findById(zoneId);
        if (!zone) {
            return res.status(404).json({ message: 'Khu vực không tồn tại.' });
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
         // Kiểm tra xem vị trí có rack hoặc pallet khác không
         const conflictingLocation = await Location.findOne({
            type:'rack',
            zone: zoneId,
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
            pallet: rack,

        });

        if (conflictingLocationRack) {
            return res.status(409).json({
                message: 'Vị trí này đã có rack hoặc pallet khác.'
            });
        }

        const locationProduct = [];
        let totalQuantity = 0;

        if(products){
        for (const item of products) {
            const { productId, quantity } = item;
            const product = await Product.findById(productId);

            if (product && !quantity) {
                return res.status(400).json({ message: 'Số lượng sản phẩm không được để trống.' });
            }

            totalQuantity += quantity; // Tính tổng số lượng các sản phẩm

            // Kiểm tra tổng số lượng với sức chứa
            if (totalQuantity > capacity) {
                return res.status(400).json({ message: `Tổng số lượng sản phẩm vượt quá sức chứa tối đa là ${capacity}.` });
            }


            locationProduct.push({ product: productId, quantity });
        }}

        // Tạo mới location nếu không có vị trí trùng lặp
        const newLocation = new Location({
            products: locationProduct,
            zone: zoneId,
            type: type,
            rack: type === 'rack' ? rack : null,
            pallet: type === 'pallet' ? pallet : null,
            level: level,
            capacity:capacity,
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
const getOne = async(req,res)=>{
    try {
        const id = req.params.id;
        const location = await Location.findById(id);
        if(!location){
            return res.status(404).json({ message: 'Vị trí không tồn tại.' });

        }
        return res.status(200).json({ data: location });

    } catch (error) {
       return res.status(500).json({ message: 'Lỗi máy chủ' });
        
    }
}
const updateZone = async (req, res) => {
    try {
        const id = req.params.id;
        const location = await Location.findById(id);
        
        const { capacity, products } = req.body;

        // Nếu có capacity trong body, cập nhật capacity của Location
        if (capacity) {
            location.capacity = capacity;
        }

        // Kiểm tra và cập nhật products nếu có
        if (Array.isArray(products) && products.length > 0) {
            let totalQuantity = location.products.reduce((sum, p) => sum + p.quantity, 0);

            for (const item of products) {
                const { productId, quantity } = item;
                const existingProduct = location.products.find(p =>p.product._id.toString() === productId.toString());
                if (existingProduct) {
                    // Nếu sản phẩm đã tồn tại, cập nhật số lượng
                    const newQuantity = existingProduct.quantity + quantity;
                    totalQuantity = totalQuantity - existingProduct.quantity + newQuantity; 

                    // Kiểm tra nếu tổng số lượng vượt quá capacity của Location
                    if (totalQuantity > location.capacity) {
                        return res.status(400).json({
                            message: `Tổng số lượng sản phẩm vượt quá sức chứa tối đa là ${location.capacity}.`
                        });
                    }
                    existingProduct.quantity = newQuantity; // Cập nhật số lượng sản phẩm
                } else {
                    // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào mảng products
                    totalQuantity += quantity; 

                    // Kiểm tra nếu tổng số lượng vượt quá capacity của Location
                    if (totalQuantity > location.capacity) {
                        return res.status(400).json({
                            message: `Tổng số lượng sản phẩm vượt quá sức chứa tối đa là ${location.capacity}.`
                        });
                    }

                    // Thêm sản phẩm mới vào location
                    location.products.push({ product:productId, quantity });
                }
            }
        }

        // Lưu location sau khi đã cập nhật xong
        const updatedLocation = await location.save();

        return res.status(200).json({
            message: 'Cập nhật khu vực thành công',
            data: updatedLocation
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Lỗi server',
            error: error.message
        });
    }
};



  

module.exports = { createLocation, getAll, getZone,updateZone,getOne };
