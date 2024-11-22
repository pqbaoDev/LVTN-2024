/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { FormatDay } from "../../utils/formatDay";
import FormatPrice from "../../utils/formatPrice";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import PromotionDeleteDialog from "./promotionDeleteDialog";
import PromotionEditDialog from "./promotionEditDialog";
import { useNavigate } from "react-router-dom";

const PromotionTable = ({ promotions, setRefetch }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [checkedPromotions, setCheckedPromotions] = useState({});
    const [selectedIds, setSelectedIds] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const navigate = useNavigate();

    // Slicing the promotions array for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = promotions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(promotions.length / itemsPerPage);

    // Handle select all promotions in the current page
    const handleSelectChange = (e) => {
        const { name, checked } = e.target;
        if (name === "allSelect") {
            const updatedCheckedPromotions = {};
            currentItems.forEach((item) => {
                updatedCheckedPromotions[item._id] = checked;
            });
            setCheckedPromotions(updatedCheckedPromotions);
        } else {
            setCheckedPromotions((prev) => ({
                ...prev,
                [name]: checked,
            }));
        }
    };

    // Handle page change for pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Get selected promotion ids
    const selectedOrderIds = Object.keys(checkedPromotions).filter(
        (id) => checkedPromotions[id]
    );

    // Open delete dialog for selected promotions
    const handleOpenDelete = () => {
        if (selectedOrderIds.length > 0) {
            setSelectedIds(selectedOrderIds);
            setOpenDialog(true);
        } else {
            toast.warn("Hãy chọn đơn hàng bạn muốn xóa!");
        }
    };

    // Close delete dialog
    const handleCloseDelete = () => {
        setOpenDialog(false);
        setSelectedIds([]);
    };

    // Open edit dialog for selected promotion
    const handleOpenEdit = (id) => {
        setSelectedIds(id);
        setOpenEditDialog(true);
    };

    // Handle the addition of new promotion and trigger refetch
    const handleEditPromotion = async () => {
        setOpenEditDialog(false);
        setRefetch(true); 
    };

    // Close edit dialog
    const handleCloseEdit = () => {
        setOpenEditDialog(false);
        setSelectedIds([]);
    };

    // Stop event propagation on modal
    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    return (
        <>
            <div className="m-5">
                <div className="flex justify-end">
                    <button
                        className={`${
                            selectedOrderIds.length > 0
                                ? "border rounded-xl mr-5 flex gap-2 text-center border-solid p-2 bg-red-500 text-white "
                                : "hidden"
                        }`}
                        onClick={handleOpenDelete}
                    >
                        <FaTrash className="mt-1" />
                        <span>Xóa</span>
                    </button>
                </div>
                <table className="w-full text-sm text-center border-2 border-slate-300">
                    <thead className="text-xs uppercase border-b-2 border-b-slate-300">
                        <tr>
                            <th scope="col">
                                <input
                                    type="checkbox"
                                    name="allSelect"
                                    checked={
                                        Object.keys(checkedPromotions).length ===
                                            currentItems.length &&
                                        currentItems.every(
                                            (item) => checkedPromotions[item._id]
                                        )
                                    }
                                    onChange={handleSelectChange}
                                />
                            </th>
                            <th scope="col">Mã khuyến mãi</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Giảm</th>
                            <th scope="col">Ngày bắt đầu</th>
                            <th scope="col">Ngày kết thúc</th>
                            <th scope="col">Số lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item) => (
                            <tr key={item._id} className="text-[16px] text-center">
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={checkedPromotions[item._id] || false}
                                        name={item._id}
                                        onChange={handleSelectChange}
                                    />
                                </td>
                                <td
                                    className="pr-3 py-4"
                                    onClick={() => handleOpenEdit(item._id)}
                                >
                                    {item.promotionId}
                                </td>
                                <td
                                    className="pr-3 py-4"
                                    onClick={() => handleOpenEdit(item._id)}
                                >
                                    {item.name}
                                </td>
                                <td
                                    className="pr-3 py-4"
                                    onClick={() => handleOpenEdit(item._id)}
                                >
                                    {FormatPrice(item.sale)}
                                </td>
                                <td
                                    className="pr-3 py-4"
                                    onClick={() => handleOpenEdit(item._id)}
                                >
                                    {FormatDay(item.startDate)}
                                </td>
                                <td
                                    className="pr-3 py-4"
                                    onClick={() => handleOpenEdit(item._id)}
                                >
                                    {FormatDay(item.endDate)}
                                </td>
                                <td
                                    className="pr-3 py-4"
                                    onClick={() => handleOpenEdit(item._id)}
                                >
                                    {item.quantity}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
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

            {/* Modals */}
            <PromotionDeleteDialog
                promotionIds={selectedIds}
                open={openDialog}
                handleClose={handleCloseDelete}
                setOpen={setOpenDialog}
                stopPropagation={stopPropagation}
                onRefetchPromotion={handleEditPromotion}

            />
            <PromotionEditDialog
                promotionId={selectedIds}
                open={openEditDialog}
                handleClose={handleCloseEdit}
                size="lg"
                position="center"
                animate={{
                    mount: { x: 1, y: 0 },
                    unmount: { x: 0.9, y: -100 },
                }}
                onRefetchPromotion={handleEditPromotion}
            />
        </>
    );
};

export default PromotionTable;
