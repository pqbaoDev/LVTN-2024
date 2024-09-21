/* eslint-disable react/prop-types */
import { useState } from "react";
import menuDotsIcon from "../../assets/images/menu-dots.png";
import Action from "../../components/Actions/Action";
import FormatPrice from "../../utils/formatPrice";
import { BiSort } from "react-icons/bi";

const ProductTable = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [openRowIndex, setOpenRowIndex] = useState(null);
  const [sortOrder, setSortOrder] = useState('name'); // 'name' hoặc 'price'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' hoặc 'desc'

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Sắp xếp sản phẩm
  const sortedProducts = [...products].sort((a, b) => {
    let comparison = 0;
    
    if (sortOrder === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortOrder === 'price') {
      comparison = a.price - b.price;
    } else if(sortOrder === 'stock') {
      comparison = a.stock - b.stock;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleMenuClick = (index) => {
    setOpenRowIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleSortChange = (newSortOrder) => {
    if (sortOrder === newSortOrder) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOrder(newSortOrder);
      setSortDirection('asc'); // Reset hướng sắp xếp khi thay đổi cột
    }
  };

  return (
    <>
      <div className="mx-5">
        <table className="w-full text-sm text-center border-2 border-slate-300">
          <thead className="text-xs uppercase border-b-2 border-b-slate-300">
            <tr>
              <th></th>
              <th scope="col" className="px-3 py-3 flex gap-x-4">
                <p>Tên sản phẩm</p>
                <div
                  onClick={() => handleSortChange('name')}
                  className="cursor-pointer text-center text-[18px]"
                >
                  {sortOrder === 'name' ? (sortDirection === 'asc' ? <BiSort /> : <div className="text-primaryColor">
                    <BiSort />
                  </div>  ) : <BiSort />}
                </div>
              </th>
              <th scope="col" className="px-1 py-3">
                <div className="flex gap-x-4">

              <p>Số lượng</p>
                <div
                  onClick={() => handleSortChange('stock')}
                  className="cursor-pointer text-[18px] text-center"
                >
                  {sortOrder === 'stock' ? (sortDirection === 'asc' ? <BiSort /> : <div className="text-primaryColor">
                    <BiSort />
                  </div>) : <BiSort />}
                </div>
                </div>
              </th>
              <th scope="col" className="px-3 py-3 flex gap-x-4">
                <p>Giá</p>
                <div
                  onClick={() => handleSortChange('price')}
                  className="cursor-pointer text-[18px] text-center"
                >
                  {sortOrder === 'price' ? (sortDirection === 'asc' ? <BiSort /> : <div className="text-primaryColor">
                    <BiSort />
                  </div>) : <BiSort />}
                </div>
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
                <td className="relative">
                  {openRowIndex === item._id && (
                    <div className="absolute right-0 top-full mt-2 w-48 z-10 bg-white shadow-lg rounded-lg">
                      <Action id={item._id} type={"product"} />
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
    </>
  );
};

export default ProductTable;
