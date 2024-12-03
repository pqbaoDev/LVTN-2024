import { useMemo, useState, useEffect } from "react";
import { Carousel } from "@material-tailwind/react";
import { useLocation } from "react-router-dom";
import useFetchData from "../../Hook/userFecthData";
import { BASE_URL } from "../../../config";
import FormatPrice from "../../utils/formatPrice";
import { FaCartPlus } from "react-icons/fa";
import Review from "../../components/review/review";

const ProductDetail = () => {
  const { state } = useLocation();
  const { products } = state || {};
  const [quantity, setQuantity] = useState(1);
  const { data: AllProduct = [] } = useFetchData(`${BASE_URL}/product`);
  const [getSize, setGetSize] = useState(products?.size || "");
  const [getColor, setGetColor] = useState(products?.color || {});

  const productSameName = AllProduct.filter(pro => pro.name === products?.name);

  // Lấy danh sách kích thước
  const productSizes = [...new Set(productSameName.map(pro => pro.size))];

  // Lấy danh sách màu dựa trên kích thước
  const productColors = useMemo(() => {
    if (getSize) {
      const filteredBySize = productSameName.filter(pro => pro.size === getSize);
      return [...new Set(filteredBySize.map(pro => pro.color))];
    }
    return [...new Set(productSameName.map(pro => pro.color))];
  }, [productSameName, getSize]);

  // Lọc sản phẩm theo kích thước và màu sắc
  const productfilter = useMemo(() => {
    let product = products; 
    if (getSize) {
      product = productSameName.filter((pro) => pro.size === getSize);
    }
    if (getColor?.hex) {
      product = product.filter(pro => pro.color.hex === getColor.hex); // So sánh hex của color
    }
    return product.length > 0 ? product[0] : products; // Trả về sản phẩm đầu tiên hoặc mặc định là `products`
  }, [productSameName, products, getSize, getColor]);

  const currentProduct = Array.isArray(productfilter) ? productfilter[0] : productfilter;
  
  useEffect(() => {
    if (getSize) {
      const filteredBySize = productSameName.filter(pro => pro.size === getSize);

      // Cập nhật màu sắc chỉ khi có sự thay đổi màu
      if (filteredBySize.length > 0 && filteredBySize[0]?.color?.hex && filteredBySize[0]?.color?.hex !== getColor?.hex) {
        setGetColor(filteredBySize[0].color);
      }
    }
  }, [getSize, productSameName, getColor?.hex]); // Sử dụng `getColor?.hex` làm điều kiện dừng

  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1); // Tăng số lượng
  };

  const decreaseQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1)); // Giảm số lượng, đảm bảo không giảm dưới 1
  };

  return (
    <div className="bg-gray-50">
      <div className=" mx-[159px]">
        <div className="text-[18px] font-bold py-5">
          {/* Fallback if the properties are undefined */}
          {currentProduct?.category?.name || 'Category'} {currentProduct?.name || 'Product Name'} {currentProduct?.size || 'Size'}
        </div>
        <div className="grid grid-cols-3 gap-3 relative">
          <div className="col-span-2 flex flex-col rounded-lg items-center bg-white p-5">
            <Carousel
              navigation={({ setActiveIndex, activeIndex }) => (
                <div className=" absolute bottom-0 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                  {/* Loop through the product's photos (if it's an array) */}
                  {currentProduct?.photo?.slice(1).map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`Slide ${idx + 1}`}
                      className={`h-14 w-14 cursor-pointer border-2 transition-all ${activeIndex === idx ? "border-white opacity-100" : "border-gray-300 bg-gray-300 opacity-50"}`}
                      onClick={() => setActiveIndex(idx)}
                    />
                  ))}
                </div>
              )}
            >
              {currentProduct?.photo?.slice(1).map((photo, idx) => (
                <div key={idx} className="max-h-[380px] max-w-[569px] mx-auto">
                  <img
                    src={photo}
                    alt={`Main image ${idx + 1}`}
                    className="max-h-[380px] max-w-[569px] mx-auto"
                  />
                </div>
              ))}
            </Carousel>
          </div>
          <div className="col-span-1 bg-white rounded-lg h-full">
            <div className="flex items-center gap-3 p-4 h-[80px]">
              {productSizes.map((item, index) => (
                <div key={index}>
                  <div onClick={() => setGetSize(item)} className={`${getSize === item ? 'border-indigo-500 text-indigo-500' : 'border-gray-300 '} px-3 py-2 border rounded-md hover:text-indigo-500 hover:border-indigo-500 cursor-pointer`}>
                    {item}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 p-4">

            {productColors.map((color, index) => (
               
                color.hex && color.name ? (
                    <div
                        key={index}
                        onClick={() => setGetColor(color)} 
                        className={`flex gap-2 border rounded-3xl px-2 py-1 items-center text-[16px] cursor-pointer 
                        ${getColor.hex === color.hex ? "bg-indigo-50 text-indigo-500 border-indigo-600" : "border-slate-300"}`}
                    >
                        <div
                            className="w-4 h-4 rounded-full cursor-pointer"
                            style={{ backgroundColor: color.hex }}
                            title={color.name} 
                        ></div>
                        <span>{color.name}</span>
                    </div>
                ) : null 
            ))}
            </div>

            <div className="px-5 mb-5">
              <span>Giá:</span>
              {
                currentProduct.discount > 0 ? (
                  <div className="flex gap-2 items-center">
                    <div className="text-[18px] text-red-500 font-bold">{FormatPrice(currentProduct.price * (1 - currentProduct.discount / 100))} <sup className="underline">đ</sup></div>
                    <div className="text-[16px] text-gray-300 font-bold line-through">{FormatPrice(currentProduct.price)} <sup className="underline">đ</sup></div>
                    <div className="text-[18px] text-red-500 ">{currentProduct.discount}%</div>
                  </div>
                ) : (
                  <div className="text-[18px] text-red-500 font-bold">{FormatPrice(currentProduct.price)} <sup className="underline">đ</sup></div>
                )
              }
            </div>
            <div className="px-5 mb-5 flex items-center gap-4">
              <div className="text-[18px] font-normal ">Số lượng:</div>
              <div className="flex items-center justify-around px-2 gap-4 border border-slate-400 p-1 rounded-lg w-[90px]">
                <button
                  onClick={decreaseQuantity}
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span> {/* Hiển thị số lượng */}
                <button
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mx-2 mb-5">
              <button className=" p-1  text-center border border-indigo-500 text-indigo-500 rounded-lg">
                <div className="flex items-center justify-center">
                  <FaCartPlus />
                </div>
                  Thêm vào giỏ
              </button>
              <button className=" p-1  text-center bg-orange-500 text-white rounded-lg">
                Mua ngày
              </button>
            </div>
            <div className="mx-2">
              <button className="text-center py-3 rounded-lg w-full border border-gray-600">
                Liên hệ shop
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg mt-5 p-10">
          <h2 className="text-[20px] font-semibold mb-8">Đánh giá {currentProduct.name} {currentProduct.size}</h2>
          <div>
          <Review reviews={currentProduct.reviews} productId={currentProduct._id} totalRating={currentProduct.totalRating} averageRating={currentProduct.averageRating}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
