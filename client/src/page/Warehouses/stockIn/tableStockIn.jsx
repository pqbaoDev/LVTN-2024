/* eslint-disable react/prop-types */

import { FormatDay } from "../../../utils/formatDay";
import FormatPrice from "../../../utils/formatPrice";

const TableStockIn = ({stockIn}) => {
    console.log("check",stockIn)
    return (
        <div >
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
                    
                        {
                            stockIn?.map((item,index)=>(
                                <tr key={index} >
                                    <td className="border-2 border-sky-300 uppercase items-center text-right bg-white py-1 px-2">{index +1}</td>
                                    <td className="border-2 border-sky-300 uppercase items-center text-right bg-white py-1 px-2"></td>
                                    <td className="border-2 border-sky-300 uppercase items-center text-right bg-white py-1 px-2">{item._id}</td>
                                    <td className="border-2 border-sky-300 uppercase items-center text-right bg-white py-1 px-2">{FormatDay (item.date)}</td>
                                    <td className="border-2 border-sky-300 uppercase items-center text-right bg-white py-1 px-2">{item.quantity}</td>
                                    <td className="border-2 border-sky-300 uppercase items-center text-right bg-white py-1 px-2">{FormatPrice (item.quantity * item.product?.price)}</td>
                                    <td className="border-2 border-sky-300  items-center text-center bg-white py-1 px-2">{item.note}</td>
                                    <td className="border-2 border-sky-300  items-center text-center bg-white py-1 px-2">{item.status}</td>
                                    <td className="bg-white"></td>

                                </tr>

                            ))
                        }
                    
                </tbody>
            </table>
        </div>
    );
}

export default TableStockIn;
