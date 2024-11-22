/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useContext, useState, useEffect, useMemo } from "react";
import { authContext } from "../context/AuthContext";
import useFetchData from "../Hook/userFecthData";
import { BASE_URL } from "../../config";
import cartLogo from "../assets/images/cartLogo.png";
import { Link, useNavigate } from "react-router-dom";
import FormatPrice from "../utils/formatPrice";
import { toast } from "react-toastify";

const Cart = () => {
    const { user } = useContext(authContext); // Lấy user từ context

    const { data: carts } = user && user._id
        ? useFetchData(`${BASE_URL}/cart/${user._id}`)
        : { data: [] };

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [cartProducts, setCartProducts] = useState([]);
    const [isFixed, setIsFixed] = useState(false); // Trạng thái cố định thanh công cụ
    const navigate = useNavigate();

    useEffect(() => {
        if (carts?.products) {
            setCartProducts(carts.products);
        }
    }, [carts]);

    // Xử lý cuộn để chuyển đổi trạng thái của thanh công cụ
    useEffect(() => {
        const handleScroll = () => {
            const mainContent = document.getElementById("main-content");
            if (!mainContent) return;

            const contentBottom = mainContent.getBoundingClientRect().bottom;
            // console.log(viewportHeight)

            // Nếu bảng vẫn trong khung nhìn => trạng thái cố định
            setIsFixed(contentBottom <= 100);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSelectProduct = (productId) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.includes(productId)
                ? prevSelected.filter((id) => id !== productId)
                : [...prevSelected, productId]
        );
    };

    const handleSelectAll = () => {
        if (selectedProducts.length === cartProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(cartProducts.map((item) => item.product._id));
        }
    };

    const handleQuantityChange = async (index, change) => {
        const updatedProducts = [...cartProducts];
        const productId = updatedProducts[index].product._id;
        const newQuantity = updatedProducts[index].quantity + change;

        if (newQuantity > 0) {
            updatedProducts[index].quantity = newQuantity;
            setCartProducts(updatedProducts);

            try {
                const res = await fetch(`${BASE_URL}/cart/${user._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        quantity: newQuantity,
                        productId: productId,
                    }),
                });

                const result = await res.json();

                if (!res.ok) {
                    throw new Error(result.message);
                }
                toast.success(result.message);
            } catch (error) {
                toast.error(error.message);
                console.error("Lỗi khi cập nhật số lượng trong CSDL:", error);
            }
        }
    };

    const handleRemoveProduct = async (productId) => {
        setCartProducts(cartProducts.filter((item) => item.product._id !== productId));
        setSelectedProducts(selectedProducts.filter((id) => id !== productId));

        try {
            const res = await fetch(`${BASE_URL}/cart/${user._id}/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }
            toast.success(result.message);
        } catch (error) {
            toast.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng.");
        }
    };
    const handleRemoveAllSelected = async () => {
        // Xóa tất cả các sản phẩm đã chọn khỏi giỏ hàng
        try {
            for (let productId of selectedProducts) {
                const res = await fetch(`${BASE_URL}/cart/${user._id}/${productId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ productId }),
                });

                const result = await res.json();

                if (!res.ok) {
                    throw new Error(result.message);
                }
            }

            // Cập nhật giỏ hàng và bỏ chọn tất cả sản phẩm
            setCartProducts(cartProducts.filter(item => !selectedProducts.includes(item.product._id)));
            setSelectedProducts([]);
            toast.success("Đã xóa tất cả sản phẩm đã chọn!");
        } catch (error) {
            toast.error("Lỗi khi xóa tất cả sản phẩm đã chọn.");
        }
    };

    const getTotalAmount = () => {
        return cartProducts.reduce((total, item) => {
            return selectedProducts.includes(item.product._id)
                ? total + (item.product.price * (1 - (item.product.discount / 100))) * item.quantity
                : total;
        }, 0);
    };

    const getTotalQuantity = () => {
        return cartProducts.reduce((total, item) => {
            return selectedProducts.includes(item.product._id) ? total + item.quantity : total;
        }, 0);
    };
    const products = useMemo(() => 
        cartProducts.filter(pro => 
            selectedProducts.some(selected => selected === pro.product._id)
        ),
        [cartProducts, selectedProducts] // Dependencies for recalculation
    );

    const handleProceedToCheckout = () => {
        if (selectedProducts.length === 0) {
            toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
            return;
        }

        if (cartProducts.length === 0) {
            toast.error("Giỏ hàng của bạn trống, vui lòng thêm sản phẩm vào giỏ hàng!");
            return;
        }

        navigate("/checkout", {
            state: {
                products
            },
        });
    };

    return (
        <div className="container mx-auto pt-8 bg-gray-50">
            {cartProducts.length > 0 ? (
                <div className="flex flex-col">
                    <div className="overflow-x-auto mb-10">
                        <table
                            className="w-3/4 mx-auto text-sm mt-5 text-center "
                            id="main-content"

                        >
                            <thead className="text-[16px] bg-white rounded-sm mb-3">
                                <tr>
                                    <th className="p-4">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={selectedProducts.length === cartProducts.length}
                                        />
                                    </th>
                                    <th className="px-3 py-3">Sản Phẩm</th>
                                    <th className="px-3 py-3">Đơn Giá</th>
                                    <th className="px-3 py-3">Số Lượng</th>
                                    <th className="px-3 py-3">Số Tiền</th>
                                    <th className="px-3 py-3">Thao Tác</th>
                                </tr>
                                {/* <tr>
                                    <th className="bg-gray-50"></th>

                                </tr> */}
                            </thead>
                            <tbody className="text-[16px] bg-white rounded-sm">
                                {cartProducts.map((item, index) => (
                                    <tr key={item.product._id} className="border-t">
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                onChange={() => handleSelectProduct(item.product._id)}
                                                checked={selectedProducts.includes(item.product._id)}
                                            />
                                        </td>
                                        <td className="p-4 flex items-center gap-4">
                                            <img
                                                src={item.product.photo}
                                                alt={item.product.name}
                                                className="w-[50px] h-[50px] object-cover rounded"
                                            />
                                            <span className="truncate w-[200px]">{item.product.name}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {item.product.discount > 0 ? (
                                                <div>
                                                    {/* Giá cũ và giá giảm */}
                                                    <span className="line-through text-gray-500">
                                                        <sup>đ</sup>{FormatPrice(item.product.price)}
                                                    </span>
                                                    <span className="ml-2 text-red-600">
                                                        <sup>đ</sup>{FormatPrice(item.product.price * (1 - item.product.discount / 100))}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div>
                                                    <sup>đ</sup>{FormatPrice(item.product.price)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="flex items-center justify-center text-center">
                                            <button
                                                className="px-2 py-1 border border-gray-300 rounded-md"
                                                onClick={() => handleQuantityChange(index, -1)}
                                            >
                                                -
                                            </button>
                                            <span className="m-2">{item.quantity}</span>
                                            <button
                                                className="px-2 py-1 border border-gray-300 rounded-md"
                                                onClick={() => handleQuantityChange(index, 1)}
                                            >
                                                +
                                            </button>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span >
                                                <sup>đ</sup>
                                                {FormatPrice((item.product.price * (1 - (item.product.discount / 100))) * item.quantity)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleRemoveProduct(item.product._id)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="w-[1130px] items-center mx-auto">
                        <div
                            className={`w-full mx-auto bg-white shadow-md ${isFixed ? "fixed bottom-0 z-10" : "relative mt-5"
                                }`}
                            id="footer-section"
                        >
                            <div className="mt-4 flex justify-between ">
                                <div className="flex items-center gap-3">
                                    <div className="px-3 flex gap-2 items-center justify-center">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={selectedProducts.length === cartProducts.length}
                                            className="w-4 h-4 cursor-pointer"
                                        />
                                        <p>Chọn tất cả ({cartProducts.length})</p>
                                    </div>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={handleRemoveAllSelected}
                                    >
                                        Xóa
                                    </button>
                                </div>
                                <div className="flex items-center justify-center">
                                    <div>
                                        <span className="text-lg font-semibold">
                                            Tổng Tiền ({getTotalQuantity()} sản phẩm):
                                        </span>
                                        <span className="text-lg font-semibold mx-2 text-red-500">
                                            <sup>đ</sup>{FormatPrice(getTotalAmount())}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleProceedToCheckout}
                                        className={`bg-orange-500 text-white px-5 py-3 rounded-md hover:bg-orange-700 ml-4 ${selectedProducts.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                        disabled={selectedProducts.length === 0}
                                    >
                                        Thanh Toán
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[600px]">
                    <img src={cartLogo} alt="Empty Cart" className="w-24 h-24" />
                    <p className="text-[18px] mt-4">Không có sản phẩm nào trong giỏ hàng.</p>
                    <Link
                        to="/"
                        className="bg-sky-400 px-5 py-3 mt-5 text-white rounded-md hover:bg-sky-600"
                    >
                        Tiếp Tục Mua Sắm
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Cart;

