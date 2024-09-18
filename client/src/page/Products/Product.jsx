import ProductTable from "./ProductTable";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import useFetchData from "../../Hook/userFecthData";
import { BASE_URL } from "../../../config";
import { FaSearch } from "react-icons/fa";
import filterIcon from "../../assets/images/filterIcon.png";
import { useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import ProductAddDialog from "./ProductAddDialog";
import CategoryAddDialog from "./categoryAddDialog";

const Product = () => {
    const [query, setQuery] = useState('');
    const [openProductAdd, setOpenProductAdd] = useState(false);
    const [openCategoryAdd, setOpenCategoryAdd] = useState(false);
    const [debounceQuery, setDebounceQuery] = useState('');
    const [debounceCategory, setDebounceCategory] = useState('');
    const [debounceManuFacture, setDebounceManuFacture] = useState('');

    // Fetch data with debounced values
    const { data: product, loading, error } = useFetchData(
        `${BASE_URL}/product?query=${debounceQuery}&categoryName=${debounceCategory}&manuFactureName=${debounceManuFacture}`
    );
    const { data: category } = useFetchData(`${BASE_URL}/category`);
    const { data: manuFacture } = useFetchData(`${BASE_URL}/manuFacture`);

    // Handle dialog open/close
    const handleOpenProductAdd = () => setOpenProductAdd(true);
    const handleCloseProductAdd = () => setOpenProductAdd(false);

    const handleOpenCategoryAdd = () => setOpenCategoryAdd(true);
    const handleCloseCategoryAdd = () => setOpenCategoryAdd(false);

    // Debounce search query
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounceQuery(query);
        }, 500);
        return () => clearTimeout(timeout);
    }, [query]);

    // Debounce for category and manuFacture
    useEffect(() => {
        const timeoutCategory = setTimeout(() => {
            setDebounceCategory(debounceCategory);
        }, 500);
        return () => clearTimeout(timeoutCategory);
    }, [debounceCategory]);

    useEffect(() => {
        const timeoutManuFacture = setTimeout(() => {
            setDebounceManuFacture(debounceManuFacture);
        }, 500);
        return () => clearTimeout(timeoutManuFacture);
    }, [debounceManuFacture]);

    return (
        <>
            <section className="py-0 px-5 pt-4 flex justify-between">
                <div className="text-left">
                    <h2 className="heading">Quản lý Sản phẩm</h2>
                </div>
                <div className="w-1/3 justify-end flex">
                    <div className="relative w-full max-w-lg">
                        <input
                            type="search"
                            placeholder="Tìm kiếm..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="w-full p-2 pl-10 border rounded-xl border-gray-300 focus:outline-none"
                        />
                        <button className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
                            <FaSearch />
                        </button>
                    </div>
                    <div className="pt-3 text-slate-500 px-5">
                        <img src={filterIcon} className="w-6 h-6" alt="Filter" />
                    </div>
                </div>
            </section>
            <div className="flex justify-between">
                <div className="ml-1 mb-3">
                    <button
                        onClick={handleOpenProductAdd}
                        className="mx-4 btn focus:outline-none flex items-center border rounded-md py-2 px-2 gap-1"
                        aria-label="Add Product"
                    >
                        <FaPlusCircle />
                        <span className="font-semibold text-[18px]">Thêm Sản phẩm</span>
                    </button>
                </div>
                <div className="flex justify-between items-center gap-8 mr-8 mt-5 pb-0">
                    <select
                        name="category"
                        onChange={e => setDebounceCategory(e.target.value)}
                        className="text-textColor font-semibold text-[15px] cursor-pointer leading-7 px-4 py-2 focus:outline-none border border-slate-500 rounded-lg"
                    >
                        <option value="">Danh mục</option>
                        {category.map(item => (
                            <option key={item._id} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                        <option
                            onClick={handleOpenCategoryAdd}
                            className="text-slate-300"
                        >
                            Thêm..
                        </option>
                    </select>
                    <select
                        name="manuFacture"
                        onChange={e => setDebounceManuFacture(e.target.value)}
                        className="text-textColor font-semibold text-[15px] leading-7 px-4 py-2 focus:outline-none border border-slate-500 rounded-lg"
                    >
                        <option value="">Hãng</option>
                        {manuFacture.map(item => (
                            <option key={item._id} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                        <option
                            onClick={handleOpenProductAdd}
                            className="text-slate-300"
                        >
                            Thêm..
                        </option>
                    </select>
                </div>
            </div>
            <section className="p-0">
                <div className="mt-1">
                    {loading && <Loading />}
                    {error && <Error message="Có lỗi xảy ra khi lấy dữ liệu sản phẩm" />}
                    {!loading && !error && (
                        <div>
                            {product.length > 0 ? (
                                <ProductTable products={product} />
                            ) : (
                                <p className="text-center text-gray-500">Không có sản phẩm nào được tìm thấy.</p>
                            )}
                        </div>
                    )}
                </div>
            </section>
            <ProductAddDialog
                open={openProductAdd}
                handleClose={handleCloseProductAdd}
                size="lg"
                position="center"
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
            />
            <CategoryAddDialog
                open={openCategoryAdd}
                handleClose={handleCloseCategoryAdd}
                size="lg"
                position="center"
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
            />
        </>
    );
}

export default Product;
