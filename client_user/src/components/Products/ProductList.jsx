/* eslint-disable react/prop-types */
import useFetchData from "../../../../client/src/Hook/userFecthData";
import { BASE_URL } from "../../../config";
import Loader from '../../components/Loader/Loading.jsx';
import Error from '../../components/Error/Error.jsx';
import ProductCard from "./ProductCard";
import { useMemo } from "react";



const ProductList = ({filter}) => {
    const {data:products,loading,error} = useFetchData(`${BASE_URL}/product`);
    const { data: viewed } = useFetchData(`${BASE_URL}/product/viewed`);
    const productFilter = useMemo(() => {
      if (filter === 'sale') {
        return products.filter((pro) => pro?.discount > 0);
      } else if (filter === 'forU' && viewed?.products?.length > 0) {
        const viewedNames = new Set(viewed.products.map((item) => item.product?.name));
        console.log(viewedNames)
        return products.filter((pro) => viewedNames.has(pro.name));
      }
      // Hiển thị toàn bộ sản phẩm nếu không có điều kiện
      return products;
    }, [filter, products, viewed]);
    
   
    
    return (
        <>
            {loading && <Loader />}
            {error && <Error /> }
            {
                !error && !loading &&(
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {
                             productFilter?.map((product)=>(
                                <ProductCard key={product._id} products={product} />
                            ))
                        }
                    </div>
                )
            }
            
        </>
    );
}

export default ProductList;
