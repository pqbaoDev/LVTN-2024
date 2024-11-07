
import { Link } from "react-router-dom";
import Location from "./location/location";
import whouse from '../../assets/images/whouse.png';


const Warehouse = () => {
    return (
        <div>
           <div className="text-left p-5 w-1/3 flex gap-2 cursor-pointer">
                <img src={whouse} className="w-6 h-6" alt="" />
                <Link to={`/warehouse`} className="heading w-[150px]">Quản lý Kho</Link>
                
            </div>
            <div className="mt-5">
            <Location />

            </div>
            
        </div>
    );
}

export default Warehouse;
