/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaRegEdit,FaRegTrashAlt } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import EmployeeAddDialog from "./EmployeeAddDialog";
import EmployeeEdit from "./EmployeeEdit";
import EmployeeDeleteDialog from "./EmployeeDelete";

const EmployeeTable = ({ employees }) => {
  // console.log("check", employees);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isEmployee,setIsEmployee] = useState('');

  const totalPages = Math.ceil(employees.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  
  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };
   
    const handleOpenEdit = (pos)=>{
        setIsEmployee(pos);
        setOpenEdit(true);

    }
    const handleCloseEdit = ()=>{
        setOpenEdit(false);
        setIsEmployee(null);
    }
    const handleOpenDelete = (id)=>{
        setIsEmployee(id);
        setOpenDelete(true);

    }
    const handleCloseDelete = ()=>{
        setOpenDelete(false);
        setIsEmployee(null);
    } 
  return (
    <div>
      <div className="mx-auto mr-[50px]">
        <button
          onClick={() => handleOpenAdd()}
          className="mx-4 btn focus:outline-none flex items-center border rounded-md py-2 px-2 gap-1"
        >
          <FaPlusCircle />
          <span className="font-semibold text-[18px]">Thêm</span>
        </button>
      </div>
      <div className="mx-5">
        <table className="w-full  mt-5 text-center ">
          <thead className=" text-[16px] uppercase border-b-2 bg-blue-600 text-white border-b-slate-300">
            <tr>
              <th></th>
              <th scope="col" className="px-3 py-3">
                Họ Tên
              </th>
              <th scope="col" className="px-3 py-3">
                Giới tính
              </th>
              <th scope="col" className="px-3 py-3">
                SĐT
              </th>
              <th scope="col" className="px-3 py-3">
                Email
              </th>
              <th scope="col" className="px-3 py-3">
                Địa chỉ
              </th>
              <th scope="col" className="px-3 py-3">
                Chức vụ
              </th>
             
              <th scope="col" className="text-center">
                
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-50">
            {currentItems.map((item, index) => (
              <tr key={index} className="text-[16px] text-center relative">
                <td className="pl-2 py-4 p-0">
                  <img
                    src={item.photo}
                    className="w-9 h-9 border-gray-400 border rounded-full"
                    alt=""
                  />
                </td>
                <td className="pr-3 py-4">{item.name}</td>
                <td className="pr-3 py-4">{item.gender}</td>
                <td className="pr-3 py-4">{item.phone}</td>
                <td className="pr-3 py-4">{item.email}</td>
                <td className="pr-3 py-4">{item.address}</td>
                <td className="pr-3 py-4">{item.position?.name}</td>
              
                <td className="px-4 py-2 border-b flex gap-4">
                                        <button className="text-blue-600 hover:text-blue-800 cursor-pointer" onClick={()=>handleOpenEdit(item._id)} ><FaRegEdit /></button>
                                        <button className="text-red-600 hover:text-red-800 cursor-pointer" onClick={()=>handleOpenDelete(item._id)} ><FaRegTrashAlt /></button>
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
      <EmployeeAddDialog
        open={openAdd}
        handleClose={handleCloseAdd}
        size="lg"
        position="center"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      />
      <EmployeeEdit open={openEdit} handleClose={handleCloseEdit} employeeId={isEmployee}  />
      <EmployeeDeleteDialog open={openDelete} handleClose={handleCloseDelete} employeeId={isEmployee} />
    </div>
  );
};

export default EmployeeTable;
