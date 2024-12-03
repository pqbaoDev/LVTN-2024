const Attendance = require('../models/AttendanceSchema');

// Chấm công vào (Check-in)
const checkIn = async (req, res) => {
    const { employeeId, name, date } = req.body;

    try {
        const existingAttendance = await Attendance.findOne({ employeeId, date });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Nhân viên đã chấm công vào cho ngày này' });
        }

        const newAttendance = new Attendance({
            employeeId,
            name,
            checkIn: new Date(),
            date,
            status: 'present' // Mặc định là có mặt
        });

        await newAttendance.save();
        res.status(201).json({ success: true, message: 'Chấm công vào thành công' });
    } catch (error) {
        console.error('Lỗi khi chấm công vào:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi chấm công vào' });
    }
};

// Chấm công ra (Check-out)
const checkOut = async (req, res) => {
    const { employeeId, date } = req.body;

    try {
        const attendance = await Attendance.findOne({ employeeId, date });

        if (!attendance) {
            return res.status(404).json({ message: 'Nhân viên chưa chấm công vào ngày này' });
        }

        if (attendance.checkOut) {
            return res.status(400).json({ message: 'Nhân viên đã chấm công ra rồi' });
        }

        attendance.checkOut = new Date();
        attendance.status = 'present'; // Đổi trạng thái thành có mặt nếu chưa có
        await attendance.save();

        res.status(200).json({ success: true, message: 'Chấm công ra thành công' });
    } catch (error) {
        console.error('Lỗi khi chấm công ra:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi chấm công ra' });
    }
};

// Lấy thông tin chấm công của nhân viên theo ngày
const getAttendance = async (req, res) => {
    const { employeeId, date } = req.params;

    try {
        const attendance = await Attendance.findOne({ employeeId, date });

        if (!attendance) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin chấm công' });
        }

        res.status(200).json({ success: true, attendance });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin chấm công:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin chấm công' });
    }
};

// Cập nhật thông tin chấm công (chỉ dành cho trường hợp thay đổi trạng thái hoặc thời gian vào/ra)
const updateAttendance = async (req, res) => {
    const { attendanceId } = req.params;
    const { checkIn, checkOut, status } = req.body;

    try {
        const attendance = await Attendance.findById(attendanceId);

        if (!attendance) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin chấm công' });
        }

        if (checkIn) attendance.checkIn = checkIn;
        if (checkOut) attendance.checkOut = checkOut;
        if (status) attendance.status = status;

        await attendance.save();
        res.status(200).json({ success: true, message: 'Thông tin chấm công đã được cập nhật' });
    } catch (error) {
        console.error('Lỗi cập nhật thông tin chấm công:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật thông tin chấm công' });
    }
};

// Xóa thông tin chấm công
const deleteAttendance = async (req, res) => {
    const { attendanceId } = req.params;

    try {
        const attendance = await Attendance.findByIdAndDelete(attendanceId);

        if (!attendance) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin chấm công' });
        }

        res.status(200).json({ success: true, message: 'Thông tin chấm công đã được xóa' });
    } catch (error) {
        console.error('Lỗi xóa thông tin chấm công:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi xóa thông tin chấm công' });
    }
};

module.exports = { checkIn, checkOut, getAttendance, updateAttendance, deleteAttendance };
