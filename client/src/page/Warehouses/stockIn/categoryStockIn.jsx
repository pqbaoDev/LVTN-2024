import { BASE_URL } from "../../../../config";
import useFetchData from "../../../Hook/userFecthData";

const CategoryStockIn = () => {
    const {data:stockIn} = useFetchData(`${BASE_URL}/stockIn/`)
    return (
        <div>
            Hello
        </div>
    );
}

export default CategoryStockIn;
