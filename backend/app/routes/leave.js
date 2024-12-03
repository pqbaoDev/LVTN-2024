const express = require('express');
const { createLeaveRequest, getLeaves, updateLeaveStatus, deleteLeaveRequest } = require('../controllers/leaveController');
const router = express.Router();

// Route tạo yêu cầu phép mới
router.post('/create', createLeaveRequest);
router.get('/:employeeId', getLeaves);

// Route cập nhật trạng thái yêu cầu phép
router.put('/:leaveId', updateLeaveStatus);

// Route xóa yêu cầu phép
router.delete('/:leaveId', deleteLeaveRequest);

module.exports = router;
