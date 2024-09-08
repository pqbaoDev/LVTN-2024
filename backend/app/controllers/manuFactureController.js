const Manufacture = require('../models/ManufactureSchema');

// Hàm tạo một nhà sản xuất mới
const createManufacture = async (req, res) => {
    try {
        const { name, photo } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Tên là bắt buộc' });
        }
        const newManufacture = new Manufacture({
            name,
            photo,
        });
        const savedManufacture = await newManufacture.save();
        res.status(201).json({
            message: 'Nhà sản xuất đã được tạo thành công',
            data: savedManufacture,
        });

    } catch (error) {
        console.error('Lỗi khi tạo nhà sản xuất:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
};

module.exports = { createManufacture };
