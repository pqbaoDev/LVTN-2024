const Warranty = require("../models/warrantySchema");
const Order = require("../models/OrderSchema");
const UserModel = require("../models/UserSchema");

const createWarranty = async (req, res) => {
    try {
        const { warrantyPeriod, nameCustomer, phoneCustomer,product,type, address, startDate, endDate } = req.body;

        // Validate required fields
        if (!warrantyPeriod || !nameCustomer || !phoneCustomer || !startDate || !endDate) {
            return res.status(400).json({ success: false, error: 'All fields are required!' });
        }

        // Validate that endDate is after startDate
        if (new Date(endDate) <= new Date(startDate)) {
            return res.status(400).json({ success: false, error: 'End date must be after start date!' });
        }

        // Create a new warranty instance
        const newWarranty = new Warranty({
            nameCustomer,
            phoneCustomer,
            address,
            product,
            type,
            warrantyPeriod,
            startDate,
            endDate
        });

        // Save the warranty to the database
        await newWarranty.save();
        res.status(201).json({ success: true, data: newWarranty });
    } catch (error) {
        // Handle errors, differentiate validation errors from other errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, error: error.message });
        }
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


const getWarranties = async (req, res) => {
    try {
        const { query } = req.query;
        let warranties;

        if (query) {
            // Tìm kiếm đơn hàng theo query
             warranties = await Warranty.find({
                $or: [
                    { nameCustomer: { $regex: query, $options: 'i' } },
                    { phoneCustomer: { $regex: query, $options: 'i' } }
                ]
            })


           
        } else {
            // Nếu không có query, lấy tất cả bảo hành
            warranties = await Warranty.find()
        }

        res.status(200).json({ success: true, data: warranties });
    } catch (error) {
        console.error('Lỗi khi lấy bảo hành:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};
const getOne = async(req,res)=>{
    try {
        const id = req.params.id;
        const warranties = await Warranty.findById(id);
        res.status(200).json({success:true,data:warranties});
    } catch (error) {
        res.status(404).json({success:false,message:"Không tìm thấy"});
        
    }
}
const deleteWarranty = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedWarranty = await Warranty.findByIdAndDelete(id);

        if (!deletedWarranty) {
            return res.status(404).json({ success: false, message: 'Bảo hành không tìm thấy' });
        }

        res.status(200).json({ success: true, message: 'Bảo hành đã được xóa' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
const updateWarranty = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;

        const updatedWarranty = await Warranty.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedWarranty) {
            return res.status(404).json({ success: false, message: 'Bảo hành không tìm thấy' });
        }

        res.status(200).json({ success: true, data: updatedWarranty });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};


module.exports = { createWarranty, getWarranties,getOne,deleteWarranty,updateWarranty }
