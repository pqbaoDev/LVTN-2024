const express = require('express');
const { createSalary, getSalary, updateSalary, deleteSalary } = require('../controllers/salaryController');
const router = express.Router();

// Route tạo thông tin lương mới
router.post('/create', createSalary);

// Route lấy thông tin lương của nhân viên theo tháng và năm
router.get('/:employeeId/:month/:year', getSalary);

// Route cập nhật thông tin lương
router.put('/:salaryId', updateSalary);

// Route xóa thông tin lương
router.delete('/:salaryId', deleteSalary);

module.exports = router;
