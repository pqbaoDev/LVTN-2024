/* eslint-disable react/prop-types */
import { FaPlusCircle } from "react-icons/fa";
import { useState } from "react";
import menuDotsIcon from "../../assets/images/menu-dots.png";
import Action from "../../components/Actions/Action";
import ProductAddDialog from "./productAddDialog";
import FormatPrice from "../../utils/formatPrice";

const ProductTable = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [openRowIndex, setOpenRowIndex] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleMenuClick = (index) => {
    setOpenRowIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  return (
    <>
      <div className="flex justify-between">
        <div className="ml-1 mb-3">
          <button
            onClick={handleOpenAdd}
            className="mx-4 btn focus:outline-none flex items-center border rounded-md py-2 px-2 gap-1"
            aria-label="Add User"
          >
            <FaPlusCircle />
            <span className="font-semibold text-[18px]">Thêm</span>
          </button>
        </div>
        <div className="flex justify-between items-center gap-8 mr-8 mt-5 pb-0">
          <select
            name="category"
            id=""
            className="text-textColor font-semibold text-[15px] leading-7 px-4 py-2 focus:outline-none border border-slate-500 rounded-lg"
          >
            <option value="">Danh mục</option>
            <option value="Điên thoại">Điện Thoại</option>
          </select>
          <select
            name="manuFacture"
            id=""
            className="text-textColor font-semibold text-[15px] leading-7 px-4 py-2 focus:outline-none border border-slate-500 rounded-lg"
          >
            <option value="">Hãng</option>
            <option value="Apple">Apple</option>
          </select>
        </div>
      </div>
      <div className="mx-5">
        <table className="w-full text-sm  text-center border-2 border-slate-300">
          <thead className="text-xs uppercase border-b-2 border-b-slate-300">
            <tr>
              <th></th>
              <th scope="col" className="px-3 py-3">
                Tên sản phẩm
              </th>
              <th scope="col" className="px-3 py-3">
                Số lượng
              </th>
              <th scope="col" className="px-3 py-3">
                Giá
              </th>
              <th scope="col" className="px-3 py-3">
                Danh mục
              </th>
              <th scope="col" className="px-3 py-3">
                Hãng
              </th>
              <th scope="col" className="px-3 py-3">
                Giảm giá
              </th>
              <th scope="col" className="px-3 py-3">
                Đánh giá
              </th>
              <th scope="col" className="text-center">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-50">
            {currentItems.map((item) => (
              <tr key={item._id} className="text-[16px] text-center relative">
                <td className="pl-2 py-4 p-0">
                  <img
                    src={item.photo}
                    className="w-9 h-9 border-gray-400 border rounded-full"
                    alt=""
                  />
                </td>
                <td className="pr-3 py-4">{item.name}</td>
                <td className="pr-3 py-4">{item.stock}</td>
                <td className="pr-3 py-4">{FormatPrice(item.price)}</td>
                <td className="pr-3 py-4">{item.category.name}</td>
                <td className="pr-3 py-4">{item.manuFacture.name}</td>
                <td className="pr-3 py-4">{item.discount}</td>
                <td className="pr-3 py-4">{item.rating}</td>
                <td className="relative">
                  {openRowIndex === item._id && (
                    <div className="absolute right-0 top-full mt-2 w-48 z-10 bg-white shadow-lg rounded-lg">
                      <Action id={item._id} type={"user"} />
                    </div>
                  )}
                  <img
                    src={menuDotsIcon}
                    className="w-4 h-4 mx-auto cursor-pointer"
                    alt="Menu"
                    onClick={() => handleMenuClick(item._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`mx-1 px-3 py-1 rounded-lg ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <ProductAddDialog
        open={openAdd}
        handleClose={handleCloseAdd}
        size="lg"
        position="center"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      />
    </>
  );
};

export default ProductTable;
