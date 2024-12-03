const Location = require("../models/LocationSchema");
const ProductModel = require("../models/ProductSchema");
const StockInSModel = require("../models/StockInSchema");
const ZoneModel = require("../models/zoneSchema");
const ProductTempSchema = require("../models/ProductTempSchema.js")
const moment = require('moment');


const createStockIn = async (req, res) => {
    try {
        const { 
            tags,
            rating,
            rack,
            pallet,
            level,
            type,
            note,
            status = 'Chưa hoàn tất',
            employeeId,
            products // Mảng sản phẩm từ client
        } = req.body;


        // Kiểm tra location
        const location = await Location.findOne({
            type,
            rack: type === 'rack' ? rack : null,
            pallet: type === 'pallet' ? pallet : null,
            level: type === 'rack' ? level : null,
        });

        if (!location) {
            return res.status(409).json({ message: 'Vị trí không tồn tại' });
        }

        let stockInProduct = [];
        let newProducts = []; // Để lưu sản phẩm mới tạo nếu cần xóa sau này
       

        for (const item of products) {
            let {quantity,_id}=item
            const productTemp = await ProductTempSchema.findById(_id)
            const { name, manuFacture, category, photo, color, size, discount, price } = productTemp;
            if(productTemp.stock < quantity){
                return res.status(400).json({success:false,message:'Số lượng sản phẩm không đủ'})
            }
           productTemp.stock -= quantity;
           await productTemp.save();
          
          

            // Kiểm tra sản phẩm đã tồn tại chưa
            let product = await ProductModel.findOne({ name:name,size:size,"color.hex": color.hex, });

            if (product) {
                if (typeof quantity !== 'number') {
                    quantity = Number(quantity); 
                }
                product.stock += quantity; 
                product.locations.push(location._id); // Thêm vị trí vào mảng locations của sản phẩm
                await product.save();
            } else {
                // Tạo sản phẩm mới và thêm vào mảng locations
                product = new ProductModel({
                    name,
                    manuFacture,
                    category,
                    photo,
                    color: {
                        hex: color.hex,
                        name: color.name,
                    },
                    size,
                    discount,
                    price,
                    stock: quantity,
                    tags,
                    rating,
                    locations: [location._id], // Thêm vị trí vào mảng locations
                });
                await product.save();
                newProducts.push(product); // Thêm vào danh sách mới tạo
            }

            stockInProduct.push({ product: product._id, quantity });
            const existingProductInLocation = location.products.find(p => p.product );
            console.log(existingProductInLocation)
            if (existingProductInLocation) {
                // Nếu sản phẩm đã tồn tại trong location, cập nhật số lượng
                existingProductInLocation.quantity += quantity;
                // return res.status(400).json({success:false,message:'true'})
 
            } else {
                // Nếu sản phẩm chưa tồn tại trong location, thêm mới vào mảng products của location
               
                location.products.push({ product: product._id, quantity });
                // return res.status(400).json({success:false,message:'false'})
 
            }

            
        }

        // Tạo mã stockIn cho ngày hiện tại
        const today = moment().format('DDMMYY');
        const stockInCount = await StockInSModel.countDocuments({
            createdAt: { $gte: moment().startOf('day'), $lt: moment().endOf('day') }
        });
        const stockInId = `N${(stockInCount + 1).toString().padStart(3, '0')}/${today}`;

        // Tạo mới StockIn
        const newStockIn = new StockInSModel({
            _id: stockInId,
            products: stockInProduct,
            location: location._id,
            employee: employeeId,
            note,
            status,
        });

        const savedStockIn = await newStockIn.save();
        if (!savedStockIn) {
            // Xóa các sản phẩm mới tạo nếu lưu stockIn thất bại
            for (const product of newProducts) {
                await ProductModel.findByIdAndDelete(product._id);
            }
            return res.status(409).json({ success: false, message: 'Nhập sản phẩm thất bại' });
        }

        // Cập nhật location sau khi lưu stockIn thành công
        await location.save();

        return res.status(201).json({ success: true, message: 'Nhập sản phẩm thành công', data: savedStockIn });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Lỗi máy chủ khi tạo đơn hàng',
            error: error.message || 'Có lỗi xảy ra'
        });
    }
};


const getOne = async(req,res)=>{
    try {
        const {id} = req.params;
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
const getByIdLocation = async (req, res) => {
    try {
        const location = req.params.id
        const stockInList = await StockInSModel.find({location});
        return res.status(200).json({ data: stockInList });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server getAll", error: error.message });
    }
};
const getStockInByDateRange = async (req, res) => {
    try {
        const id = req.params.id; // Lấy locationId từ params của URL
        
        const { startDate, endDate, zone, query } = req.query; // Lấy các điều kiện từ query parameters

        let queryObject = {};

        // Điều kiện locationId
        if (id) {
            queryObject.location = id;
        }

        // Điều kiện thời gian (startDate và endDate)
        if (startDate || endDate) {
            const start = startDate ? new Date(startDate) : new Date('1970-01-01');
            const end = endDate ? new Date(endDate) : new Date();

            if (start > end) {
                return res.status(400).json({ message: "Thời gian không phù hợp." });
            }

            queryObject.createdAt = { $gte: start, $lte: end };
        }

        // Điều kiện zone
        if (zone) {
            const zones = await ZoneModel.find({
                name: { $regex: zone, $options: 'i' }
            });

            if (zones.length > 0) {
                const zoneIds = zones.map(z => z._id);
                const locations = await Location.find({ zone: { $in: zoneIds } });
                const locationIds = locations.map(location => location._id);

                if (locationIds.length > 0) {
                    queryObject.location = { $in: locationIds };
                } else {
                    return res.status(404).json({ message: "Không tìm thấy khu vực nào phù hợp." });
                }
            } else {
                return res.status(404).json({ message: "Không tìm thấy khu vực nào phù hợp." });
            }
        }

        // Điều kiện query (tìm kiếm theo từ khóa)
        if (query) {
            queryObject._id = { $regex: query, $options: 'i' };
        }

        // Truy vấn các phiếu nhập theo queryObject
        const stockIns = await StockInSModel.find(queryObject);

        // Kiểm tra kết quả
        if (stockIns.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy phiếu nhập nào phù hợp." });
        }

        // Trả về danh sách phiếu nhập
        res.status(200).json({ success: true, data: stockIns });

    } catch (error) {
        console.error("Lỗi server: ", error);
        return res.status(500).json({ error: error.message });
    }
};



module.exports = { createStockIn , getOne,getAll,getStockInByDateRange,getByIdLocation};
