/* eslint-disable react/prop-types */
import { FormatDay } from "../../../utils/formatDay";
import FormatPrice from "../../../utils/formatPrice";

const Inventory = ({ stockIn, location }) => {
    console.log('check',location)
    // Lọc sản phẩm theo vị trí
    const productLocation = stockIn.filter(loc => loc.location && loc.location._id === location._id);

    return (
        <>
            {location.products.length > 0 ? (
                <div className="bg-white h-[300px] overflow-auto relative">
                    <table className="border-slate-400 border-t-2">
                        <thead className="bg-blue-100">
                            <tr>
                                <th scope="col" className="border-0 border-x-2 border-solid border-slate-400 p-1">STT</th>
                                <th scope="col" className="border-0 border-r-2 border-solid border-slate-400 p-1">SỐ PHIẾU</th>
                                <th scope="col" className="border-0 border-r-2 border-solid border-slate-400 p-1">TÊN HÀNG HÓA</th>
                                <th scope="col" className="border-0 border-r-2 border-solid border-slate-400 p-1">ĐVT</th>
                                <th scope="col" className="border-0 border-r-2 border-solid border-slate-400 p-1">SL NHẬP</th>
                                <th scope="col" className="border-0 border-r-2 border-solid border-slate-400 p-1">SL TỒN</th>
                                <th scope="col" className="border-0 border-r-2 border-solid border-slate-400 p-1">GIÁ NHẬP</th>
                                <th scope="col" className="border-0 border-r-2 border-solid border-slate-400 p-1">THÀNH TIỀN</th>
                                <th scope="col" className="border-0 border-r-2 border-solid border-slate-400 p-1">NGÀY NHẬP</th>
                                <th scope="col" className="border-0 border-r-2 border-solid border-slate-400 p-1">VỊ TRÍ</th>
                                <th scope="col" className="border-0 border-r-2 border-solid border-slate-400 p-1">Pallet/KỆ</th>
                                <th scope="col" className="border-0 border-r-2 border-b-2 border-solid border-slate-400 p-1"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {productLocation.map((item, index) =>
                                // Lọc sản phẩm có mặt trong cả stockIn.products và location.products
                                item.products
                                    .filter(proItem => 
                                        location.products.some(locProd => locProd.product._id === proItem.product._id)
                                    )
                                    .map((proItem, subIndex) => {
                                        // Tìm kiếm sản phẩm trong location.products
                                        const product = location.products.find(locProd => locProd.product._id === proItem.product._id);
                                        const availableQuantity = product ? product.quantity : 0; // Nếu không tìm thấy, đặt số lượng là 0

                                        return (
                                            <tr key={`${index}-${subIndex}`}>
                                                <td className="w-4 bg-white hover:bg-blue-500 text-center items-center border-2 border-l-2 border-solid border-slate-400 p-1">
                                                    {subIndex + 1}
                                                </td>
                                                <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 uppercase p-1">{item._id}</td>
                                                <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">{proItem.product.name}</td>
                                                <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">Cái</td>
                                                <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">{proItem.quantity}</td>
                                                <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">{availableQuantity}</td>
                                                <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">{FormatPrice(proItem.product.price)}</td>
                                                <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">{FormatPrice(proItem.product.price * proItem.quantity)}</td>
                                                <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">{FormatDay(item.date)}</td>
                                                <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1">
                                                    {item.location?.rack ? `${item.location.rack}L${item.location.level}` : item.location?.pallet}
                                                </td>
                                                <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 p-1 uppercase text-center">
                                                    {item.location?.type === 'rack' ? 'kệ' : 'pallet'}
                                                </td>
                                            </tr>
                                        );
                                    })
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center mt-5">Không có sản phẩm tồn kho tại vị trí này.</p>
            )}
        </>
    );
}

export default Inventory;
