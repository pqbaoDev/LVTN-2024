/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import SaveIcon from "../../../assets/images/saveIcon.png";
import CategoryIcon from "../../../assets/images/category2.png";
import { useState } from "react";
import { BASE_URL } from "../../../../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddZone = ({ showModal, setShowModal, zone }) => {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Hàm cập nhật giá trị form khi người dùng nhập liệu
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Hàm xử lý khi submit form
  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/zone`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const { message } = await response.json();
      if (!response.ok) {
        throw new Error(message);
      }
      toast.success(message);
      navigate('/warehouse');
    } catch (error) {
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Hàm dừng lan truyền sự kiện để tránh đóng modal khi click bên trong
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {showModal ? (
        <div>
          {/* Nền mờ bên ngoài, đóng modal khi click vào */}
          <div
            onClick={() => setShowModal(false)}
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-2/3 my-5 mx-auto max-w-3xl" onClick={stopPropagation}>

              {/* Nội dung modal */}
              <div className="border-0 p-5 bg-blue-500 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                {/* Header */}

                <div className="flex items-start justify-between border-b border-solid border-blueGray-200 rounded-t">
                  <div className="flex gap-2 items-center">
                    <img src={CategoryIcon} className="w-4 h-4" alt="Category Icon" />
                    <h3 className="text-[14px] font-normal">Danh sách khu vực</h3>
                  </div>
                  <button
                    className="p-2 ml-auto  border-0  rounded-b-none hover:bg-red-500 hover:text-white text-black  float-right text-lg leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal()}
                  >
                    <span className="mx-auto">x</span>
                  </button>


                </div>

                {/* Body */}
                <div className="relative  flex-auto">
                  <div className="border-b-2 px-2 py-1 bg-white">
                    <div className="items-center cursor-pointer" >
                      <div className="w-6" onClick={submitHandler}>
                        <img src={SaveIcon} className="w-6 h-6" alt="Save Icon" />
                        <p className="text-[12px] font-normal">Lưu</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-3 bg-blue-500">

                  </div>
                  <div className="bg-white h-[300px]">
                    <table className="border-slate-400 border-t-2">
                      <thead className="bg-blue-300">
                        <tr>
                          <th className="border-0 border-r-2 border-solid border-slate-400 p-1"></th>
                          <th className="border-0 border-r-2 border-solid border-slate-400 p-1">TÊN</th>
                          <th className="border-0 border-r-2 border-solid border-slate-400 p-1">KÍ HIỆU</th>
                          <th className="w-1/3 border-2 border-r-0 border-solid border-slate-400 p-1"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {zone?.map((item, index) => (
                          <tr key={index}>
                            <td className="w-4 bg-white hover:bg-blue-200 text-center items-center border-2 border-l-0 border-solid border-slate-400 p-1"></td>
                            <td className="bg-white hover:bg-blue-200 border-2 border-solid border-slate-400 uppercase p-1">{item.name}</td>
                            <td className="bg-white hover:bg-blue-200 w-1/6 border-2 border-solid border-slate-400 p-1">{item.symbol}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Form nhập liệu */}
                  <div className="border-2 border-solid border-slate-400 px-2">
                    <h1 className="text-[16px] font-bold text-black">Thông tin</h1>
                    <form onSubmit={submitHandler}>
                      <div className="grid grid-cols-8 w-3/4 items-center mx-auto">
                        <div className="flex gap-3 col-span-5">
                          <p className="form__label text-black">Tên</p>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập tên"

                            className="border-2 p-1 w-full border-slate-300 focus:outline-none"
                          />
                        </div>
                        <div className="flex col-span-3">
                          <p className="form__label text-black w-1/3">Ký hiệu</p>
                          <input
                            type="text"
                            name="symbol"
                            value={formData.symbol}
                            onChange={handleChange}
                            placeholder="Nhập ký hiệu"
                            className="border-2 w-2/3 p-1 border-slate-300 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="mx-auto mt-3 w-3/4">
                        <div className="flex items-center justify-center mb-5">
                          <p className="form__label text-black w-1/6">Mô tả</p>
                          <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Nhập mô tả"

                            className="border-2 p-1 w-full border-slate-300 focus:outline-none"
                          />
                        </div>
                      </div>
                      {/* <div className="flex justify-center">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                        >
                          {loading ? "Đang lưu..." : "Lưu"}
                        </button>
                      </div> */}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nền mờ */}
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : null}
    </>
  );
};

export default AddZone;
