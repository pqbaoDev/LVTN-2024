import { Link } from "react-router-dom";
import whouse from '../../../assets/images/whouse.png';
import useFetchData from "../../../Hook/userFecthData";
import { BASE_URL } from "../../../../config";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ProductItem from "./productItem";
import ProductList from "./productList";
import { BiCategory, BiListUl } from "react-icons/bi";
import ProductAddDialog from "./productAddDialog";
import ProductInventory from "./ProductInventory";
import ProductWait from "./productWait";


const Product = () => {
    const [query, setQuery] = useState('');
    const [debounceQuery, setDebounceQuery] = useState('');
    const [debounceCategory, setDebounceCategory] = useState('');
    const [debounceManuFacture, setDebounceManuFacture] = useState('');
    const [isOpen,setIsOpen] = useState(false);
    const [isOpenDetail,setIsOpenDetail] = useState(false);
    const [isOpenWait,setIsOpenWait] = useState(false);
    const [refetch, setRefetch] = useState(false); 

   
    const [box,setBox]=useState('item');
    const { data: product,loading,refetch: refetchData } = useFetchData(
        `${BASE_URL}/product?query=${debounceQuery}&categoryName=${debounceCategory}&manuFactureName=${debounceManuFacture} `,refetch
    );
    const { data: category } = useFetchData(`${BASE_URL}/category`);
    const { data: manuFacture } = useFetchData(`${BASE_URL}/manuFacture`);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounceQuery(query);
            setDebounceCategory(category);
            setDebounceManuFacture(manuFacture);
        }, 900);
        return () => clearTimeout(timeout);
    }, [query, category, manuFacture]);
    useEffect(() => {
        if (!loading && refetch) {
            refetchData();
            setRefetch(false);  // Reset refetch state
        }
    }, [loading, refetch, refetchData]);

   
    return (
        <div>
            <div className="text-left p-5 w-1/3 flex gap-2 cursor-pointer">
                <img src={whouse} className="w-6 h-6" alt="" />
                <Link to={`/warehouse/product`} className="heading ">Quản Lý Sản Phẩm</Link>

            </div>
            <div className="flex items-center gap-3 px-10 pb-5 mb-5 border-b-[20px] border-blue-500">
                <div className="border border-gray-500 hover:bg-slate-200 py-2 px-3 rounded-md cursor-pointer" onClick={()=>setIsOpen(true)}>Thêm</div>
                <div className="border border-gray-500 hover:bg-slate-200 py-2 px-3 rounded-md cursor-pointer"  onClick={()=>setIsOpenDetail(true)}>Danh sách tồn</div>
                <div className="border border-gray-500 hover:bg-slate-200 py-2 px-3 rounded-md cursor-pointer"  onClick={()=>setIsOpenWait(true)}>Danh sách chờ</div>
            </div>
            <div>
                <div >
                    
                    <div className="w-1/2 mx-auto">
                        <div className="grid grid-cols-5 gap-2 items-center mb-2">
                            <div className="col-span-1 text-end">
                                Danh mục:
                            </div>
                            <div className="flex gap-2 col-span-4">
                                <select
                                    name="category"
                                    onChange={e => setDebounceCategory(e.target.value)}
                                    className="text-textColor w-full font-semibold text-[15px] cursor-pointer leading-7 px-4 py-2 focus:outline-none border border-slate-500 rounded-lg"
                                >
                                    <option value="">Danh mục</option>
                                    {category.map(item => (
                                        <option key={item._id} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-5 gap-2 items-center" >
                        <div className="col-span-1 text-end">
                                Nhà phân phối:
                            </div>


                            <div className="flex gap-2 col-span-4">
                                <select
                                    name="manuFacture"
                                    onChange={e => setDebounceManuFacture(e.target.value)}
                                    className="text-textColor w-full mb-5 font-semibold text-[15px] leading-7 px-4 py-2 focus:outline-none border border-slate-500 rounded-lg"
                                >
                                    <option value="">Hãng</option>
                                    {manuFacture.map(item => (
                                        <option key={item._id} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-between items-center bg-primaryColor">
                        <div className="flex justify-center items-center  rounded-lg bg-slate-200 text-slate-500 border border-gray-500 text-[20px] ml-5">
                            <div onClick={()=>setBox('item')} className={`${box==='item' ? ' bg-white text-black' :'shadow-[inset_-12px_-8px_40px_#46464620]'} p-2 rounded-l-lg`}>

                        <BiCategory />
                            </div>
                            <div onClick={()=>setBox('list')} className={`${box==='list' ? ' bg-white text-black' :'shadow-[inset_-12px_-8px_40px_#46464620]'} p-2 rounded-r-lg`}>

                            <BiListUl />

                            </div>
                        </div>
                        <div className="relative w-full max-w-lg">
                            <button className="absolute top-1/2 left-3 transform -translate-y-1/2 text-white">
                                <FaSearch />
                            </button>
                            <input
                                type="search"
                                placeholder="Tìm kiếm..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                className="w-full p-2 pl-10  bg-primaryColor text-white  focus:outline-none"
                            />
                            
                        </div>
                    </div>
                </div>
                {
                    box === 'item' ? 
                <div className="grid grid-cols-4 gap-3 m-10 mx-[210px]">
                    {
                        product.map(pro =>(
                            <ProductItem key={pro._id} products={pro} setRefetch={setRefetch} />

                        ))
                    }
                </div>:
                 <div className="grid grid-cols-2 gap-3 m-10 mx-[210px]">
                 {
                     product.map(pro =>(
                         <ProductList key={pro._id} products={pro} />

                     ))
                 }
             </div>
                }
            </div>
            <ProductAddDialog
                open={isOpen}
                handleClose={()=>setIsOpen(false)}
                
                
            />
            <ProductInventory
                open={isOpenDetail}
                handleClose={()=>setIsOpenDetail(false)}
                
                
            />
            <ProductWait
                open={isOpenWait}
                handleClose={()=>setIsOpenWait(false)}
            />
        </div>
    );
}

export default Product;
