const Leave = require('../models/LeaveSchema');

// Tạo yêu cầu phép mới
const createLeaveRequest = async (req, res) => {
    const { employeeId, name, startDate, endDate, type, reason } = req.body;

    try {
        const newLeave = new Leave({
            employeeId,
            name,
            startDate,
            endDate,
            type,
            reason
        });

        await newLeave.save();
        res.status(201).json({ success: true, message: 'Yêu cầu phép đã được tạo' });
    } catch (error) {
        console.error('Lỗi tạo yêu cầu phép:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi tạo yêu cầu phép' });
    }
};

// Lấy danh sách yêu cầu phép của nhân viên
const getLeaves = async (req, res) => {
    const { employeeId } = req.params;

    try {
        const leaves = await Leave.find({ employeeId });
        res.status(200).json({ success: true, leaves });
    } catch (error) {
        console.error('Lỗi khi lấy yêu cầu phép:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy yêu cầu phép' });
    }
};

// Cập nhật trạng thái yêu cầu phép
const updateLeaveStatus = async (req, res) => {
    const { leaveId } = req.params;
    const { status } = req.body;

    try {
        const leave = await Leave.findById(leaveId);

        if (!leave) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu phép' });
        }

        leave.status = status; // Chấp nhận hoặc từ chối phép
        await leave.save();
        res.status(200).json({ success: true, message: `Đã ${status} yêu cầu phép` });
    } catch (error) {
        console.error('Lỗi cập nhật trạng thái phép:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái phép' });
    }
};

// Xóa yêu cầu phép
const deleteLeaveRequest = async (req, res) => {
    const { leaveId } = req.params;

    try {
        const leave = await Leave.findByIdAndDelete(leaveId);

        if (!leave) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu phép' });
        }

        res.status(200).json({ success: true, message: 'Đã xóa yêu cầu phép' });
    } catch (error) {
        console.error('Lỗi xóa yêu cầu phép:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi xóa yêu cầu phép' });
    }
};

module.exports = { createLeaveRequest, getLeaves, updateLeaveStatus, deleteLeaveRequest };
