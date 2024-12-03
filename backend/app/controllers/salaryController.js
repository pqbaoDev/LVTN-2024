const Salary = require('../models/SalarySchema');

// Tạo thông tin lương mới
const createSalary = async (req, res) => {
    const { employeeId, name, baseSalary, bonus, deductions, month, year } = req.body;

    try {
        const totalSalary = baseSalary + bonus - deductions;

        const newSalary = new Salary({
            employeeId,
            name,
            baseSalary,
            bonus,
            deductions,
            totalSalary,
            month,
            year
        });

        await newSalary.save();
        res.status(201).json({ success: true, message: 'Thông tin lương đã được tạo' });
    } catch (error) {
        console.error('Lỗi tạo thông tin lương:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi tạo thông tin lương' });
    }
};

// Lấy thông tin lương của nhân viên theo tháng và năm
const getSalary = async (req, res) => {
    const { employeeId, month, year } = req.params;

    try {
        const salary = await Salary.findOne({ employeeId, month, year });
        if (!salary) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin lương' });
        }

        res.status(200).json({ success: true, salary });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin lương:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin lương' });
    }
};

// Cập nhật thông tin lương
const updateSalary = async (req, res) => {
    const { salaryId } = req.params;
    const { baseSalary, bonus, deductions } = req.body;

    try {
        const salary = await Salary.findById(salaryId);

        if (!salary) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin lương' });
        }

        salary.baseSalary = baseSalary || salary.baseSalary;
        salary.bonus = bonus || salary.bonus;
        salary.deductions = deductions || salary.deductions;
        salary.totalSalary = salary.baseSalary + salary.bonus - salary.deductions;

        await salary.save();
        res.status(200).json({ success: true, message: 'Thông tin lương đã được cập nhật' });
    } catch (error) {
        console.error('Lỗi cập nhật thông tin lương:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật thông tin lương' });
    }
};

// Xóa thông tin lương
const deleteSalary = async (req, res) => {
    const { salaryId } = req.params;

    try {
        const salary = await Salary.findByIdAndDelete(salaryId);

        if (!salary) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin lương' });
        }

        res.status(200).json({ success: true, message: 'Thông tin lương đã được xóa' });
    } catch (error) {
        console.error('Lỗi xóa thông tin lương:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi xóa thông tin lương' });
    }
};

module.exports = { createSalary, getSalary, updateSalary, deleteSalary };
