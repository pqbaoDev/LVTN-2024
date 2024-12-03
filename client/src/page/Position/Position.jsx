import { useEffect } from "react";
import { BASE_URL } from "../../../config";
import useFetchData from "../../Hook/userFecthData";
import { useState } from "react";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import { FaSearch } from "react-icons/fa";
import PositionTable from "./PositionTable";

const Position = () => {
    const [query, setQuery] = useState('');
    const [debounceQuery, setDebounceQuery] = useState('');
    const [refetch,setRefetch]= useState(false)
    const { data:positon,loading,error, refetch: refetchData } = useFetchData(`${BASE_URL}/position?query=${debounceQuery}`,refetch);
    console.log(positon)
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounceQuery(query);
        }, 900);
        return () => clearTimeout(timeout);
    }, [query]);
    useEffect(() => {
        if (!loading && refetch) {
            refetchData();
            setRefetch(false);  // Reset refetch state
        }
    }, [loading, refetch, refetchData]);
    return (
        <div>
            <div className="py-0 px-5 pt-4 grid grid-cols-8">
                <div className="text-left col-span-3">
                    <h2 className="heading">Quản lý Chức Vụ</h2>
                </div>
                <div className="col-span-5 col-start-6">
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
                </div>
            </div>
            <div className="mt-1">
            {loading && <Loading/>}
            {error && <Error/>}
            {!loading && !error && <div>

                <PositionTable  positions={positon} setRefetch={()=>setRefetch(true)} />
            </div>
            
            }
            </div>
            
        </div>
    );
}

export default Position;
