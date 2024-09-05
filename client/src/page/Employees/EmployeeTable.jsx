/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import Action from "../../components/Actions/Action";
import menuDotsIcon from "../../assets/images/menu-dots.png"
import EmployeeAddDialog from "./EmployeeAddDialog";

const EmployeeTable = ({employees}) => {
    console.log('check',employees)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [openRowIndex, setOpenRowIndex] = useState(null);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem);
    const [openAdd,setOpenAdd] =  useState(false);



    const totalPages = Math.ceil(employees.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleMenuClick = (index) => {
        console.log("Menu clicked for index:", index);
        setOpenRowIndex((prevIndex) => (prevIndex === index ? null : index));
    };
    const handleOpenAdd = () => {
        setOpenAdd(true);
    };
    
      const handleCloseAdd = () => {
        setOpenAdd(false);
    };
    return (
        <div>
            <div className="mx-auto mr-[50px]">
                    <button onClick={()=>handleOpenAdd()} className="mx-4 btn focus:outline-none flex items-center border rounded-md py-2 px-2 gap-1">
                    <FaPlusCircle />
                    <span className="font-semibold text-[18px]">Thêm</span>

                </button>
            </div>
            <div className="mx-5">
                <table className="w-full text-sm mt-5 text-center border-2 border-slate-300">
                    <thead className="text-xs uppercase border-b-2 border-b-slate-300">
                        <tr>
                            <th></th>
                            <th scope="col" className="px-3 py-3">Họ Tên</th>
                            <th scope="col" className="px-3 py-3">Giới tính</th>
                            <th scope="col" className="px-3 py-3">SĐT</th>
                            <th scope="col" className="px-3 py-3">Email</th>
                            <th scope="col" className="px-3 py-3">Địa chỉ</th>
                            <th scope="col" className="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-slate-50">
                        {currentItems.map((item, index) => (
                            <tr key={index} className="text-[16px] text-center relative">
                                <td className="pl-2 py-4 p-0"><img src={item.photo} className="w-9 h-9 border-gray-400 border rounded-full" alt="" /></td>
                                <td className="pr-3 py-4">{item.name}</td>
                                <td className="pr-3 py-4">{item.gender}</td>
                                <td className="pr-3 py-4">0{item.phone}</td>
                                <td className="pr-3 py-4">{item.email}</td>
                                <td className="pr-3 py-4">{item.address}</td>
                                <td className="relative">
                                    <img
                                        src={menuDotsIcon}
                                        className="w-4 h-4 mx-auto cursor-pointer"
                                        alt="Menu"
                                        onClick={() => handleMenuClick(index)} // Truyền index của hàng hiện tại
                                    />
                                    {openRowIndex === index && (
                                        <div className="absolute right-0 top-full mt-2 w-48 z-10 bg-white shadow-lg rounded-lg">
                                            <Action id = {item._id} type={'employee'}/>
                                        </div>
                                    )}
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
                            currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <EmployeeAddDialog
                open={openAdd}
                handleClose ={handleCloseAdd}
                size="lg"
                position="center"
                animate={{
                    mount:{ scale:1,y:0},
                    unmount:{ scale:0.9,y: -100},
                }}
            />
        </div>
    );
}

export default EmployeeTable;
