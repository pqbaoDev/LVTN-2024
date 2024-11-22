/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, useEffect, useMemo, useCallback } from "react";
import { authContext } from "../context/AuthContext";
import useFetchData from "../Hook/userFecthData";
import { BASE_URL } from "../../config";
import cartLogo from "../assets/images/cartLogo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormatPrice from "../utils/formatPrice";
import { toast } from "react-toastify";
import { FaMapMarker, FaMapMarkerAlt } from "react-icons/fa";
import { BiSolidDiscount } from "react-icons/bi";
import ModelVoucher from "../components/voucher/modelVoucher";
import logo from '../assets/images/miniLogo.png';
import { FormatDay } from "../utils/formatDay";
import EditUserInPaymentModel from "../components/user/editUserInPaymentModel";
import axios from 'axios';

const Payment = () => {
    const { user } = useContext(authContext);
    const {data:userData}=useFetchData(`${BASE_URL}/user/${user._id}`)
    const { name, phone, address,point } = userData;
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [payment,setPayment] = useState('Cod');


    const cartProducts = location.state?.products || [];
    // const selectProducts = location.state?.selectedProducts || [];
   

    
      
    //   console.log(selectedCartProducts);

    const navigate = useNavigate();

    const [voucher, setVoucher] = useState('');
    const [discount, setDiscount] = useState(0);
    const [refetch, setRefetch] = useState(false);


    const handleInputVoucherChange = (e) => {
        setVoucher(e.target.value);
    };

    const { data: vouchers, refetch: refetchData } = useFetchData(`${BASE_URL}/promotion/voucher/${voucher}`, refetch);

    useEffect(() => {
        if (!loading && refetch) {
            refetchData();
            setRefetch(false);  // Reset refetch state
        }
    }, [loading, refetch, refetchData]);


    const [openModelVoucher, setOpenModelVoucher] = useState(false);
    const handleOpenModelVoucher = () => {
        setOpenModelVoucher(true);
        setRefetch(true);
    }
    const handleCloseModelVoucher = () => {
        setOpenModelVoucher(false);
    }
    const stopPropagation = (e) => {
        e.stopPropagation();
    };
    const [message, setMessage] = useState('');


    const calculateDiscountedPrice = (price, discount) => {
        return price * (1 - discount / 100);
    };
    // Hàm xử lý khi áp dụng voucher
    const handleVoucherApply = () => {
        setVoucherValid(true);
        setRefetch(true);

        if (vouchers) {
            toast.success(`Voucher ${voucher} đã được áp dụng!`);
        } else {
            toast.error(`Voucher ${voucher} không tồn tại hoặc hết hạn!`);
        }

    };

    const totalAmountBeforeDiscount = useMemo(() => {
        if (!Array.isArray(cartProducts) || cartProducts.length === 0) return 0;
        return cartProducts.reduce((total, item) => {
            const price = item.product?.price || 0;
            const discount = item.product?.discount || 0;
            const quantity = Math.max(item.quantity, 0);
            const discountPrice = price * (1 - discount / 100);
            return total + (quantity * discountPrice);
        }, 0);
    }, [cartProducts]);

    const discountOfProduct = useMemo(() => {
        if (!cartProducts) return 0;

        return cartProducts.reduce((total, item) => {
            const price = item.product?.price || 0;
            const discount = item.product?.discount || 0;  // Discount nếu không có sẽ là 0
            return (price * discount / 100) * item.quantity; // Cộng dồn vào tổng số tiền

        }, 0);// Giá trị khởi tạo là 0
    }, [cartProducts]);

    const [voucherValid, setVoucherValid] = useState(false);
    const discountVoucher = voucherValid ? vouchers.sale : 0;

    let totalSale = 0;
    if (discountVoucher) {
        totalSale = discount + discountVoucher + discountOfProduct
    } else {
        totalSale = discount + discountOfProduct;
    }


    const totalAmountAfterDiscount = useMemo(() => {
        const validDiscount = Math.min(discount, totalAmountBeforeDiscount);
        const voucherDiscount = voucherValid ? vouchers.sale : 0;
        if (voucherDiscount > 0) return totalAmountBeforeDiscount - validDiscount - voucherDiscount;
        else return totalAmountBeforeDiscount - validDiscount;
    }, [totalAmountBeforeDiscount, discount, vouchers, voucherValid]);
    const [formData, setFormData] = useState({
        products: [],
        userId: user._id,
        totalAmountAfterDiscount,
        employeeId: '',
        discount,
        totalSale,
        promotionId: vouchers?._id,
        method:payment === 'Cod' ? 'Tiền mặt' : 'Chuyển khoản'
      

    });
    useEffect(() => {
        if (cartProducts) {
            setFormData(prev => ({
                ...prev,
                products: cartProducts.map(item => ({
                    productId: item.product._id,
                    quantity: item.quantity
                }))
            }));
        }
    }, [cartProducts]);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            discount,
            totalSale,
            promotionId: vouchers?._id,
            totalAmountAfterDiscount // Cập nhật tổng số tiền sau giảm giá
        }));
    }, [totalAmountAfterDiscount, discount, totalSale, vouchers]);



    // Hàm xử lý thay đổi trong ô nhập liệu


    


    const isFormValid = useMemo(() => {
        return formData.products.length > 0;
    }, [formData]);




    const totalQuantity = cartProducts.reduce((total, item) => {
        return cartProducts.includes(item.product?._id)
            ? total + item.quantity
            : total;
    }, 0);

    const submitHandler = useCallback(async (event) => {
        event.preventDefault();
    
        if (!isFormValid) {
            toast.error("Vui lòng chọn sản phẩm và người dùng trước khi đặt hàng.");
            return;
        }
    
        const shouldPrint = window.confirm("Xác nhận thanh toán?");
        if (!shouldPrint) return;
    
        setLoading(true);
    
        try {
            // First, make the order API request
            const response = await fetch(`${BASE_URL}/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    createdAt: new Date().toISOString(),
                }),
            });
    
            const { message, data } = await response.json();
    
            // If the order request fails, throw an error
            if (!response.ok) {
                throw new Error(message || "Có lỗi xảy ra khi tạo đơn hàng.");
            }

    
            // If the payment method is vnbank, initiate the payment URL creation
            if (payment === 'vnbank') {
                const paymentResponse = await fetch(`${BASE_URL}/order/create_payment_url`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: totalAmountBeforeDiscount, // Ensure this value is correct
                        bankCode: 'NCB',
                        language: 'vn',
                        orderId: data.orderID, // orderID from the order response
                    }),
                });
    
                const paymentMessage = await paymentResponse.json();
    
                // If creating the payment URL fails, throw an error
                if (!paymentResponse.ok) {
                    throw new Error(paymentMessage.message || "Có lỗi xảy ra khi tạo URL thanh toán.");
                }
    
                // Redirect user to the payment URL
                window.location.href = paymentMessage.paymentUrl;
                return; // Exit the function after redirecting
            }
            navigate('/users/profile/me');
            toast.success("Đặt hàng thành công!");
    
        } catch (error) {
            // Handle errors in a user-friendly way
            toast.error(error.message || "Có lỗi xảy ra trong quá trình thanh toán.");
            console.error(error); // Log error details for debugging (optional)
        } finally {
            setLoading(false); // Always stop the loading state
        }
    }, [formData, isFormValid, payment, totalAmountBeforeDiscount, navigate]);
    
    
    



    const handleDiscountChange = (e) => {
        const inputValue = Number(e.target.value);
        if (inputValue < 0 || inputValue > totalAmountBeforeDiscount || (user?.[0]?.point - inputValue) < 0) {
          toast.error("Giảm giá không hợp lệ.");
          setDiscount(0);
        } else {
          setDiscount(inputValue);
        }
      };
   const handleDeleteVoucher=()=>{
    setVoucher('');
    setVoucherValid(false)

    }
    const [openEditInforModel,setOpenEditInforModel]=useState(false);
    const handleOpenEditInfor=()=>{
       
        setOpenEditInforModel(true)
    }
    const handleCloseEditInfor=()=>{
        setOpenEditInforModel(false)
    }
    const handleVoucherChange = (e) => {
        setVoucher(e.target.value);
      };
   



    return (
        <>
            <form onSubmit={submitHandler} className="container mx-auto pt-8 bg-gray-50">
                {cartProducts.length > 0 ? (
                    <div className="flex flex-col">
                        <div className="overflow-x-auto">
                            <div className="flex justify-between items-center w-[1134px] mx-auto bg-white p-5 border-dashed border-indigo-600 border-t-4">
                                <div className="text-center">
                                    <div className="flex justify-left items-center gap-3">
                                        <FaMapMarkerAlt className="text-orange-600" />
                                        <h2 className="text-[16px] font-semibold text-orange-500">Địa chỉ nhận hàng</h2>
                                    </div>
                                    <div className="flex items-center justify-center gap-3 mt-3">
                                        <p className="text-[16px] font-extrabold">{name + ' ' + phone} </p>
                                        <p className="">{address}</p>
                                        <div className="ml-5 italic text-primaryColor cursor-pointer" onClick={()=>handleOpenEditInfor(user._id)}>

                                            <p >Thay đổi</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center gap-3">
                                    <h2>Điểm:</h2>
                                    <p>{point}</p>
                                </div>
                            </div>
                            <table className="w-3/4 mx-auto text-sm mt-3 text-center bg-white">
                                <thead className="text-[16px]  rounded-sm mb-3 font-normal text-slate-400">
                                    <tr>

                                        <th className="px-3 py-3 text-left">Sản Phẩm</th>
                                        <th className="px-3 py-3">Đơn Giá</th>
                                        <th className="px-3 py-3">Số Lượng</th>
                                        <th className="px-3 py-3">Thành tiền</th>
                                        {/* <th className="px-3 py-3">Thao Tác</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartProducts.map((item) => (
                                        <tr key={item.product._id} >

                                            <td className="p-4 flex items-center gap-4">
                                                <img src={item.product.photo} alt={item.product.name} className="w-[50px] h-[50px] object-cover rounded" />
                                                <span className="truncate w-[200px]">{item.product.name}</span>
                                            </td>
                                            <td className="p-4 text-center">{FormatPrice(item.product.price)}</td>
                                            <td className="p-4 text-center">

                                                {item.quantity}

                                            </td>
                                            <td className="p-4 text-center">
                                                {FormatPrice(item.quantity * item.product.price)}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-3 w-[1134px] py-6 px-3 mx-auto bg-white ">
                                <div className="flex justify-between items-center">
                                <div className="flex justify-start items-center gap-5 text-[20px] font-normal">
                                    <BiSolidDiscount className=" text-indigo-600" />
                                    <h2 >Voucher</h2>
                                </div>
                                <div className="cursor-pointer  text-center text-[16px] text-indigo-600" onClick={handleOpenModelVoucher}>
                                    <p>Chọn voucher</p>
                                </div>
                            </div>
                            <div className="flex justify-center items-center">
                                {
                                    vouchers && voucher ?(<div className={`mx-10 mt-5 w-1/3 relative myvoucher grid grid-cols-6 items-center justify-center rounded-md`}>
                                        <div className={`h-[90px] bg-indigo-600 col-span-2 rounded-s-md shadow-[4px_0px_8px_rgba(0,0,0,0.38)]`}>
                                            <div className="items-center flex justify-center rounded-full w-12 h-12 bg-white align-middle mx-auto mt-5">
                                                <div className="w-8 h-8">
                                                    <img src={logo} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-3 pl-3">
                                            <div className="mx-2">
                                                <p className="text-[16px] font-extrabold italic leading-6">{vouchers.name}</p>
                                                <div className="flex justify-start items-center gap-2">
                                                    <h3>Giảm </h3>
                                                    <p><sup className="underline decoration-solid">đ</sup>{FormatPrice(vouchers.sale)}</p>
                                                </div>
                                                <p className="absolute -top-1 -right-1 text-center text-red-400 bg-red-100 px-2 rounded-md text-[22px]" onClick={handleDeleteVoucher}>x</p>
                                                <div className="flex justify-start items-center gap-2 text-[14px] text-gray-400">
                                                    <h3>HSD:</h3>
                                                    <p>{FormatDay(vouchers.endDate)}</p>
                                                </div>
                                            </div>

                                           
                                        </div>

                                       
                                    </div>):''
                                }
                            </div>
                            </div>
                            
                            <div className="w-[1134px] mx-auto bg-white mt-3">
                                <div className="py-6 px-3 flex justify-between items-center">
                                    <div className="text-[18px]">
                                        <h3>Phương thức thanh toán</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        
                                        <div className={`${payment==='Cod'? 'bg-indigo-600 hover:bg-indigo-400 text-white':'border-gray-500 hover:bg-slate-100'} px-3 py-2 border-2 text-center  cursor-pointer`} onClick={()=>setPayment('Cod')}>
                                            Thanh toán khi nhận hàng
                                        </div>
                                        <div className={`${payment==='vnbank'? 'bg-indigo-600 hover:bg-indigo-400 text-white':'border-gray-500 hover:bg-slate-100'} px-3 py-2 border-2 text-center cursor-pointer`} onClick={()=>setPayment('vnbank')}>
                                            Chuyển khoản
                                        </div>
                                           
                                        

                                    </div>


                                </div>
                                <div className="  pr-5 border-y-2 border-dotted py-6">
                                    <div className="flex justify-end item-center mb-2">
                                        <p className="text-start font-semibold">Tổng tiền hàng:</p>
                                        <p className="text-end w-[164px]"><sup className="underline">đ</sup>{FormatPrice(totalAmountBeforeDiscount)}</p>
                                    </div>
                                    <div className="flex justify-end item-center mb-2">
                                        <p className="text-start">Điểm:</p>
                                        <input
                                            type="number"
                                            id="discount"
                                            value={discount}
                                            onChange={handleDiscountChange}
                                            className="border-0 w-[164px] border-gray-300 rounded ml-2 text-end focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex justify-end item-center mb-2">
                                        <p className="text-start">Voucher:</p>
                                        <input

                                            type="text"
                                            value={voucher}
                                            onChange={handleVoucherChange}
                                            className="border-0 w-[164px] border-gray-300 text-end rounded ml-2 focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex justify-end item-center mb-2">
                                        <p className="text-start">Tổng Giảm:</p>
                                        <p className="text-end w-[164px]">{FormatPrice(totalSale)}</p>
                                    </div>
                                    <div className="flex justify-end item-center mt-2 mb-2">
                                        <p className="text-start font-semibold">Tổng thanh toán:</p>
                                        <p className="text-end w-[164px] text-[28px]  text-orange-500"><sup className="underline">đ</sup>{FormatPrice(totalAmountAfterDiscount)}</p>
                                    </div>
                                </div>
                                    <div className="flex justify-end items-center w-[1134px] mx-auto p-6">
                                    <button
                                        className="bg-indigo-500 text-white py-2 w-[210px] px-10  text-lg "
                                        type="submit"
                                    >
                                        Đặt hàng
                                    </button>
                                    </div>
                            </div>
                        </div>
                       
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="w-[150px] mx-auto pt-16">
                            <img src={cartLogo} alt="Giỏ hàng trống" />
                        </div>
                        <h2 className="text-[18px] text-center font-extrabold italic">Giỏ hàng trống</h2>
                        <p className="text-center text-slate-400">Không có sản phẩm nào trong giỏ hàng</p>
                        <Link to="/home" className="mx-auto items-center flex justify-center">
                            <button className="border bg-primaryColor py-2 px-32 my-5 rounded-md text-white">
                                Về trang chủ
                            </button>
                        </Link>
                    </div>
                )}

            </form>
            <ModelVoucher
                open={openModelVoucher}
                handleClose={handleCloseModelVoucher}
                stopPropagation={stopPropagation}
                handleInputChange={handleInputVoucherChange}
                handleVoucherApply={handleVoucherApply}
                voucher={voucher}
                setVoucher={setVoucher}
                userId={user._id}
                vouchers={vouchers}
                message={message} 
            />
                <EditUserInPaymentModel
                    open={openEditInforModel}
                    handleClose={handleCloseEditInfor}
                    stopPropagation={stopPropagation}
                    user={userData}
                
                />
        </>
    );
};

export default Payment;
