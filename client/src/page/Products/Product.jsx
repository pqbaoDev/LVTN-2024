import ProductTable from "./ProductTable";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import useFecthData from "../../Hook/userFecthData";
import {BASE_URL} from "../../../config";
import { FaSearch } from "react-icons/fa";
import filterIcon from "../../assets/images/filterIcon.png";
import { useState,useEffect } from "react";
const Product = () => {
    const [query,setQuery] =  useState('');
    const [debounceQuery,setDebounceQuery]=useState('');
    const {data:product,loading,error}=useFecthData(`${BASE_URL}/product?query=${debounceQuery}`);

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
        <>
        <section className="py-0 px-5 pt-4 flex justify-between" >
            <div className=" text-left">
            
                <h2 className="heading">Quản lý khách hàng</h2>

            </div>
            <div className="w-1/3 justify-end flex">

                <div className="relative w-full max-w-lg">
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
                <div className="pt-3  text-slate-500 px-5">
                    <img src={filterIcon} className="w-6 h-6" alt="" />
                </div>
                </div>
                
        </section>
        <section className="p-0">
            <div className="mt-1">
            {loading && <Loading/>}
            {error && <Error/>}
            {!loading && !error && <div>

                <ProductTable  products={product} />
            </div>
            
            }
            </div>

        </section>
            
        </>
    );
}

export default Product;
