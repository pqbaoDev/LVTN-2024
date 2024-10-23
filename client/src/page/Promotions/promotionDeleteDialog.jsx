/* eslint-disable react/prop-types */

import { BASE_URL, token } from "../../../config";
import { toast } from "react-toastify";
import Quenstion from "../../assets/images/quetion.jpg";

const PromotionDeleteDialog = ({ open, promotionIds, handleClose,stopPropagation  }) => {
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/promotion/${promotionIds}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ _id: promotionIds }),
      });
      const result = await res.json();
      handleClose();
      toast.success(result.message);
      if (!res.ok) {
        throw Error(result.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  

  return (
    <>
      {open ? (
        <div
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          onClick={() => handleClose()} // Đóng modal khi click ra ngoài
        >
          <div
            className="relative w-1/4 my-6 mx-auto max-w-3xl"
            onClick={stopPropagation} // Ngăn chặn đóng modal khi click vào chính modal
          >
            <div className="border-2 border-slate-500 rounded-lg shadow-2xl relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between  rounded-t">
                <p className="text-[16px] p-2">Thông báo</p>
                <button
                  className="p-2 ml-auto  border-0 rounded-r-lg rounded-b-none hover:bg-red-500 hover:text-white text-black  float-right text-lg leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => handleClose()}
                >
                  <span className="mx-auto">x</span>
                </button>
              </div>
              {/*body*/}
              <div className="relative p-3 flex">
                <img src={Quenstion} className="w-12 h-12" alt="" />
                <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                  Bạn có muốn xóa ?
                </p>
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end p-3 bg-gray-200 rounded-b-lg">
                <button
                  className="bg-gray-50 text-black active:bg-red-600 font-bold text-sm px-6 py-1 rounded w border-gray-200 border-2 hover:border-blue-300 hover:bg-blue-200 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={handleDelete}
                >
                  Yes
                </button>
                <button
                  className="bg-gray-50 text-black font-bold text-sm px-6 py-1 rounded border-gray-200 border-2 hover:border-blue-300 hover:bg-blue-200 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => handleClose()}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {open ? <div className="opacity-25 fixed inset-0 z-40 bg-black"></div> : null}
    </>
  );
};

export default PromotionDeleteDialog;
