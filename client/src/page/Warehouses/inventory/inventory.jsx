/* eslint-disable react/prop-types */
import { FormatDay } from "../../../utils/formatDay";
import FormatPrice from "../../../utils/formatPrice";


const Inventory = ({ stockIn}) => {
    return (
        <>
            
                                    <div className="bg-white h-[300px] overflow-auto relative ">
                                        <table className="border-slate-400 border-t-2">
                                            <thead className="bg-blue-100">
                                                <tr>
                                                    <th className="border-0 border-x-2 border-solid border-slate-400 p-1">STT</th>
                                                    <th className="border-0 border-r-2 border-solid border-slate-400 p-1">SỐ PHIẾU</th>
                                                    <th className="border-0 border-r-2 border-solid border-slate-400 p-1">TÊN HÀNG HÓA</th>
                                                    <th className="border-0 border-r-2 border-solid border-slate-400 p-1">ĐVT</th>
                                                    <th className="border-0 border-r-2 border-solid border-slate-400 p-1">SỐ LƯỢNG</th>
                                                    <th className="border-0 border-r-2 border-solid border-slate-400 p-1">GIÁ NHẬP</th>
                                                    <th className="border-0 border-r-2 border-solid border-slate-400 p-1">THÀNH TIỀN</th>
                                                    <th className="border-0 border-r-2 border-solid border-slate-400 p-1">NGÀY NHÂP</th>
                                                    <th className="border-0 border-r-2 border-solid border-slate-400 p-1">VỊ TRÍ</th>
                                                    <th className="border-0 border-r-2 border-solid border-slate-400 p-1">QUẦY/KỆ</th>
                                                    <th className="border-0 border-r-2 border-b-2 border-solid border-slate-400 p-1 w-[100px]"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="w-4 bg-white hover:bg-blue-500 text-center items-center border-2 border-l-2 border-solid border-slate-400 p-1">1</td>
                                                    <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 uppercase p-1">{stockIn._id}</td>
                                                    <td className="bg-white hover:bg-blue-500  border-2 border-solid border-slate-400 p-1">{stockIn?.product?.name}</td>
                                                    <td className="bg-white hover:bg-blue-500  border-2 border-solid border-slate-400 p-1">Cái</td>
                                                    <td className="bg-white hover:bg-blue-500  border-2 border-solid border-slate-400 p-1">{stockIn?.quantity}</td>
                                                    <td className="bg-white hover:bg-blue-500  border-2 border-solid border-slate-400 p-1">{FormatPrice(stockIn?.product?.price)}</td>
                                                    <td className="bg-white hover:bg-blue-500  border-2 border-solid border-slate-400 p-1">{FormatPrice(stockIn?.product?.price * stockIn?.quantity)}</td>
                                                    <td className="bg-white hover:bg-blue-500  border-2 border-solid border-slate-400 p-1">{FormatDay(stockIn.date)}</td>
                                                    <td className="bg-white hover:bg-blue-500  border-2 border-solid border-slate-400 p-1">{stockIn.location.rack ? stockIn.location.rack:stockIn.location.pallet }</td>
                                                    <td className="bg-white hover:bg-blue-500  border-2 border-solid border-slate-400 p-1 uppercase">{stockIn.location.type}</td>
                                                </tr>
                                                

                                            </tbody>
                                        </table>
                                    </div>


                                </>
    );
}

export default Inventory;
