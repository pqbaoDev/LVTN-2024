import { useEffect, useState } from "react";
import { BASE_URL } from "../../config";
import useFetchData from "../Hook/userFecthData";
import { FaSearch } from "react-icons/fa";
import { RiDiscountPercentLine } from "react-icons/ri";
import miniLogo from "../assets/images/miniLogo.png";
import Loading from "../components/Loader/Loading";
import Error from "../components/Error/Error";
import VoucherCard from "../components/voucher/voucherCard";


const Voucher = () => {
    const [debounceQuery,setDebounceQuery] = useState('');
    const {data:voucher,loading,error} = useFetchData(`${BASE_URL}/promotion?query=${debounceQuery}`)
    const [query,setQuery] = useState(' ');
    useEffect(()=>{
        const timeOut = setTimeout(()=>{
            setDebounceQuery(query);
        },700);
        return ()=>clearTimeout(timeOut);
    },[query])
    console.log(voucher)
    return (
        <div className="container bg-slate-50">
            <div className="mx-[250px] py-5">
            <div className=" justify-between items-center flex p-5 bg-[#DC586D] rounded-md">
                <div className="text-white font-bold text-[22px] flex justify-center items-center gap-3">
                    <div className="w-[50px] rounded-full p-2 bg-white">

                    <img src={miniLogo} className="w-20px" alt="" />
                    </div>

                    <h2>Voucher Khuyến Mãi</h2>
                    <sup className="text-[24px]">
                    <RiDiscountPercentLine />
                    </sup>
                </div>
                    <div className="relative w-1/3 max-w-lg">
                        <input
                            type="search"
                            placeholder="Tìm kiếm voucher..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="w-full p-2 pl-10 border rounded-xl text-black border-gray-300 focus:outline-none"
                        />
                        <button className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
                            <FaSearch />
                        </button>
                    </div>
                   
                </div>
                <div className="mt-5">
                    {loading && <Loading />}
                    {error && <Error />}
                    {!error && !loading && (
                        
                        <VoucherCard voucher={(voucher || []).filter(vou => vou.status === 'active')} />

                    
                    )}


                </div>
            </div>
        </div>
    );
}

export default Voucher;
