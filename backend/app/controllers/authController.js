const bcrypt = require('bcrypt');
const User = require('../models/UserSchema');
const Employee = require('../models/employeeSchema');
const jwt = require('jsonwebtoken');
const PositionModel = require('../models/PositionSchema');

// Hàm tạo token JWT
const generateToken = user => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '15d' }
    );
};
const generateRandomEmployeeId = () => {
    // Tạo một số ngẫu nhiên từ 10000 đến 99999
    const randomId = Math.floor(10000 + Math.random() * 90000);
    return `2002-${randomId}`;
};





const register = async (req, res) => {
    const { email, password, name, role, photo, gender, address, phone, position } = req.body;
    
    try {
        const positions = await PositionModel.findById(position);
        let existingUser = null;

        // Kiểm tra người dùng đã tồn tại
        if (role === 'user') {
            existingUser = await User.findOne({ email });
        } else if (role === 'employee') {
            existingUser = await Employee.findOne({ email });
        }

        // Nếu người dùng đã tồn tại, trả về lỗi
        if (existingUser) {
            return res.status(400).json({ message: 'Email hoặc người dùng đã tồn tại' });
        }

        // Băm mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser;
        let userRole = role; // Mặc định theo giá trị role từ request

        // Kiểm tra và gán role theo position
        if (role === 'employee' && position) {
            if (positions.name === 'Quản lý') {
                userRole = 'employee00';
            } else if (positions.name === 'Nhân viên kho') {
                userRole = 'employee01';
            }
        }

        // Tạo người dùng mới
        if (role === 'user') {
            newUser = new User({
                name,
                email,
                password: hashedPassword, // Sử dụng mật khẩu đã băm
                photo,
                address,
                phone,
                gender,
                role: userRole
            });
        } else if (role === 'employee') {
            const employeeId = generateRandomEmployeeId();
            newUser = new Employee({
                name,
                email,
                password: hashedPassword, // Sử dụng mật khẩu đã băm
                photo,
                gender,
                address,
                phone,
                employeeId,
                role: userRole,
                position
            });
        }

        // Lưu người dùng vào cơ sở dữ liệu
        await newUser.save();
        res.status(201).json({ success: true, message: 'Đăng ký thành công' });

    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ, vui lòng thử lại' });
    }
};


const login = async (req, res) => {
    const { email } = req.body;

    try {
        let user = null;
        const userInDb = await User.findOne({ email });
        const employeeInDb = await Employee.findOne({ email });
        
        if (userInDb) {
            user = userInDb;
        } else if (employeeInDb) {
            user = employeeInDb;
        }

        // Nếu không tìm thấy người dùng, trả về lỗi
        if (!user) {
            return res.status(404).json({ message: "Tài khoản không tồn tại" });
        }

        // Kiểm tra mật khẩu
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ status: false, message: 'Mật khẩu không đúng' });
        }

        // Cập nhật lastActiveAt và trạng thái online
        user.lastActiveAt = new Date();
        user.status = "on";
        await user.save();

        // Tạo token
        const token = generateToken(user);

        // Trả về thông tin người dùng
        const { password, role, ...rest } = user._doc;
        res.status(200).json({ status: true, message: 'Đăng nhập thành công', token, data: { ...rest }, role });
    } catch (error) {
        console.error('Lỗi đăng nhập phía server:', error);
        res.status(500).json({ status: false, message: 'Đăng nhập thất bại' });
    }
};
const logout = async (req, res) => {
    try {
        const { userId } = req.body;
        // Cập nhật status thành "off" cho người dùng khi đăng xuất
        await User.findByIdAndUpdate(userId, { status: "off",lastActiveAt: new Date() });

        res.status(200).json({ message: "Đăng xuất thành công" });
    } catch (error) {
        console.error('Lỗi đăng xuất:', error);
        res.status(500).json({ message: "Đăng xuất thất bại" });
    }
};
const changePassword = async (req, res) => {
    const { userId, currentPassword, newPassword, confirmPassword } = req.body;
    console.log(req.body)

    try {
        // Kiểm tra mật khẩu mới và mật khẩu xác nhận có khớp không
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Mật khẩu mới và xác nhận mật khẩu không khớp' });
        }

        // Tìm người dùng trong cơ sở dữ liệu
        let user = await User.findById(userId);
        if (!user) {
            user = await Employee.findById(userId);  // Tìm người dùng là nhân viên
        }

        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }
        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
        }

        // Băm mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu mới
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        console.error('Lỗi khi thay đổi mật khẩu:', error);
        res.status(500).json({ message: 'Lỗi máy chủ, vui lòng thử lại' });
    }
};




module.exports = { register, login,logout,changePassword };
