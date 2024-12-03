/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import uploadImageToCloudinary from "../../utils/uploadCloudinary";
import { BASE_URL } from "../../../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HashLoader from "react-spinners/HashLoader";
import closeIcon from "../../assets/images/close.png";


import useFetchData from "../../Hook/userFecthData";

const EmployeeAddDialog = ({ open, handleClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [loading, setLoading] = useState(false);
  const {data:positions} = useFetchData(`${BASE_URL}/position`);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    photo: "",
    role: "employee",
    gender: "",
   
    position: "", // Thêm trường position
  });

  const navigate = useNavigate();

  

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileAvatar = async (event) => {
    const file = event.target.files[0];
    if (file) {
        const data = await uploadImageToCloudinary(file);
        setSelectedFile(data.url);
        setFormData({ ...formData, photo: data.url });
    }
};

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Kiểm tra tính hợp lệ
    const { name, email, password, phone, address, gender, position } =
      formData;
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !address ||
      !gender ||
      !position
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const { message } = await res.json();

      if (!res.ok) {
        throw new Error(message);
      }

      toast.success(message);
      handleClose();
      navigate("/employee");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      {open?(
        <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        onClick={handleClose}>
           <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-1/2 h-[670px] my-6 mx-auto max-w-3xl">
            <div className="border-2 border-slate-500 rounded-lg shadow-2xl relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <form onSubmit={submitHandler}>
                <div className="border-b border-gray-800 p-5">
                                <h2 className="text-[20px] font-normal">Thêm nhân viên</h2>
                            </div>
                  <div className="p-2">
                    <div className="max-w-[1170px] mx-auto">
                      <div className="rounded-l-lg lg:pl-16 py-10">
                        <div className=" border-2 w-1/2 border-dashed border-blue-600 p-2  mx-auto">
                        {formData.photo && (
                            <figure className="w-[90px]   flex items-center justify-center mx-auto">
                                <img src={formData.photo} alt="User Avatar" className=" w-full "  />
                            </figure>
                        )}
                        <div className="flex items-center justify-center">
                            <div className="w-[170px] mx-auto">
                            <input
                                type="file"
                                name="photo"
                                id="customfile"
                                accept=".jpg, .png"
                                onChange={handleFileAvatar}
                                className="  opacity-0 cursor-pointer"
                            />
                            <label
                                htmlFor="customfile"
                                className=" border px-3 py-2  ml-[40px]  overflow-hidden  text-headingColor  truncate cursor-pointer"
                            >
                                Chọn Avatar
                            </label>
                            <p className="text-justify ml-[px] text-[14px] text-slate-500 italic mt-3">Dụng lượng file tối đa 1 MB
                            Định dạng:.JPEG, .PNG</p>
                        </div>
                        </div>
                    </div>
                        <div className="mb-5">
                          <input
                            type="text"
                            name="name"
                            placeholder="Họ và tên"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full pr-4 py-3 text-[16px] bord focus:outline-none border-b border-solid border-[#0066ff61]"
                            required
                          />
                        </div>
                        <div className="mb-5">
                          <input
                            type="email"
                            name="email"
                            placeholder="Địa chỉ email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pr-4 py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none"
                            required
                          />
                        </div>
                        <div className="mb-5">
                          <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full pr-4 py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none"
                            required
                          />
                        </div>
                        <div className="mb-5">
                          <input
                            type="number"
                            name="phone"
                            placeholder="Số điện thoại"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pr-4 py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none"
                            required
                          />
                        </div>
                        <div className="mb-5">
                          <input
                            type="text"
                            name="address"
                            placeholder="Địa chỉ"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full pr-4 py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none"
                            required
                          />
                        </div>
                        <div className="mb-5">
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full pr-4 py-3 text-[16px] border-b border-solid border-[#0066ff61] focus:outline-none"
                            required
                          >
                            <option value="">Chọn giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <select
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                            className="form__input"
                            required
                          >
                            <option value="">Chọn chức vụ</option>
                            {positions.map((position) => (
                              <option key={position._id} value={position._id}>
                                {position.name}
                              </option>
                            ))}
                          </select>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end items-start gap-3 mb-5 mr-2">
                 < button
                      
                      onClick={handleClose}
                      className={`w-1/4 text-red-600 border  text-[18px] leading-[30px] rounded-lg px-4 py-3 ${
                        loading
                          ? "border-gray-400 cursor-not-allowed"
                          : "border-red-600"
                      }`}
                    >
                      {loading ? <HashLoader size={20} color="#ffffff" /> : "Đóng"}
                    </button>
                  

                    <button
                      disabled={loading}
                      type="submit"
                      className={`w-1/4 text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-primaryColor"
                      }`}
                    >
                      {loading ? <HashLoader size={20} color="#ffffff" /> : "Đăng ký"}
                    </button>
                  </div>
                </form>
            </div>
          </div>
      </div>):null}
    </>
  );
};

export default EmployeeAddDialog;
