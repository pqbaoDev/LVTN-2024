/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BASE_URL, token } from "../../../config";
import { authContext } from "../../context/AuthContext";

const ChangePassword = ({ user }) => {
    const { dispatch } = useContext(authContext);
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    const validatePassword = () => {
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Mật khẩu mới và mật khẩu xác nhận không khớp");
            return false;
        }
        if (formData.newPassword.length < 5) {
            toast.error("Mật khẩu mới phải có ít nhất 5 ký tự");
            return false;
        }
        return true;
    };

    // Xử lý gửi form
    const submitHandlerChange = async (e) => {
        e.preventDefault(); // Ngừng hành vi mặc định của form (reload trang)

        if (!validatePassword()) return; // Kiểm tra mật khẩu trước khi gửi yêu cầu

        setLoading(true); // Bắt đầu xử lý yêu cầu

        try {
            const response = await fetch(`${BASE_URL}/auth/changepassword`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: user._id,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword,
                }),
            });

            const { message } = await response.json();

            if (!response.ok) {
                throw new Error(message);
            }

            // Nếu đổi mật khẩu thành công, đăng xuất và chuyển hướng
            dispatch({ type: 'LOGOUT' });
            navigate('/login');
            toast.success(message);

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false); // Dừng trạng thái loading
        }
    };

    return (
        <div className="p-5 bg-white mt-5">
            {/* Header */}
            <div className="border-b border-gray-800 pb-5">
                <h2 className="text-[20px] font-normal">Đổi Mật Khẩu</h2>
                <p className="text-gray-500 text-[16px]">
                    Quản lý thông tin mật khẩu tài khoản
                </p>
            </div>

            {/* Form */}
            <form onSubmit={submitHandlerChange} className="mt-5 w-2/3 mx-auto">
                {/* Mật khẩu hiện tại */}
                <div className="mb-5 grid grid-cols-4 gap-4 mr-9">
                    <label className="text-right text-[16px] text-slate-600 col-span-1">
                        Mật khẩu hiện tại
                    </label>
                    <input
                        type="password"
                        name="currentPassword"
                        placeholder="Nhập mật khẩu hiện tại"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 text-[16px] col-span-3 border border-solid rounded focus:outline-none"
                        required
                    />
                </div>

                {/* Mật khẩu mới */}
                <div className="mb-5 grid grid-cols-4 gap-4 mr-9">
                    <label className="text-right text-[16px] text-slate-600 col-span-1">
                        Mật khẩu mới
                    </label>
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="Nhập mật khẩu mới"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 text-[16px] col-span-3 border border-solid rounded focus:outline-none"
                        required
                    />
                </div>

                {/* Xác nhận mật khẩu mới */}
                <div className="mb-5 grid grid-cols-4 gap-4 mr-9">
                    <label className="text-right text-[16px] text-slate-600 col-span-1">
                        Xác nhận mật khẩu
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu mới"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 text-[16px] col-span-3 border border-solid rounded focus:outline-none"
                        required
                    />
                </div>

                {/* Nút thay đổi */}
                <div className="text-center">
                    <button
                        type="submit"
                        className={`px-6 py-2 rounded text-white ${
                            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Đổi Mật Khẩu"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
