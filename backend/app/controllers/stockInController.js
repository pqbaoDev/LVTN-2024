const Location = require("../models/LocationSchema");
const StockInSModel = require("../models/StockInSchema");
const ZoneModel = require("../models/zoneSchema");

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
        const {id} = req.params;
        console.log(id)
        const stockIn = await StockInSModel.findOne({location:id});
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
        const { startDate, endDate, zone, query } = req.query;
        let createList = [];
        let locationIds = [];

        // Nếu không có bất kỳ điều kiện nào, trả về tất cả
        if (!startDate && !endDate && !zone && !query) {
            const StockIns = await StockInSModel.find();
            return res.status(200).json({ success: true, data: StockIns });
        }

        // Tạo đối tượng query
        let queryObject = {};

        // Kiểm tra nếu có startDate hoặc endDate
        if (startDate || endDate) {
            const start = startDate ? new Date(startDate) : new Date('1970-01-01');
            const end = endDate ? new Date(endDate) : new Date();

            if (start > end) {
                return res.status(400).json({ message: "Thời gian không phù hợp." });
            }

            // Tìm StockIn theo khoảng thời gian
            const stockInWithTime = await StockInSModel.find({
                createdAt: { $gte: start, $lte: end },
            });
            console.log('Stock In with Time:', stockInWithTime);

            // Nếu có zone, lọc theo zone
            if (zone) {
                const zones = await ZoneModel.find({
                    name: { $regex: zone, $options: 'i' }
                });

                if (zones.length === 0) {
                    return res.status(404).json({ message: "Không tìm thấy khu vực nào phù hợp." });
                }

                const zoneIds = zones.map(zone => zone._id);

                // Tìm Location theo zone
                const locations = await Location.find({ zone: { $in: zoneIds } });

                if (locations.length === 0) {
                    return res.status(404).json({ message: "Không tìm thấy vị trí nào phù hợp." });
                }

                const locationIds = locations.map(location => location._id);

                // Lọc StockIn theo Location
                const stockInListLocation = stockInWithTime.filter(stockIn =>
                    locationIds.some(id => id.equals(stockIn.location._id))
                );
                

                createList = stockInListLocation.map(stockIn => stockIn._id);
                console.log("stockInWithTime:", stockInListLocation);

            } else {
                createList = stockInWithTime.map(stockIn => stockIn._id);
            }
        }

        // Nếu chỉ có zone mà không có ngày
        if (zone && !startDate && !endDate) {
            const zones = await ZoneModel.find({
                name: { $regex: zone, $options: 'i' }
            });

            if (zones.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy khu vực nào phù hợp." });
            }

            const zoneIds = zones.map(zone => zone._id);
            const locations = await Location.find({ zone: { $in: zoneIds } });

            locationIds = locations.map(location => location._id);
        }

        // Nếu có keyword (query)
        if (query) {
            queryObject._id = { $regex: query, $options: 'i' };
        }

        // Nếu có createList (danh sách stockIn sau khi lọc theo thời gian và location)
        if (createList.length > 0) {
            queryObject._id = { $in: createList };
        }

        // Nếu có locationIds (danh sách location sau khi lọc theo zone)
        if (locationIds.length > 0) {
            queryObject.location = { $in: locationIds };
        }

        // Nếu không có điều kiện nào thỏa mãn
        if (Object.keys(queryObject).length === 0) {
            return res.status(404).json({ message: "Không tìm thấy phiếu nhập nào phù hợp." });
        }

        // Tìm các StockIn theo queryObject
        const StockIns = await StockInSModel.find(queryObject);

        res.status(200).json({ success: true, data: StockIns });

    } catch (error) {
        console.error("Lỗi server: ", error);
        return res.status(500).json({ error: error.message });
    }
};



module.exports = { createStockIn , getOne,getAll,getStockInByDateRange};
