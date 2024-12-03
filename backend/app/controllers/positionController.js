const PositionModel = require('../models/PositionSchema'); // Import model Position

// Create a new Position
const createPosition = async (req, res) => {
    try {
        const { name, baseSalary, allowances,discription } = req.body;

        // Kiểm tra xem chức vụ đã tồn tại chưa
        const existingPosition = await PositionModel.findOne({ name });
        if (existingPosition) {
            return res.status(400).json({ message: 'Chức vụ này đã tồn tại' });
        }

        // Tạo mới chức vụ
        const position = new PositionModel({
            name,
            baseSalary,
            allowances,
            discription
        });

        await position.save();
        res.status(201).json({ message: 'Chức vụ đã được tạo thành công', position });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi tạo chức vụ', error: error.message });
    }
};

// Get all Positions
const getAllPositions = async (req, res) => {
    try {
        const { query } = req.query; // Lấy tham số query từ URL
        let filter = { status: true }; // Chỉ lấy các vị trí có status = true

        if (query) {
            // Thêm điều kiện tìm kiếm theo tên nếu có query
            filter.name = { $regex: query, $options: 'i' }; // Không phân biệt chữ hoa/thường
        }

        const positions = await PositionModel.find(filter);

        res.status(200).json({ message: 'Danh sách chức vụ', data: positions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách chức vụ', error: error.message });
    }
};



// Get a single Position by ID
const getPositionById = async (req, res) => {
    try {
        const position = await PositionModel.findById(req.params.id);
        if (!position) {
            return res.status(404).json({ message: 'Chức vụ không tồn tại' });
        }
        res.status(200).json({ message: 'Chức vụ tìm thấy', data: position });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi tìm kiếm chức vụ', error: error.message });
    }
};

// Update a Position
const updatePosition = async (req, res) => {
    try {

        const position = await PositionModel.findByIdAndUpdate(
            req.params.id,req.body,{ new: true }
        );

        if (!position) {
            return res.status(404).json({ message: 'Chức vụ không tồn tại' });
        }

        res.status(200).json({ message: 'Chức vụ đã được cập nhật', data: position });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật chức vụ', error: error.message });
    }
};

// Delete a Position
const deletePosition = async (req, res) => {
    try {
        const position = await PositionModel.findByIdAndUpdate(req.params.id, {status: false},{new: true});

        if (!position) {
            return res.status(404).json({ message: 'Chức vụ không tồn tại' });
        }

        res.status(200).json({ message: 'Chức vụ đã được xóa thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa chức vụ', error: error.message });
    }
};

module.exports = {
    createPosition,
    getAllPositions,
    getPositionById,
    updatePosition,
    deletePosition
};
