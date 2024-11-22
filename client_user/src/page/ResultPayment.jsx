import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../../config";
import successImg from "../assets/images/successImg.png"
import wrongImg from "../assets/images/wrongImg.png"

const ResultPayment = () => {
  const [searchParams] = useSearchParams();

  // Lấy dữ liệu từ URL
  const vnpAmount = searchParams.get("vnp_Amount") / 100; // Chia 100 để ra đơn vị VND
  const vnpBankCode = searchParams.get("vnp_BankCode");
  const vnpOrderInfo = searchParams.get("vnp_OrderInfo");
  const vnpTransactionStatus = searchParams.get("vnp_TransactionStatus");
  const vnpResponseCode = searchParams.get("vnp_ResponseCode");
  const vnpTransactionNo = searchParams.get("vnp_TransactionNo");
  const orderId = searchParams.get("vnp_TxnRef");
  const vnpPayDate = searchParams.get("vnp_PayDate");

  // Kiểm tra trạng thái giao dịch
  const isSuccess = vnpResponseCode === "00" && vnpTransactionStatus === "00";

  // Hàm gọi API để cập nhật đơn hàng
  const updateOrderStatus = async () => {
    if (isSuccess) {
      try {
        const response = await fetch(`${BASE_URL}/order/${orderId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vnp_ResponseCode: vnpResponseCode,
            vnp_Amount: vnpAmount,
          }),
        });

        const data = await response.json();
        console.log("Order updated successfully:", data);
      } catch (error) {
        console.error("Error updating order:", error);
      }
    }
  };

  // Sử dụng useEffect để gọi hàm updateOrderStatus khi component được render
  useEffect(() => {
    updateOrderStatus();
  }, [isSuccess]); 
  // Chạy lại khi trạng thái thành công thay đổi

  return (
    <div >
      <div className="mx-auto w-1/2 bg-slate-100 px-5 pb-5">
      <div className="w-[250px] h-[250px] mx-auto">
      {isSuccess ? <img src={successImg} alt="" /> : <img src={wrongImg} alt="" />}
       
      </div>
      <div className="items-center flex justify-center">
        <h1 className="leading-4 text-[24px] font-semibold">Thanh toán {isSuccess ? "Thành công" : "Thất bại"}</h1>
      </div>
      <Link to='/' className="flex items-center justify-center mx-auto mt-5 py-3 border border-gray-500 text-white bg-gray-500 hover:bg-gray-400 w-[210px]">
          <h1 >Về trang chủ</h1>

      </Link>
        <div className="bg-green-300 p-2 mt-5">
          <h1 className="text-[22px] font-semibold ">Thông tin giao  dịch</h1>
          <div className="mx-10">
            <p><strong>Trạng thái giao dịch:</strong> {isSuccess ? "Thành công" : "Thất bại"}</p>
            <p><strong>Số tiền:</strong> {vnpAmount.toLocaleString()} VND</p>
            <p><strong>Mã ngân hàng:</strong> {vnpBankCode}</p>
            <p><strong>Thông tin đơn hàng:</strong> {vnpOrderInfo}</p>
            <p><strong>Mã giao dịch:</strong> {vnpTransactionNo}</p>
            <p><strong>Thời gian thanh toán:</strong> {vnpPayDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPayment;
