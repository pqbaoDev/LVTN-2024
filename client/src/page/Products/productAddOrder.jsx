/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import userFetchData from "../../Hook/userFecthData";
import { BASE_URL } from "../../../config";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import FormatPrice from "../../utils/formatPrice";
import logo from "../../assets/images/logo.png";

const ProductAddOrder = ({carts,user,handleCart}) => {
  const [query, setQuery] = useState('');
  const [debounceQuery, setDebounceQuery] = useState('');
  const [debounceVoucher, setDebounceVoucher] = useState('');
  const [voucher, setVoucher] = useState('');
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();
  const [cartProducts, setCartProducts] = useState([]);
  // Fetch data giỏ hàng và người dùng
  const { data: users, loading: userLoading, error } = userFetchData(`${BASE_URL}/user?query=${debounceQuery}`);
  const { data: vouchers } = userFetchData(`${BASE_URL}/promotion/voucher/${debounceVoucher}`);


 
  // Debounce cho việc tìm kiếm người dùng
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceQuery(query.trim());
    }, 500);
    return () => clearTimeout(timeout);
  }, [query]);

  // Debounce cho việc tìm kiếm voucher
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceVoucher(voucher.trim());
    }, 500);
    return () => clearTimeout(timeout);
  }, [voucher]);

  // Tính tổng số tiền trước khi giảm giá
  const totalAmountBeforeDiscount = useMemo(() => {
    if (!Array.isArray(carts?.products) || carts.products.length === 0) return 0;
    return carts.products.reduce((total, item) => {
      const price = item.product?.price || 0;
      const discount = item.product?.discount || 0;
      const quantity = Math.max(item.quantity, 0);
      const discountPrice = price * (1 - discount / 100);
      return total + (quantity * discountPrice);
    }, 0);
  }, [carts]);

  // Tính tổng giảm giá của sản phẩm trong giỏ hàng
  const discountOfProduct = useMemo(() => {
    if (!carts?.products) return 0;
    return carts.products.reduce((total, item) => {
      const price = item.product?.price || 0;
      const discount = item.product?.discount || 0;
      return (price * discount / 100) * item.quantity;
    }, 0);
  }, [carts]);

  // Tính tổng giảm giá của voucher
  const [voucherValid, setVoucherValid] = useState(false);
  const discountVoucher = voucherValid ? vouchers.sale : 0;

  let totalSale = discount + discountOfProduct + (discountVoucher || 0);

  // Tính số tiền thanh toán sau khi áp dụng tất cả các giảm giá
  const totalAmountAfterDiscount = useMemo(() => {
    const validDiscount = Math.min(discount, totalAmountBeforeDiscount);
    const voucherDiscount = voucherValid ? vouchers.sale : 0;
    if (voucherDiscount > 0) {
      return totalAmountBeforeDiscount - validDiscount - voucherDiscount;
    } else {
      return totalAmountBeforeDiscount - validDiscount;
    }
  }, [totalAmountBeforeDiscount, discount, vouchers, voucherValid]);

  // Dữ liệu form để gửi lên API
  const [formData, setFormData] = useState({
    products: [],
    userId: '',
    totalAmountAfterDiscount,
    employeeId: user._id,
    discount,
    totalSale,
    promotionId: vouchers?._id,
  });

  // Cập nhật dữ liệu form khi giỏ hàng thay đổi
  useEffect(() => {
    if (carts && carts.products) {
      setFormData(prev => ({
        ...prev,
        products: carts.products.map(item => ({
          productId: item.product._id,
          quantity: item.quantity
        }))
      }));
    }
  }, [carts]);

  // Cập nhật lại dữ liệu form khi có thay đổi về giảm giá, voucher, và tổng số tiền
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      discount,
      totalSale,
      promotionId: vouchers?._id,
      totalAmountAfterDiscount,
    }));
  }, [totalAmountAfterDiscount, discount, totalSale, vouchers]);

  // Cập nhật thông tin người dùng vào form khi tìm thấy 1 người dùng
  useEffect(() => {
    if (users && users.length === 1) {
      setFormData(prev => ({
        ...prev,
        userId: users[0]._id
      }));
    }
  }, [users]);

  // Kiểm tra tính hợp lệ của form
  const isFormValid = useMemo(() => {
    return formData.products.length > 0 && formData.userId !== '';
  }, [formData]);

  // Xử lý khi người dùng submit form
  const submitHandler = useCallback(async (event) => {
    event.preventDefault();

    // Kiểm tra tính hợp lệ của form
    if (!isFormValid) {
      toast.error("Vui lòng chọn sản phẩm và người dùng trước khi đặt hàng.");
      return;
    }

    const shouldPrint = window.confirm("Xác nhận thanh toán?");
    if (shouldPrint) {
      setLoading(true);

      try {
        const response = await fetch(`${BASE_URL}/retail`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            createdAt: new Date().toISOString()
          })
        });

        const { message } = await response.json();
        if (!response.ok) throw new Error(message || "Có lỗi xảy ra.");

        window.print(); // In hóa đơn
        toast.success(message);
        navigate('/product');
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      toast.info("Đơn hàng sẽ không được tạo.");
    }
  }, [formData, isFormValid, navigate]);

  // Xử lý thay đổi giảm giá
  const handleDiscountChange = (e) => {
    const inputValue = Number(e.target.value);
    if (inputValue < 0 || inputValue > totalAmountBeforeDiscount || (users?.[0]?.point - inputValue) < 0) {
      toast.error("Giảm giá không hợp lệ.");
      setDiscount(0);
    } else {
      setDiscount(inputValue);
    }
  };
  useEffect(() => {
    if (carts?.products) {
        setCartProducts(carts.products);
    }
}, [carts]);

  // Xử lý thay đổi voucher
  const handleVoucherChange = async (e) => {
    const inputValue = e.target.value;
    setVoucher(inputValue);
    setVoucherValid(inputValue ? true : false);
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
            handleCart();
        } catch (error) {
            toast.error('Số lượng sản phẩm không đủ');
            console.error("Lỗi khi cập nhật số lượng trong CSDL:", error);
        }
    }
};
const handleRemoveProduct = async (productId) => {
    setCartProducts(cartProducts.filter((item) => item.product._id !== productId));
    // setSelectedProducts(selectedProducts.filter((id) => id !== productId));

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
        handleCart();
    } catch (error) {
        toast.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng.");
    }
};

  // Xử lý in hóa đơn
  const handlePrint = () => {
    window.print();
  };

  return (
    <form onSubmit={submitHandler} className="print-section">
      <div className="border-0 border-b-2 pb-2 m-0 border-dashed border-slate-950 items-center mx-auto">
        <div className="relative hidden">
          <img className="w-[216px]" src={logo} alt="Logo" />
          <div className="absolute top-8 left-7 mt-2 text-center w-[216px]">
            <p className='text-[13px]'>Chất lượng thật - Giá trị thật</p>
          </div>
          <h2 className="font-semibold text-[16px] mt-1 text-center">Cửa hàng thiết bị điện tử 2002Store</h2>
          <div>
            <p className="font-normal text-[13px] text-center">
              141, 30 tháng 4, P.Hưng lợi, Q.Ninh Kiều,TP.Cần Thơ
            </p>
            <p className="font-normal text-[13px] text-center">
              <span className="font-semibold">LINK</span>
            </p>
          </div>
        </div>
      </div>
      <div className="m-3 hidden">
        <h2 className="font-semibold text-center text-[16px]">HÓA ĐƠN BÁN LẺ</h2>
      </div>

      {/* Other sections of the form */}
      <div>
        {/* Content for search and displaying user information */}
        <div className="w-full justify-center flex mt-3 no-print">
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

        <div className="mt-3">
          {userLoading && <Loading />}
          {error && <Error />}
          {!userLoading && !error && users?.length === 1 && (
            <div>
              {users.map(user => (
                <div key={user._id} className="grid grid-cols-2 gap-5">
                  <div>
                    <div className="flex gap-2">
                      <p className="text-[14px] font-bold">KH:</p>
                      <p>{user.name}</p>
                    </div>
                    <div className="flex gap-2">
                      <p className="text-[14px] font-bold">SĐT:</p>
                      <p>{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center text-center">
                    <p className="text-[14px] font-bold">Điểm:</p>
                    <p className="font-extrabold">{user.point}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!userLoading && !error && users?.length === 0 && <p>Không tìm thấy người dùng nào.</p>}
        </div>
      </div>

      {/* Table for displaying cart items */}
      <table className="w-full text-sm text-center border-2 border-slate-400">
        <thead className="text-xs uppercase border-2 border-slate-400">
          <tr>
            <th scope="col" className="py-3 border-2 border-slate-400 text-[14px] text-center">Giá</th>
            <th scope="col" className="py-3 border-2 border-slate-400 text-[14px] text-center"><p>SL</p><span className="font-normal text-[12px]">(Cái)</span></th>
            <th scope="col" className="py-3 border-2 border-slate-400 text-[14px] text-center"><p>Giảm</p><span className="font-normal text-[12px]">(%)</span> </th>
            <th colSpan="2" className="py-3 border-2 border-slate-400 text-[14px] text-center">Thành tiền</th>
          </tr>
        </thead>
        <tbody className="bg-slate-50">
          {formData.products?.length > 0 ? (
            formData.products.map((item, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td colSpan="4" className="border-2 border-slate-400">
                    <div className="flex items-center justify-between">
                        <span>

                    {carts?.products[index]?.product?.name}-{carts?.products[index]?.product?.size}
                        </span>

                                            <button
                                            type="button"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleRemoveProduct(carts?.products[index]?.product?._id)}
                                            >
                                                Xóa
                                            </button>
                    </div>
                        </td>
                  
                                        
                </tr>
                <tr>
                  <td className="border-2 border-slate-400">{FormatPrice(carts?.products[index]?.product?.price)}</td>
                  <td className="p-2 flex items-center justify-center">
                                            <button
                                            type="button"
                                                className=""
                                                onClick={() => handleQuantityChange(index, -1)}
                                            >
                                                -
                                            </button>
                                            <span className="mx-2">{item.quantity}</span>
                                            <button
                                            type="button"
                                                className=""
                                                onClick={() => handleQuantityChange(index, 1)}
                                            >
                                                +
                                            </button>
                                        </td>
                  <td className="border-2 border-slate-400 text-center">{carts?.products[index]?.product?.discount}</td>
                  <td colSpan="2" className="border-2 border-slate-400">{FormatPrice((carts?.products[index]?.product?.price * item.quantity) * (1 - carts?.products[index]?.product?.discount / 100))}</td>
                </tr>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="4">Không có sản phẩm trong giỏ hàng.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Discount and payment summary */}
      <div className="mt-2">
        <div className="grid grid-cols-2 mb-2">
          <p className="text-end font-semibold">Tổng:</p>
          <p className="text-center">{FormatPrice(totalAmountBeforeDiscount)}</p>
        </div>
        <div className="grid grid-cols-2 mb-2">
          <p className="text-end">Điểm:</p>
          <input
            type="number"
            id="discount"
            value={discount}
            onChange={handleDiscountChange}
            className="border-0 border-gray-300 rounded ml-2 text-center focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 mb-2">
          <p className="text-end">Voucher:</p>
          <input
            type="text"
            value={voucher}
            onChange={handleVoucherChange}
            className="border-0 border-gray-300 text-center rounded ml-2 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 mb-2">
          <p className="text-end">Tổng Giảm:</p>
          <p className="text-center">{FormatPrice(totalSale)}</p>
        </div>
        <hr />
        <div className="grid grid-cols-2 mt-2 mb-2">
          <p className="text-end font-semibold">Thanh toán:</p>
          <p className="text-center">{FormatPrice(totalAmountAfterDiscount)}</p>
        </div>
        <div className="mb-2 warring hidden">
          <p className="font-semibold italic">Lưu Ý: Kiểm tra hóa đơn trước khi rời khỏi cửa hàng.</p>
          <p className="italic">Hóa đơn này sẽ không được cấp lại, vui lòng giữ kỹ để đối chiếu khi cần thiết.</p>
          <p className="italic">Cảm ơn quý khách đã mua hàng tại cửa hàng của chúng tôi!</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-5 grid grid-cols-2 gap-5 no-print">
        <button
          type="submit"
          className="bg-primaryColor text-white p-2 rounded-lg w-28"
        >
          {loading ? "Đang xử lý..." : "Thanh toán"}
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="bg-primaryColor text-white p-2 rounded-lg w-28"
        >
          {loading ? "Đang xử lý..." : "In hóa đơn"}
        </button>
      </div>
    </form>
  );
};

export default ProductAddOrder;
