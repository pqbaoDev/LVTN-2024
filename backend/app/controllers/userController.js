const User = require("../models/UserSchema")

const updateUser = async (req,res)=>{
    const id = req.params.id;

    try {
        const updateUser = await User.findByIdAndUpdate(
            id,{$set: req.body},{new:true}
        ).select('-password');
        res.status(200).json({success:true,message:"Successfully updated",data: updateUser});
    } catch (error) {
        res.status(500).json({success:false,message:"Failed updated"});
        
    }
};
const deleteUser = async (req,res)=>{
    const id = req.params.id;

    try {
        const deleteUser = await User.findByIdAndDelete(
            id,
        ).select('-password');
        res.status(200).json({success:true,message:"Xóa thành công",data: deleteUser});
    } catch (error) {
        res.status(500).json({success:false,message:"Xóa thất bại"});
        
    }
};
const getSingleUser = async (req,res)=>{
    const id = req.params.id;

    try {
        const user = await User.findById(
            id
        ).select('-password');
        res.status(200).json({success:true,message:"User found",data: user});
    } catch (error) {
        res.status(404).json({success:false,message:"No user found"});
        
    }
};
const getAllUser = async (req,res)=>{
    // const id = req.params.id;
    try {
        const {query} = req.query;
        let users;
        if(query){
            users = await User.find({
            $or:[
                { name: { $regex: query, $options: 'i' } },
                {phone:{ $regex: query, $options: 'i' }}
            ],
        }).select('-password');
        }else{
            users = await User.find().select('-password');

        }
        res.status(200).json({success:true,message:"Users found",data: users});
    } catch (error) {
        res.status(404).json({success:false,message:"Not found"});
        
    }
};

const getUserProfile = async(req, res)=>{
    const userId = req.userId;
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({success: false, message:"User not found"});
        };

        const {password, ... rest} =user._doc;

        res.status(200).json({success: true, message: "Profile info is getting", data:{...rest}})
    } catch (error) {
        res.status(500).json({success:false,message:"Something went wrong, cannot get"});
        
    }
};
const saveVoucher = async (req, res) => {
    const userId = req.params.userId; // Lấy userId từ params
    const { voucherId } = req.body;  // Lấy voucherId từ body

    if (!voucherId) {
        return res.status(400).json({
            success: false,
            message: "voucherId không được để trống",
        });
    }

    try {
        // Tìm người dùng theo userId, bỏ qua trường password
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Người dùng không tồn tại",
            });
        }

        // Kiểm tra nếu voucher đã tồn tại trong mảng vouchers của người dùng
        if (!user.vouchers.includes(voucherId)) {
            user.vouchers.push(voucherId);  // Thêm voucher vào mảng
        }

        const updatedUser = await user.save();  // Lưu người dùng với voucher đã thêm

        res.status(200).json({
            success: true,
            message: "Lưu voucher thành công",
            data: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi trong quá trình cập nhật",
            error: error.message,
        });
    }
};
const getVoucherOfUser = async(req,res)=>{
    const userId = req.params.userId;
    try {
        const vouchers = await User.findById(userId) ;
        res.status(200).json({
            success: true,
            message: "Lưu voucher thành công",
            data: vouchers.vouchers,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi trong quá trình cập nhật",
            error: error.message,
        });
        
    }
}


module.exports = {updateUser,deleteUser,getAllUser,getSingleUser,getUserProfile,saveVoucher,getVoucherOfUser}