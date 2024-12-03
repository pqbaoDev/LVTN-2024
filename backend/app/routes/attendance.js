const express = require('express');
const { checkIn, checkOut, getAttendance, updateAttendance, deleteAttendance } = require('../controllers/attendanceController');
const router = express.Router();

// Route chấm công vào
router.post('/check-in', checkIn);

// Route chấm công ra
router.post('/check-out', checkOut);

// Route lấy thông tin chấm công của nhân viên theo ngày
router.get('/:employeeId/:date', getAttendance);

// Route cập nhật thông tin chấm công
router.put('/:attendanceId', updateAttendance);

// Route xóa thông tin chấm công
router.delete('/:attendanceId', deleteAttendance);

module.exports = router;
