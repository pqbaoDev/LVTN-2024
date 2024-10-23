const StockInSModel = require("../models/StockInSchema");

const createStockIn = async (req, res) => {
    try {
        const { employeeId, productId, location, quantity } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!employeeId || !productId || !location || !quantity) {
            return res.status(400).json({
                message: 'Yêu cầu cung cấp đầy đủ các trường: employeeId, productId, location, quantity.'
            });
        }

        // Tạo mới đối tượng StockIn
        const newStockIn = new StockInSModel({
            employee: employeeId,
            product: productId,
            location: location,
        });

        // Lưu vào cơ sở dữ liệu
        const savedStockIn = await newStockIn.save();
        // Phản hồi thành công
        return res.status(201).json({
            message: 'Thêm mục nhập kho thành công',
            stockIn: savedStockIn
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Lỗi server',
            error: error.message
        });
    }
};
const getOne = async(req,res)=>{
    try {
        const id = req.params.id;
        const stockIn = await StockInSModel.findById(id);
        res.status(200).json({data:stockIn})
    } catch (error) {
        res.status(500).json({message:"Lỗi server getOne"})
    }
}
const getAll = async (req, res) => {
    try {
        const stockInList = await StockInSModel.find();
        return res.status(200).json({ data: stockInList });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server getAll", error: error.message });
    }
};
const getStockInByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Kiểm tra nếu thiếu startDate hoặc endDate
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Yêu cầu cung cấp cả startDate và endDate' });
        }

        // Chuyển đổi startDate và endDate sang kiểu Date
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Kiểm tra tính hợp lệ của ngày
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: 'Ngày không hợp lệ, vui lòng cung cấp định dạng hợp lệ (YYYY-MM-DD)' });
        }

        // Tìm các bản ghi trong khoảng thời gian
        const stockInList = await StockInSModel.find({
            createdAt: { $gte: start, $lte: end }
        });

        // Kiểm tra nếu không có kết quả
        if (stockInList.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy bản ghi nào trong khoảng thời gian này' });
        }

        return res.status(200).json({ data: stockInList });
    } catch (error) {
        console.error("Lỗi server: ", error);
        return res.status(500).json({error: error.message });
    }
};


module.exports = { createStockIn , getOne,getAll,getStockInByDateRange};
