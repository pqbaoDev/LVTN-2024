/* eslint-disable react/no-unknown-property */
import { useLocation } from "react-router-dom";
import useFetchData from "../../../../client/src/Hook/userFecthData";
import { BASE_URL } from "../../../config";
import { useState, useMemo } from "react";
import { CiFilter } from "react-icons/ci";
import ProductCard from "../../components/Products/ProductCard";

const Products = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [isOpen, setIsOpen] = useState(false);
    const [filter,setFilter] = useState('')

    const toggleMenu = () => setIsOpen(!isOpen);
    const category = queryParams.get('category');

    const { data: products = [] } = useFetchData(`${BASE_URL}/product/category?categories=${category}`);
    console.log(products)
    const { data: manuFacture = [] } = useFetchData(`${BASE_URL}/manuFacture`);

    const [brand, setBrand] = useState(null);

    // Lọc danh sách các thương hiệu có sản phẩm thuộc category
    const filteredBrands = useMemo(() => {
        const brandsWithProducts = products.map(product => product.manuFacture.name);
        return manuFacture.filter(bra => brandsWithProducts.includes(bra.name));
    }, [products, manuFacture]);

    // Lọc sản phẩm theo thương hiệu được chọn
    const filteredProducts = useMemo(() => {
        let filtered = brand
            ? products.filter(product => product.manuFacture.name === brand)
            : products;
    
            switch (filter) {
                case 'asc':
                    filtered = filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'desc':
                    filtered = filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'discount':
                    filtered = filtered.filter(dis=>dis.discount > 0).sort((a,b)=>a.price - b.price);
                    break;
                case 'hot':
                        filtered = filtered.filter(hot=>hot.care > 0).sort((a,b)=> b.care - a.care);
                        break;

                default:
                    break; // Không cần sắp xếp nếu filter không khớp
            }
    
        return filtered;
    }, [products, brand, filter]);
    

    return (
        <div className="container bg-gray-50 p-5">
            <div className="bg-white rounded-md w-[1210px] mx-auto p-5">
                <div className="flex justify-start items-center gap-3">
                    <div className="flex justify-center items-center px-3 py-2 border rounded-md border-indigo-500 gap-1 text-indigo-500 cursor-pointer">
                        <CiFilter />
                        <span>Lọc</span>
                    </div>

                    {filteredBrands.map(bra => (
                        <div key={bra._id}>
                            <div
                                onClick={() => setBrand(bra.name)}
                                className="w-[107px] bg-slate-400 rounded-md p-2 text-center cursor-pointer hover:bg-slate-300"
                            >
                                {/* <img src={bra.photo} alt="" /> */}
                                <p>{bra.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-start items-center gap-7 py-5">
                    <div>
                        Sắp xếp theo:
                    </div>
                    <p onClick={()=>setFilter('hot')} className={`${filter === 'hot'?'text-primaryColor':'text-black'} cursor-pointer`}>Nổi bật</p>
                    <p onClick={()=>setFilter('sellwell')} className={`${filter === 'sellwell'?'text-primaryColor':'text-black'} cursor-pointer`}>Bán chạy</p>
                    <p onClick={()=>setFilter('discount')} className={`${filter === 'discount'?'text-primaryColor':'text-black'} cursor-pointer`}>Giảm giá</p>
                    <div className="relative inline-block text-left">
                        <div>
                            <button
                                type="button"
                                className={`flex w-full inset-0 justify-center gap-x-1.5 rounded-md py-2 text-sm ${filter === 'asc' || filter === 'desc' ? 'text-primaryColor':'text-black'}`}
                                onClick={toggleMenu}
                                aria-expanded={isOpen}
                                aria-haspopup="true"
                            >
                                {filter  === 'asc' ? 'Giá thấp - cao':filter ? 'Giá cao - thấp' : 'Giá'}
                                <svg
                                    className={`-mr-1 size-5 text-gray-400 ${!isOpen ? "rotate-180" : ""}`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>

                        {isOpen && (
                            <div
                                className="absolute right-0 z-10 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                                role="menu"
                                aria-orientation="vertical"
                            >
                                <div className="py-1" role="none">
                                    <div onClick={()=>setFilter('asc')} className="block cursor-pointer px-4 py-2 text-sm text-gray-700" role="menuitem">
                                        Giá thấp - cao
                                    </div>
                                    <div onClick={()=>setFilter('desc')} className="block cursor-pointer px-4 py-2 text-sm text-gray-700" role="menuitem">
                                        Giá cao - thấp
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {filteredProducts.map(product => (
                        <ProductCard key={product._id} products={product} />

                    ))}
                </div>
            </div>

            {/* Hiển thị sản phẩm */}
        </div>
    );
};

export default Products;
