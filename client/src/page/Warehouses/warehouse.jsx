import { useState } from "react";
import { FaAngleRight, FaPlus } from "react-icons/fa";
import AddProduct from "./addProduct";
import Category from "./category/category";
import AddManufacture from "./manufacture/manufacture";
import Location from "./location/location";

const Warehouse = () => {
    const [tab,setTab] = useState('location');

    return (
        <div>
            <div className="text-left p-5 w-1/3 flex gap-2 relative group">
                <h2 className="heading w-[150px]">Quản lý Kho</h2>
                <div className="my-2 flex">
                    <button
                        className="border border-solid rounded-full text-white text-[12px] bg-black text-center p-1"
                        aria-label="Thêm mới"
                    >
                        <FaPlus />
                    </button>
                    <div
                        className={`absolute left-52 rounded-md py-1 ml-1 w-[230px] flex justify-center
                        bg-indigo-100 text-indigo-800 text-sm z-10 invisible 
                        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                        transition-opacity duration-300 ease-in-out`} // Hiệu ứng dropdown mượt mà
                    >
                        <ul className="text-left px-2">
                            <li onClick={()=>setTab('addProduct')} className="m-2 text-black text-lg flex justify-between items-center cursor-pointer hover:text-indigo-600">
                                Nhập sản phẩm 
                                <FaAngleRight className="ml-2" /> {/* Căn chỉnh icon */}
                            </li>
                            <li onClick={()=>setTab('Category')} className="m-2 text-black text-lg flex justify-between items-center cursor-pointer hover:text-indigo-600">
                                Thêm danh mục
                                <FaAngleRight className="ml-2" />
                            </li>
                            <li onClick={()=>setTab('addManufacture')} className="m-2 text-black text-lg flex justify-between items-center cursor-pointer hover:text-indigo-600">
                                Thêm nhà phân phối
                                <FaAngleRight className="ml-2" />
                            </li>
                           
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mt-5">
            {tab === 'addProduct' && <AddProduct />}
            {tab === 'location' && <Location />}
            {tab === 'Category' && <Category  />}
            {tab === 'addManufacture' && <AddManufacture />}


            </div>
        </div>
    );
}

export default Warehouse;
