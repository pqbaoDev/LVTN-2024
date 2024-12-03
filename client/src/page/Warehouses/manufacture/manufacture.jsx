import { useState, useMemo, useEffect } from "react";
import AddManufacture from "./addManufacture";
import EditManufacture from "./editManufacture";
import useFetchData from "../../../Hook/userFecthData";
import { BASE_URL } from "../../../../config";
import { FaTrash, FaEdit, FaAngleDoubleLeft, FaAngleDoubleRight, FaPlus, FaSearch} from "react-icons/fa";
import DeleteManufacture from "./deleteManufacture";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import whouse from '../../../assets/images/whouse.png';



const Manufacture = () => {
    const [query,setQuery] =  useState('');
    const [debounceQuery,setDebounceQuery]=useState('');
    const { data: manufacture } = useFetchData(`${BASE_URL}/manufacture?query=${debounceQuery}`);
    const [tab, setTab] = useState('add');
    const [selectedIds, setSelectedIds] = useState([]);
    const [checked, setChecked] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialog, setOpenDialog] = useState(false);
    const itemsPerPage = 5;
    

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Sử dụng useMemo để tối ưu hóa currentItems
    const currentItems = useMemo(() => manufacture.slice(indexOfFirstItem, indexOfLastItem), [manufacture, indexOfFirstItem, indexOfLastItem]);
    const totalPages = Math.ceil(manufacture.length / itemsPerPage);

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

    const handleTab = ({ key, id }) => {
        setTab(key);
        setSelectedIds(id);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const selectedManufactureIds = Object.keys(checked).filter(id => checked[id]);
    
    const handleOpenDelete = () => {
        if (selectedManufactureIds.length > 0) {
            setSelectedIds(selectedManufactureIds);
            setOpenDialog(true);
        } else {
            toast.warn("Hãy chọn đơn hàng bạn muốn xóa!");
        }
    };

    const handleCloseDelete = () => {
        setOpenDialog(false);
        setSelectedIds([]);
    };
    const HandleSearch =()=>{
        setQuery(query.trim());
    };
    useEffect(()=>{
        const timeOut = setTimeout(()=>{
            setDebounceQuery(query);
        },500);
        return ()=>clearTimeout(timeOut);
    },[query])

    return (
        <div>
             <div className="text-left p-5 w-1/3 flex gap-2 cursor-pointer">
                <img src={whouse} className="w-6 h-6" alt="" />
                <Link to={`/warehouse`} className="heading ">Quản Lý Nhà Cung Cấp</Link>
                
            </div>
            {tab === 'add' && <AddManufacture />}
            {tab === 'edit' && <EditManufacture id={selectedIds} />}

            <div className="mt-0">
            <div className="py-0 px-5 pt-4 mx-auto" >
            <div className=" text-center mb-5">
            
                <h2 className="heading">Danh sách nhà phân phối</h2>

            </div>
            
                <div className="relative w-1/4 max-w-lg mx-auto">
                    <input
                        type="search"
                        placeholder="Tìm kiếm..."
                        value={query}
                        onChange={e=>setQuery(e.target.value)}
                        className="w-full p-2 pl-10 border rounded-xl border-gray-300  focus:outline-none "
                    />
                    <button className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500"
                        onClick={HandleSearch}
                    >
                        <FaSearch />
                    </button>
                </div>
                
                
        </div>

                <div className="relative">
                    <div className="absolute right-1/4 -top-7">
                        <button
                            className={`border rounded-xl mr-5 flex gap-2 text-center border-solid p-2 ${selectedManufactureIds.length > 0 ? 'bg-red-500 text-white' : 'hidden'}`}
                            onClick={handleOpenDelete}
                        >
                            <FaTrash className="mt-1" />
                            <span>Xóa</span>
                        </button>
                    </div>
                    <div className="absolute left-1/4 -top-4">
                    <button
                        className="border border-solid border-primaryColor text-primaryColor rounded-full  text-[12px] bg-black text-center p-1"
                        onClick={()=>setTab('add')}
                    >
                        <FaPlus />
                    </button>
                    </div>

                    <div className="flex justify-center items-center">
                        <table className="w-1/2 mt-5 text-sm text-center border-2 border-slate-300">
                            <thead className="text-xs uppercase border-b-2 border-b-slate-300">
                                <tr>
                                    <th scope="col">
                                        <input
                                            type="checkbox"
                                            name="allSelect"
                                            checked={Object.keys(checked).length === currentItems.length && currentItems.every(item => checked[item._id])}
                                            onChange={handleSelectChange}
                                        />
                                    </th>
                                    <th scope="col">STT</th>
                                    <th colSpan={2}>Nhà cung cấp</th>
                                    <th scope="col">SĐT</th>
                                    <th scope="col">Địa chỉ</th>
                                    <th scope="col">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => (
                                    <tr key={item._id} className="text-[16px] text-center">
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={checked[item._id] || false}
                                                name={item._id}
                                                onChange={handleSelectChange}
                                            />
                                        </td>
                                        <td className="pr-3 py-4">{index + 1}</td>
                                        <td className="pr-3 py-4 max-w-[150px]">
                                            <img src={item.photo} alt="" />
                                            
                                        </td>
                                        <td className="pr-3 py-4">{item.name}</td>
                                        <td className="pr-3 py-4">{item.phone}</td>
                                        <td className="pr-3 py-4">{item.address}</td>
                                        <td className="pr-3 py-4 cursor-pointer" onClick={() => handleTab({key:'edit',id: item._id})}>
                                            <FaEdit />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="mx-1 px-3 py-1 rounded-lg bg-gray-300 text-gray-700"
                        >
                            <FaAngleDoubleLeft />
                        </button>
                        {currentPage > 2 && (
                            <>
                                <button
                                    onClick={() => handlePageChange(1)}
                                    className="mx-1 px-3 py-1 rounded-lg bg-gray-300 text-gray-700"
                                >
                                    1
                                </button>
                                <span>...</span>
                            </>
                        )}

                        {/* Các nút trang hiện tại, trước và sau */}
                        {Array.from({ length: totalPages }, (_, i) => {
                            if (i + 1 === currentPage || i + 1 === currentPage - 1 || i + 1 === currentPage + 1) {
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`mx-1 px-3 py-1 rounded-lg ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            }
                            return null;
                        })}

                        {/* Nút trang cuối cùng */}
                        {currentPage < totalPages - 1 && (
                            <>
                                <span>...</span>
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    className="mx-1 px-3 py-1 rounded-lg bg-gray-300 text-gray-700"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="mx-1 px-3 py-1 rounded-lg bg-gray-300 text-gray-700"
                        >
                            <FaAngleDoubleRight />
                        </button>
                    </div>
                </div>
            </div>
            <DeleteManufacture
                manufacturesIds={selectedIds}
                open={openDialog}
                handleClose={handleCloseDelete}
                size='lg'
                position='center'
                animate={{
                    mount: { x: 1, y: 0 },
                    unmount: { x: 0.9, y: -100 }
                }}
            />
        </div>
    );
};

export default Manufacture;
