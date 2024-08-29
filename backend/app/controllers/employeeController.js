const Employee = require("../models/employeeSchema");

const updateEmployee = async(req,res)=>{
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,{$set:req.body},{new:true}
        )
        if(!employee){
            return res.status(404).json({success:false,error:'Nhân viên không tồn tại'});
        }
        res.status(200).json({success:true,message:'Cập nhật thành công',data:employee})
    } catch (error) {
        console.error("Cập nhật không thành công",error),
        res.status(500).json({error:error.message})
    }
}
const getSingleEMployee = async(req,res)=>{
    try {
        const employee = await Employee.findById(req.params.id);
        return res.status(200).json({success:true,message:'Tìm người thấy nhân viên',data:employee})
        
    } catch (error) {
        res.status(404).json({success:false,message:"Không tìm thấy nhân viên"});
        
    }
}
const getAllEMployee = async(req,res)=>{
    try {
        const{query}=req.query;
        let employee;
        if(query){
            employee = await Employee.find({
                $or:[
                    {name: {$regex: query, $options: 'i'}},
                ]
            })
        }else{
            employee = await Employee.find(req.params.id);
        }

        return res.status(200).json({success:true,message:'Tìm thấy nhân viên',data:employee})
        
    } catch (error) {
        res.status(404).json({success:false,message:"Không tìm thấy nhân viên"});
        
    }
}
const deleteEmployee = async(req,res)=>{
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        return res.status(200).json({success:true,message:'Xóa nhân viên thành công',data:employee})

    } catch (error) {
        res.status(404).json({success:false,message:"Xóa không thành công"});
        
    }
}
module.exports = {updateEmployee,getSingleEMployee,getAllEMployee,deleteEmployee}