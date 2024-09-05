const bcrypt = require('bcrypt');
const User = require('../models/UserSchema');
const Employee = require('../models/employeeSchema')
const jwt = require("jsonwebtoken")

const generateToken =  user =>{
    return jwt.sign(
        {id:user._id, role: user.role},
        process.env.JWT_SECRET_KEY,{ expiresIn:"15d",}
    );
};
const register = async (req, res) => {
    const { email, password, name, role, photo, gender,employeeId,address,phone } = req.body;

    try {
        let use = null;

        // Kiểm tra người dùng đã tồn tại trong cơ sở dữ liệu
        if (role === 'user') {
            use = await User.findOne({ email });
        }
        else if(role == 'employee'){
            use = await Employee.findOne({email});
        }

        // Nếu người dùng đã tồn tại, trả về lỗi
        if (use) {
            return res.status(400).json({ message: 'Email hoặc người dùng đã tồn tại' });
        }

        // Băm mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo người dùng mới
        if(role === 'user'){
            use = new User({
                name,
                email,
                password: hashedPassword, // Sử dụng mật khẩu đã băm
                photo,
                address,
                phone,
                gender,
                role
            });
        }
        if(role === 'employee'){
            use = new Employee({
                name,
                email,
                password: hashedPassword, // Sử dụng mật khẩu đã băm
                photo,
                gender,
                phone,
                employeeId:'1',
                role
            });
        }

        // Lưu người dùng vào cơ sở dữ liệu
        await use.save();
        res.status(201).json({ success: true, message: 'Đăng ký thành công' });

    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ, vui lòng thử lại' });
    }
};

const login = async(req,res)=>{
    const{email} = req.body;
    try {
        let user = null;

        const users = await User.findOne({email});
        const employee = await Employee.findOne({email});
        if(users){
            user= users;
        } 
        if(employee){
            user=employee;
        }
        if(!user) return res.status(404).json({ message:"Tài khoản không tồn tại"});

        const isPasswordMacth = await bcrypt.compare(req.body.password,user.password);
        if(!isPasswordMacth){
            return res.status(400).json({status:false,message:'Invalid credentails'});
        }

        const token = generateToken(user);

        const {password, role, appointments, ...rest} = user._doc;
        res.status(200).json({status:true,message:'Đăng nhập thành công', token,data:{...rest},role});
    } catch (error) {

         return res.status(500).json({status:false,message:'Đăng nhập thất bại'});
    }
}

module.exports = {register,login};
