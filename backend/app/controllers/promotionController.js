
const Promotion = require("../models/PromotionSchema");

const creatPromotion = async(req,res)=>{
    try {
        const { name, promotionId, sale, startDate, endDate,quantity } = req.body;
        
        const newPromotion = new Promotion({
            name,
            promotionId,
            sale,
            quantity,
            startDate,
            endDate
        });

        await newPromotion.save();
        res.status(201).json({ success: true, data: newPromotion });
    } catch (error) {
        console.error('Lỗi khi tạo khuyến mãi:', error);
        res.status(400).json({ success: false, error: error.message });
    }

}
const updatePromotion = async (req, res) => {
    try {
        const now = new Date();

        // Kiểm tra xem thời gian mới có hợp lệ không
        if (new Date(req.body.startDate) > new Date(req.body.endDate)) {
            return res.status(400).json({ success: false, message: 'Ngày bắt đầu phải trước ngày kết thúc' });
        }

        // Tìm và cập nhật khuyến mãi
        let updatedPromotion = await Promotion.findById(req.params.id);
        
        if (!updatedPromotion) {
            return res.status(404).json({ success: false, message: 'Khuyến mãi không tìm thấy' });
        }

        // Cập nhật giá trị từ request body
        Object.assign(updatedPromotion, req.body);

        // Cập nhật trạng thái khuyến mãi
        if (now < updatedPromotion.startDate) {
            updatedPromotion.status = 'upcoming';
        } else if (now >= updatedPromotion.startDate && now <= updatedPromotion.endDate) {
            updatedPromotion.status = 'active';
        } else {
            updatedPromotion.status = 'expired';
        }

        // Lưu lại bản ghi sau khi cập nhật
        await updatedPromotion.save();

        res.status(200).json({ success: true, message: 'Cập nhật thành công', data: updatedPromotion });
    } catch (error) {
        console.error('Lỗi khi cập nhật khuyến mãi:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};

const getPromotion = async(req,res)=>{
    try {
       const {query} = req.query;
       let promotions;
       if(query){
            promotions = await Promotion.find({
                $or:[
                    { name: { $regex: query, $options: 'i' } },
                    { promotionId: { $regex: query, $options: 'i' } },
                ]
            })
       }else{
        promotions = await Promotion.find();
       }
       
       res.status(200).json({success:true,data: promotions});

    } catch (error) {
        res.status(404).json({success:false,message:"Không tìm thấy"});
        
    }
}
const getOne = async(req,res)=>{
    try {
        const id = req.params.id;
        const promotion = await Promotion.findById(id);
        res.status(200).json({success:true,data:promotion});
    } catch (error) {
        res.status(404).json({success:false,message:"Không tìm thấy"});
        
    }
}
const getPromotionId = async (req, res) => {
    try {
        const { promotionId } = req.params;

        // Tìm khuyến mãi với promotionId và trạng thái 'active'
        const promotion = await Promotion.findOne({
            promotionId,
            status: 'active' // Lọc trạng thái 'active'
        });

        if (!promotion) {
            return res.status(404).json({ success: false, message: "Khuyến mãi không tìm thấy hoặc không còn hiệu lực" });
        }

        res.status(200).json({ success: true, data: promotion });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin khuyến mãi:', error); // Ghi lại lỗi để gỡ lỗi
        res.status(500).json({ success: false, message: "Có lỗi xảy ra, vui lòng thử lại" });
    }
};


const deletePromotion = async (req, res) => {
    try {
        const id = req.params.id;  
        const deletedPromotion = await Promotion.findByIdAndDelete(id);

        if (!deletedPromotion) {
            return res.status(404).json({ success: false, message: 'Khuyến mãi không tìm thấy' });
        }

        res.status(200).json({ success: true, message: 'Khuyến mãi đã được xóa' });
    } catch (error) {
        console.error('Lỗi khi xóa khuyến mãi:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = {creatPromotion,updatePromotion,deletePromotion,getPromotion,getOne,getPromotionId}