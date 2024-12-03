/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../../config";
import useFetchData from "../../../Hook/userFecthData";
import { LiaSearchSolid } from "react-icons/lia";
import StockoutTable from "./stockoutTable";

const CategoryStockOut = ({locationId}) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [selectedZone, setSelectedZone] = useState(''); // Thêm state để lưu khu vực đã chọn
    const [selectedQuery, setSelectedQuery] = useState(''); // Thêm state để lưu khu vực đã chọn
    const [search,setSearch] = useState(false);

    // Sử dụng custom hook để fetch dữ liệu khi startDate, endDate, và zone thay đổi
    const { data: stockIn, loading, error } = useFetchData(
        `${BASE_URL}/stockOut/daterange/${locationId}?startDate=${startDate}&endDate=${endDate}&zone=${selectedZone}&query=${selectedQuery}`,
        [startDate, endDate, selectedZone] // Fetch lại khi startDate, endDate, hoặc zone thay đổi
    );
    const { data: zone } = useFetchData(`${BASE_URL}/zone`);

    // Cập nhật startDate và endDate khi người dùng thay đổi input
    useEffect(() => {
        if (start && end) {
            setStartDate(start);
            setEndDate(end);
        }
    }, [start, end]);

    return (
        <div>
            <div className="border-b-2 border-black pt-5">
                <div className="w-1/2 mx-auto mb-5">
                    <div className="grid grid-cols-2 gap-x-5 items-center ">
                        <div className="flex justify-center items-center gap-4">
                            <p className="form__label ml-0">Từ ngày:</p>
                            <input
                                type="date"
                                onChange={e => setStart(e.target.value)}
                                value={start}
                                name="startdate"
                                className="px-2 border-2 border-solid border-slate-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex justify-center items-center gap-4">
                            <p className="form__label ">Đến ngày:</p>
                            <input
                                type="date"
                                onChange={e => setEnd(e.target.value)}
                                value={end}
                                name="enddate"
                                className=" px-2 border-2 border-solid border-slate-500 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-x-5 mb-2">
                        <p className="form__label">Khu:</p>
                        <select
                            name="zone"
                            id=""
                            className="px-2 w-full border-2 border-solid border-slate-500 focus:outline-none"
                            onChange={(e) => setSelectedZone(e.target.value)} // Cập nhật khu vực đã chọn
                            value={selectedZone} // Gán giá trị khu vực đã chọn
                        >
                            <option value=''>Chọn khu vực</option>
                            {zone && zone.map((item, index) => (
                                <option key={index} value={item.name}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="bg-blue-500 py-2 pr-3">
                    <div className="flex justify-end item-end text-end">
                        { search &&(

                            <div className="w-2/3 mr-2 flex justify-end rounded-lg focus:outline-none">
                                <div className=" text-black mr-0 px-2 py-1 bg-white rounded-s-lg hover:bg-slate-400 text-center items-center" onClick={()=>setSearch(false)}>
                                  <p>X</p>
                                </div>
                                <input  onChange={(e) => setSelectedQuery(e.target.value)} value={selectedQuery} type="search" className="rounded-e-lg focus:outline-none px-2 py-1" placeholder="Nhập mã hoặc trạng thái.."  />
                            </div>
                        )

                        }
                        <div className="text-2xl text-white cursor-pointer" onClick={()=>setSearch(true)}>
                                <LiaSearchSolid  />
                        </div>
                    </div>

                </div>

            </div>

            {/* Hiển thị trạng thái dữ liệu */}
            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : error ? (
                <p className="text-center italic">{error}</p>
            ) : (
                <div>
                    {/* Hiển thị dữ liệu khi có */}
                    {stockIn && stockIn.length > 0 ? (
                        <StockoutTable stockIn={stockIn} />
                    ) : (
                        <p>Không có dữ liệu trong khoảng thời gian này.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default CategoryStockOut;
