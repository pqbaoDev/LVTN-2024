/* eslint-disable react/prop-types */

import { FaCartPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import FormatPrice from "../../utils/formatPrice";

const Cart = ({ carts }) => {
  const hasProducts = Array.isArray(carts?.products) && carts?.products.length > 0;
  const productTrue = hasProducts ? carts.products.filter(car => car.product.alt === 'true' || car.product.alt === true) : [];
   

    return (
        <div className="z-50">
            <h2 className="text-slate-300 font-semibold px-5 leading-5 pt-5 mb-3">Sản phẩm mới thêm</h2>

            {hasProducts ? (
                <div>
                    {productTrue?.slice(0, 5).map(({ product, _id }) => (
                        <div key={_id} className="px-5 leading-[62px] hover:bg-gray-100 flex items-center justify-center gap-3">
                            <div className="w-[70px] border border-slate-200 p-2">
                                {
                                    product.photo.slice(0,1).map((pho,idx)=>(
                                        <img key={idx} src={pho} alt={product?.name} />

                                    ))
                                }
                            </div>
                            <p className="w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">{product?.name}</p>

                            <div className="flex text-red-500 items-center justify-center">
                                <sup>đ</sup>
                                <p>{FormatPrice(product?.price)}</p>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-between mx-5 items-center">
                        <p>{productTrue?.length} sản phẩm trong giỏ hàng</p>
                        <Link to='/cart'>
                            <div className="border rounded-lg px-3 bg-sky-500 text-white">
                                <p className="leading-9">Xem giỏ hàng</p>
                            </div>
                        </Link>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex-col">
                        <div className="text-[80px] mx-auto mt-8 border rounded-full w-[150px] h-[150px] p-7 bg-white text-center items-center">
                            <FaCartPlus />
                        </div>
                        <p className="text-center leading-7 font-extrabold mb-8">Không có sản phẩm nào trong giỏ hàng!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
