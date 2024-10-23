/* eslint-disable react/prop-types */
import { useState } from "react";
import {FormatDay} from "../../utils/formatDay";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import WarrantiesDeleteDialog from "./warrantiesDeleteDialog";
import WarrantiesDetailDialog from "./warrantiesDetailDialog";
const WarrantiesTable = ({ warranties }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [checkedWarranties, setCheckedWarranties] = useState({});
    const [selectedIds, setSelectedIds] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = warranties.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(warranties.length / itemsPerPage);

    const handleSelectChange = (e) => {
        const { name, checked } = e.target;
        if (name === 'allSelect') {
            const updatedCheckedWarranties = {};
            currentItems.forEach(item => {
                updatedCheckedWarranties[item._id] = checked;
            });
            setCheckedWarranties(updatedCheckedWarranties);
        } else {
            setCheckedWarranties(prev => ({ ...prev, [name]: checked }));
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const selectedOrderIds = Object.keys(checkedWarranties).filter(id => checkedWarranties[id]);

    const handleOpenDelete = () => {
        if (selectedOrderIds.length > 0) {
            setSelectedIds(selectedOrderIds);
            setOpenDialog(true);
        } else {
            toast.warn("Please select a warranty to delete!");
        }
    };
    const handleCloseDelete = () => {
        setOpenDialog(false);
        setSelectedIds([]);
    };


    const handleOpenEdit = (id) => {
        setSelectedIds(id);
        setOpenEditDialog(true);
    };
    const handleCloseEdit = ()=>{
        setOpenEditDialog(false);
        setSelectedIds([]);

    }

    return (
        <>
            <div className="m-5">
                <div className="flex justify-end">
                    <button
                        className={`border rounded-xl mr-5 flex gap-2 p-2 ${selectedOrderIds.length > 0 ? 'bg-red-500 text-white' : 'hidden'}`}
                        onClick={handleOpenDelete}
                    >
                        <FaTrash className="mt-1" />
                        <span>xóa</span>
                    </button>
                </div>
                <table className="w-full text-sm text-center border-2 border-slate-300">
                    <thead className="text-xs uppercase border-b-2 border-b-slate-300">
                        <tr>
                            <th scope="col">
                                <input
                                    type="checkbox"
                                    name="allSelect"
                                    checked={Object.keys(checkedWarranties).length === currentItems.length && currentItems.every(item => checkedWarranties[item._id])}
                                    onChange={handleSelectChange}
                                />
                            </th>
                            <th scope="col">Tên khách hàng</th>
                            <th scope="col">Địa chỉ</th>
                            <th scope="col">SĐT</th>
                            <th scope="col">Sản phẩm</th>
                            <th scope="col">Loại</th>
                            <th scope="col">Thời gian</th>
                            <th scope="col">Ngày bắt đầu</th>
                            <th scope="col">Ngày kết thúc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item) => (
                            <tr key={item._id} className="text-[16px] text-center">
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={checkedWarranties[item._id] || false}
                                        name={item._id}
                                        onChange={handleSelectChange}
                                    />
                                </td>
                                <td onClick={() => handleOpenEdit(item._id)}>{item.nameCustomer}</td>
                                <td onClick={() => handleOpenEdit(item._id)}>{item.address }</td>
                                <td onClick={() => handleOpenEdit(item._id)}>{item.phoneCustomer}</td>
                                <td onClick={() => handleOpenEdit(item._id)}>{item.product}</td>
                                <td onClick={() => handleOpenEdit(item._id)} className="flex items-center">
                                    <div
                                        style={{
                                            backgroundColor: item.type?.color || 'transparent',
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%', // Makes it a circle
                                            marginRight: '8px' // Space between color and text
                                        }}
                                    ></div>
                                    <p>{item.type?.ram || 'N/A'}</p>
                                </td>

                                <td onClick={() => handleOpenEdit(item._id)}>{item.warrantyPeriod}</td>
                                <td onClick={() => handleOpenEdit(item._id)}>{FormatDay(item.startDate)}</td>
                                <td onClick={() => handleOpenEdit(item._id)}>{FormatDay(item.endDate)}</td>
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
                        className={`mx-1 px-3 py-1 rounded-lg ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <WarrantiesDeleteDialog
                warrantiesIds={selectedIds}
                open={openDialog}
                handleClose={handleCloseDelete}
                size='lg'
                position='center'
            />
            <WarrantiesDetailDialog
                warrantiesId={selectedIds}
                open={openEditDialog}
                handleClose={handleCloseEdit}
                size='lg'
                position='center'
            />
        </>
    );
}

export default WarrantiesTable;
