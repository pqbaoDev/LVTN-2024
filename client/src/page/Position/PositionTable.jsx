/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import PositionAdd from "./PositionAdd";
import FormatPrice from "../../utils/formatPrice";
import { FaRegEdit,FaRegTrashAlt } from "react-icons/fa";
import PositionEdit from "./PositionEdit";
import PositionDelete from "./PositionDelete";

const PositionTable = ({ positions, setRefetch }) => {
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [isPosition,setIsPosition] = useState('');
    const handleOpenEdit = (pos)=>{
        setIsPosition(pos);
        setOpenEdit(true);

    }
    const handleCloseEdit = ()=>{
        setOpenEdit(false);
        setIsPosition(null);
    }
    const handleOpenDelete = (id)=>{
        setIsPosition(id);
        setOpenDelete(true);

    }
    const handleCloseDelete = ()=>{
        setOpenDelete(false);
        setIsPosition(null);
    }

    return (
        <>
            <div className="mb-4">
                <div className="mx-auto mr-[50px]">
                    <button
                        onClick={() => setOpenAdd(true)}
                        className="mx-4 btn focus:outline-none flex items-center border rounded-md py-2 px-2 gap-1"
                    >
                        <FaPlusCircle />
                        <span className="font-semibold text-[18px]">Thêm</span>
                    </button>
                </div>
            </div>

            <PositionAdd open={openAdd} handleClose={() => setOpenAdd(false)} setRefetch={setRefetch} />

            {/* Render bảng nếu có danh sách vị trí */}
            {positions && positions.length > 0 ? (
                <div className="overflow-x-auto mt-4 px-5">
                    <table className="w-full text-sm mt-5 text-center border-2 border-slate-300">
                        <thead className=" uppercase border-b-2 border-b-slate-300 bg-blue-600 text-white">
                            <tr>
                                <th></th>
                                <th className="px-4 py-2 text-left border-b">Tên Chức Vụ</th>
                                <th className="px-4 py-2 text-left border-b">Lương Cơ Bản</th>
                                <th className="px-4 py-2 text-left border-b">Phụ Cấp</th>
                                <th className="px-4 py-2 text-left border-b">Mô Tả</th>
                                <th className="px-4 py-2 text-left border-b"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-slate-50">
                            {positions.map((position,index) => (
                                <tr key={position._id} className="text-[16px] text-center relative">
                                    <td className="px-4 py-2 border-b">{index +1}</td>
                                    <td className="px-4 py-2 border-b">{position.name}</td>
                                    <td className="px-4 py-2 border-b">{FormatPrice (position.baseSalary)} <sup className="underline">đ</sup> </td>
                                    <td className="px-4 py-2 border-b">{FormatPrice (position.allowances)} <sup className="underline">đ</sup> </td>
                                    <td className="px-4 py-2 border-b">{position.description}</td>
                                    <td className="px-4 py-2 border-b flex gap-4">
                                        <button className="text-blue-600 hover:text-blue-800 cursor-pointer" onClick={()=>handleOpenEdit(position)} ><FaRegEdit /></button>
                                        <button className="text-red-600 hover:text-red-800 cursor-pointer" onClick={()=>handleOpenDelete(position._id)} ><FaRegTrashAlt /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            ) : (
                <p className="mt-4 text-center">Chưa có chức vụ nào.</p>
            )}

<PositionEdit open={openEdit} handleClose={handleCloseEdit} position={isPosition} setRefetch={setRefetch} />
<PositionDelete open={openDelete} handleClose={handleCloseDelete} positionId={isPosition} setRefetch={setRefetch} />



        </>
    );
}

export default PositionTable;
