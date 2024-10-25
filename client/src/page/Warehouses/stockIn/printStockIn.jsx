/* eslint-disable react/prop-types */

import FormatPrice from "../../../utils/formatPrice";
import logo from "../../../assets/images/logo.png";
import { FormatDay } from "../../../utils/formatDay";


const PrintStockIn = ({ stockIn }) => {

    return (
        <div className="print-stockIn">
            <div className="grid grid-cols-2">
                <div className="relative">
                    <img className="w-[216px]" src={logo} alt="" />
                    <div className="absolute top-8 left-7 mt-2 text-center w-[216px]">
                        <p className='text-[13px]'>Chất lượng thật - Giá trị thật</p>
                    </div>
                    <h2 className="font-semibold text-[13px] mt-1">Cửa hàng thiết bị điện tử 2002Store</h2>
                    <p className="font-normal text-[13px]">
                        <span className="font-semibold text-[13px]">Địa chỉ:</span> 141/5c 30 tháng 4, Phường Hưng lợi, Quận Ninh Kiều, Cần Thơ
                    </p>
                    
                </div>
                <div className="item-end justify-end flex" >
                <div className="border border-slate-700 py-5 px-1 w-1/3 h-2/3">
                    <div className="flex gap-2 items-left italic justify-center">
                        <p>Khu vực:</p>
                        <p>{stockIn.location.zone.symbol}</p>
                    </div>
                    <div className="flex gap-2 items-left italic justify-center">
                        <p>Vị trí</p>
                        <p>{stockIn.location.rack ? stockIn.location.rack:stockIn.location.pallet}</p>
                    </div>
                </div>
                </div>
            </div>
            <div className="m-5">
                <h1 className="font-extrabold text-[22px] text-center leading-3">PHIẾU NHẬP MUA</h1>
                <p className="text-center text-[13px] italic font-normal py-1">số phiếu: {stockIn._id} - Ngày nhập: {FormatDay( stockIn.date)}</p>
            </div>
            <div className="mb-5">
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-[14px]">Nhà cung cấp:</p>
                        <p>{stockIn.product.manuFacture.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-[14px]">Số điện thoại:</p>
                        <p>{stockIn.product.manuFacture.phone}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-[14px]">Đơn vị nhập:</p>
                        <p>Cửa hàng thiết bị điện tử 2002Store</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-[14px]">Số điện thoại:</p>
                        <p>097950395</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                        <p className="font-semibold text-[14px]">Địa chỉ:</p>
                        <p>141/5c 30 tháng 4, Phường Hưng lợi, Quận Ninh Kiều, Cần Thơ</p>
                </div>
                <div className="flex items-center gap-2">
                        <p className="font-semibold text-[14px]">Ghi chú:</p>
                        <p>{stockIn?.note}</p>
                </div>
            </div>
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
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="w-4 bg-white hover:bg-blue-500 text-center items-center border-2 border-l-2 border-solid border-slate-400 p-1">1</td>
                        <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 uppercase p-1">{stockIn._id}</td>
                        <td className="bg-white hover:bg-blue-500  border-2 border-solid border-slate-400 p-1">{stockIn?.product?.name}</td>
                        <td className="bg-white hover:bg-blue-500  border-2 border-solid border-slate-400 p-1">Cái</td>
                        <td className="bg-white hover:bg-blue-500  border-2 border-solid border-slate-400 p-1">{stockIn?.quantity}</td>
                        <td className="bg-white hover:bg-blue-500  border-2 border-solid border-slate-400 p-1">{FormatPrice (stockIn?.product.price)}</td>
                        <td className="bg-white hover:bg-blue-500  border-2 border-solid border-slate-400 p-1">{FormatPrice(stockIn?.product.price * stockIn?.quantity)}</td>
                    </tr>
                    <tr className="bg-white hover:bg-blue-500  border-2 border-solid border-slate-400 p-1">
                        <td></td>
                        <td></td>
                        <td className="text-center font-semibold">TỔNG CỘNG</td>
                        <td></td>
                        <td className="bg-white hover:bg-blue-500  border-2 border-solid border-slate-400 p-1">{stockIn?.quantity}</td>
                        <td className="bg-white hover:bg-blue-500  border-2 border-solid border-slate-400 p-1"></td>
                        <td className="bg-white hover:bg-blue-500  border-2 border-solid border-slate-400 p-1">{FormatPrice(stockIn?.product.price * stockIn?.quantity)}</td>

                    </tr>

                </tbody>
            </table>
            <div className="grid grid-cols-2 mt-5 ">
                <div className="text-center">
                    <p className="font-semibold">THỦ KHO</p>
                </div>
                <div className="items-center text-center">
                    <p>Ngày...tháng...năm...</p>
                    <p className="font-semibold">Người lập</p>
                    <p className="font-bold mt-10">{stockIn.employee.name}</p>
                </div>
            </div>
        </div>
    );
}

export default PrintStockIn;
