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

module.exports = {updateUser,deleteUser,getAllUser,getSingleUser,getUserProfile}