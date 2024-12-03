/* eslint-disable react/prop-types */

import { useState } from "react";
import { FormatDay } from "../../../utils/formatDay";
import FormatPrice from "../../../utils/formatPrice";
// import StockOut from "./stockOut";
import StockoutDetail from "./stockoutDetail";
// import Stockindetail from "./stockindetail";

const StockoutTable = ({ stockIn }) => {
    const [selectedStockIn,setSelectedStselectedStockIn] = useState('')
  const [isOpen,setIsOpen] = useState(false);
  const handleOpenDetail = (stockIn)=>{
    setSelectedStselectedStockIn(stockIn);
    setIsOpen(true);
  }
  const handleCloseDetail = ()=>{
      setIsOpen(false);
      setSelectedStselectedStockIn(null);
  }
  const stopPropagation = (e)=>e.stopPropagation()

    return (
        <div>
            <table className="p-0 ">
                <thead className="bg-sky-200">
                    <tr>
                        <th className="border-2 border-sky-300 w-[30px]"></th>
                        <th className="border-2 border-sky-300 w-[10px]"></th>
                        <th className="border-2 border-sky-300 uppercase items-center text-left py-1 px-1 w-1/12">Số phiếu</th>
                        <th className="border-2 border-sky-300 uppercase items-center text-left py-1 px-1 w-1/12">Ngày</th>
                        <th className="border-2 border-sky-300 uppercase items-center text-left py-1 px-1 w-[100px]">Số lượng</th>
                        <th className="border-2 border-sky-300 uppercase items-center text-left py-1 px-1 w-[120px]">Tổng tiền</th>
                        <th className="border-2 border-sky-300 uppercase items-center text-left py-1 px-1 w-[210px]">Ghi chú</th>
                        <th className="border-2 border-sky-300 uppercase items-center text-left py-1 px-1 w-[130px]">Trạng thái</th>
                        <th className="border-2 border-sky-300 uppercase items-center text-left py-1 px-1"></th>
                    </tr>
                </thead>
                <tbody>
    {stockIn?.map((item, index) => {
        const totalPrice = item.products?.reduce((itemProduct, product) => {
            return itemProduct + product.quantity * product.product?.price;
        }, 0) || 0;

        const totalQuantity = item.products?.reduce((total, product) => {
            return total + product.quantity;
        }, 0) || 0;

        return (
            <tr key={index}>
                <td className="border-2 border-sky-300 uppercase items-center text-right bg-white py-1 px-2" onClick={()=>handleOpenDetail(item)}>{index + 1}</td>
                <td className="border-2 border-sky-300 uppercase items-center text-right bg-white py-1 px-2" onClick={()=>handleOpenDetail(item)}></td>
                <td className="border-2 border-sky-300 uppercase items-center text-right bg-white py-1 px-2" onClick={()=>handleOpenDetail(item)}>{item._id}</td>
                <td className="border-2 border-sky-300 uppercase items-center text-right bg-white py-1 px-2" onClick={()=>handleOpenDetail(item)}>{FormatDay(item.dateOut)}</td>
                <td className="border-2 border-sky-300 uppercase items-center text-right bg-white py-1 px-2" onClick={()=>handleOpenDetail(item)}>{totalQuantity}</td>
                <td className="border-2 border-sky-300 uppercase items-center text-right bg-white py-1 px-2" onClick={()=>handleOpenDetail(item)}>{FormatPrice(totalPrice)}</td>
                <td className="border-2 border-sky-300 items-center text-center bg-white py-1 px-2">{item.note}</td>
                <td className="border-2 border-sky-300 items-center text-center bg-white py-1 px-2">{item.status}</td>
                <td className="bg-white"></td>
            </tr>
        );
    })}
</tbody>

            </table>
            <StockoutDetail
                open={isOpen}
                handleClose = {handleCloseDetail}
                stopPropagation={stopPropagation}
                stockOut={selectedStockIn}

            />
        </div>
    );
}

export default StockoutTable;
