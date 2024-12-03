/* eslint-disable react/prop-types */
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import { useState } from "react";
import UserAddDialog from "./UserAddDialog";
import UserDeleteDialog from "./userDeleteDialog";
import { toast } from "react-toastify";
import UserEditDialog from "./UserEditDialog";
// import { FormatTime } from "../../utils/formatDay";

const UserTable = ({ users,setRefetch }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [openAdd, setOpenAdd] = useState(false);
    const [checked, setChecked] = useState({});
    const [selectedIds, setSelectedIds] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEdit,setOpenEdit] = useState(false);



    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(users.length / itemsPerPage);
    const handleSelectChange = (e) => {
        const { name, checked } = e.target;
        if (name === 'allSelect') {
            const updatedChecked = {};
            currentItems.forEach(item => {
                updatedChecked[item._id] = checked;
            });
            setChecked(updatedChecked);
        } else {
            setChecked(prev => ({ ...prev, [name]: checked }));
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    
    const selectedId = Object.keys(checked).filter(id => checked[id]);

    const handleOpenDelete = () => {
        if (selectedId.length > 0) {
            setSelectedIds(selectedId);
            setOpenDialog(true);
        } else {
            toast.warn("Hãy chọn đơn hàng bạn muốn xóa!");
        }
    };
    const handleOpenEdit = (id)=>{
        setSelectedIds(id);
        setOpenEdit(true)
    }
    let dateNow = new Date();
    console.log(dateNow)

    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);

    return (
        <div>
            <div className="mx-auto mr-[50px] relative">
                <button
                    onClick={handleOpenAdd}
                    className="mx-4 btn focus:outline-none flex items-center border rounded-md py-2 px-2 gap-1"
                    aria-label="Add User"
                >
                    <FaPlusCircle />
                    <span className="font-semibold text-[18px]">Thêm</span>
                </button>
                <div className="absolute -right-5 top-0">
                        <button
                            className={`border rounded-xl mr-5 flex gap-2 text-center border-solid p-2 ${selectedId.length > 0 ? 'bg-red-500 text-white' : 'hidden'}`}
                            onClick={handleOpenDelete}
                        >
                            <FaTrash className="mt-1" />
                            <span>Xóa</span>
                        </button>
                    </div>
            </div>
            <div className="mx-5">
                <table className="w-full text-sm mt-5 text-center border-2 border-slate-300">
                    <thead className=" uppercase border-b-2 border-b-slate-300">
                        <tr>
                            <th scope="col">
                                        <input
                                            type="checkbox"
                                            name="allSelect"
                                            checked={Object.keys(checked).length === currentItems.length && currentItems.every(item => checked[item._id])}
                                            onChange={handleSelectChange}
                                        />
                            </th>
                            <th scope="col" colSpan={2} className="px-3 py-3">Họ Tên</th>
                            <th scope="col" className="px-3 py-3">Giới tính</th>
                            <th scope="col" className="px-3 py-3">SĐT</th>
                            <th scope="col" className="px-3 py-3">Email</th>
                            <th scope="col" className="px-3 py-3">Địa chỉ</th>
                            <th scope="col" className="px-3 py-3">Điểm</th>
                            <th scope="col" className="px-3 py-3">Trạng thai</th>
                        </tr>
                    </thead>
                    <tbody className="bg-slate-50">
                        {currentItems.map((item) => (
                            <tr key={item._id} className="text-[16px] text-center relative">
                                <td>
                                            <input
                                                type="checkbox"
                                                checked={checked[item._id] || false}
                                                name={item._id}
                                                onChange={handleSelectChange}
                                            />
                                        </td>
                                <td className="pl-2 py-4 p-0">
                                    <img src={item.photo} className="w-9 h-9 border-gray-400 border rounded-full" alt="" />
                                </td>
                                <td className="pr-3 py-4 cursor-pointer" onClick={()=>handleOpenEdit(item._id)}>{item.name}</td>
                                <td className="pr-3 py-4 cursor-pointer" onClick={()=>handleOpenEdit(item._id)}>{item.gender}</td>
                                <td className="pr-3 py-4 cursor-pointer" onClick={()=>handleOpenEdit(item._id)}>{item.phone}</td>
                                <td className="pr-3 py-4 cursor-pointer" onClick={()=>handleOpenEdit(item._id)}>{item.email}</td>
                                <td className="pr-3 py-4 cursor-pointer" onClick={()=>handleOpenEdit(item._id)}>{item.address}</td>
                                <td className="pr-3 py-4 cursor-pointer" onClick={()=>handleOpenEdit(item._id)}>{item.point}</td>
                                <td className="pr-3 py-4 cursor-pointer" onClick={()=>handleOpenEdit(item._id)}>
                                        <div>
                                    {item.status === 'on' ? (
                                            <div className=" w-3 h-3 rounded-full shadow-xl bg-green-600"></div>
                                                                                ):
                                                                                (
                                                                                    <div>

                                            <div className=" w-3 h-3 rounded-full shadow-xl bg-gray-600"></div>
                                                {/* {FormatTime(dateNow - item.lastActiveAt)} */}
                                                                                    </div>
                                    )
                                }
                                        </div>
                                    
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
            <UserAddDialog
                open={openAdd}
                handleClose={handleCloseAdd}
                size="lg"
                position="center"
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
                setRefetch={setRefetch}
            />
            <UserDeleteDialog
                open={openDialog}
                userId={selectedIds}
                setopen ={setOpenDialog}
                setRefetch={setRefetch}
                
            />
            <UserEditDialog
                open={openEdit}
                userId={selectedIds}
                handleClose={()=>setOpenEdit(false)}
                setRefetch={setRefetch}

            />
        </div>
    );
};

export default UserTable;
