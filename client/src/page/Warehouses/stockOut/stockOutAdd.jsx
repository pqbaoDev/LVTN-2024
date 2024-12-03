/* eslint-disable react/prop-types */
// import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";
import useFetchData from "../../../Hook/userFecthData";
import { BASE_URL } from "../../../../config";

const StockOutAdd = ({ submitHandler, formData, setFormData, locations }) => {
    console.log(locations)
    const { data: employees } = useFetchData(`${BASE_URL}/employee`);
    // const [isProductId, setIsProductId] = useState("");
   

    // const handleProductChange = (index, productId) => {
    //     const updatedProducts = formData.products.map((product, i) =>
    //         i === index ? { ...product, productId } : product
    //     );
    //     setFormData({ ...formData, products: updatedProducts });
    //     setIsProductId(productId);
    // };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const addItem = (item) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            products: [...prevFormData.products, item],
        }));
    };

    const deleteItem = (key, index) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [key]: prevFormData[key].filter((_, i) => i !== index),
        }));
    };

    const handleQuantityChange = (index, quantity) => {
        const updatedProducts = formData.products.map((product, i) =>
            i === index ? { ...product, quantity } : product
        );
        setFormData({ ...formData, products: updatedProducts });
    };

    const addProducts = (e) => {
        e.preventDefault();
        addItem({ productId: "", quantity: "" });
    };

    const deleteProduct = (e, index) => {
        e.preventDefault();
        deleteItem("products", index);
    };

    const handleAddProduct = (product) => {
        if (!formData.products.find((item) => item.productId === product._id)) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                products: [
                    ...prevFormData.products,
                    { productId: product.product._id, quantity: 1 },
                ],
            }
            
        ));

        }
    };

   

    return (
        <>
            <div>
                <form action="" onSubmit={submitHandler}>
                    {/* General Information */}
                    <div>
                        <div className="grid grid-cols-2 gap-2 mx-auto w-1/2">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700 w-1/4">
                                    Ngày:
                                </label>
                                <input
                                    type="date"
                                    name="dateOut"
                                    onChange={handleInputChange}
                                    className="mt-1 px-2 py-1 block w-full rounded-md border border-indigo-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700 w-1/2">
                                    Trạng thái:
                                </label>
                                <select
                                    name="status"
                                    className="mt-1 px-2 py-1 block w-full rounded-md border border-indigo-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    onChange={handleInputChange}
                                    value={formData.status}
                                >
                                    <option value="">Chọn trạng thái</option>
                                    <option value="Đã hoàn tất">
                                        Đã hoàn tất
                                    </option>
                                    <option value="Chưa hoàn tất">
                                        Chưa hoàn tất
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center justify-center mx-auto w-1/2">
                            <label className="block text-sm font-medium text-gray-700 w-1/3">
                                Nhân viên nhận:
                            </label>
                            <select
                                name="employeeGive"
                                className="mt-1 px-2 py-1 block w-full rounded-md border border-indigo-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                onChange={handleInputChange}
                                value={formData.employeeGive}
                            >
                                <option value="">Chọn nhân viên nhận</option>
                                {employees.map((item, index) => (
                                    <option key={index} value={item._id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center justify-center mx-auto w-1/2">
                            <label className="block text-sm font-medium text-gray-700 w-1/6">
                                Ghi chú:
                            </label>
                            <input
                                type="text"
                                name="note"
                                onChange={handleInputChange}
                                className="mt-1 px-2 py-1 block w-full rounded-md border border-indigo-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* Product Information */}
                    <div className="flex items-center justify-start mx-auto w-1/2 mt-5">
                        <p className="italic font-bold">Thông tin sản phẩm</p>
                        <div className="ml-4">
                            <button
                                onClick={addProducts}
                                className="bg-[#000] rounded-full text-white cursor-pointer"
                            >
                                <BiPlus />
                            </button>
                        </div>
                    </div>
                    <div className="mx-auto  ">
                    <div>
   {formData.products.some((item) => item.productId) && ( 
    <div className="mt-5 border-t-[20px] border-blue-500 pt-1">
        <table className="table-auto border-collapse border border-blue-500 w-full text-sm text-left">
        <thead className="bg-blue-500   ">
                                    <tr>
                                        <th className="border border-indigo-600 px-4 py-2">
                                            Tên sản phẩm
                                        </th>
                                        <th className="border border-indigo-600 px-4 py-2">
                                            KÍCH THƯỚC
                                        </th>
                                        <th className="border border-indigo-600 px-4 py-2 w-[120px]">
                                            SỐ LƯỢNG
                                        </th>
                                        
                                        <th className="border border-indigo-600 px-4 py-2">
                                            DANH MỤC
                                        </th>
                                        <th className="border border-indigo-600 px-4 py-2">
                                           THƯƠNG HIỆU
                                        </th>
                                        <th className="border border-indigo-600 px-4 py-2">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
            <tbody>
                {/* Lặp qua sản phẩm */}
                {formData.products.map((item, index) => {
                    const product = locations?.products?.find(
                        (locItem) => locItem.product?._id === item.productId
                    )?.product;
                    
                    return (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-indigo-600 px-4 py-2">
                               
                                {product?.name || "Không xác định"}
                            </td>
                            <td className="border border-indigo-600 px-4 py-2">
                               
                                {product?.size || "Không xác định"}
                            </td>
                            <td className="border border-indigo-600 px-4 py-2">
                                {/* Số lượng */}
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) =>
                                        handleQuantityChange(index, e.target.value)
                                    }
                                    className="mt-1 px-2 py-1 block w-full rounded-md border border-indigo-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    min="1"
                                    required
                                />
                            </td>
                            <td className="border border-indigo-600 px-4 py-2">
                               
                                {product?.category.name || "Không xác định"}
                            </td>
                            <td className="border border-indigo-600 px-4 py-2">
                               
                                {product?.manuFacture.name || "Không xác định"}
                            </td>
                            <td className="border border-indigo-600 px-4 py-2">
                                {/* Nút xóa */}
                                <button
                                    onClick={(e) => deleteProduct(e, index)}
                                    className="bg-red-600 rounded-full text-white text-[16px] cursor-pointer"
                                >
                                    <AiOutlineDelete />
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>)}
</div>

                    </div>

                    {/* Product Table */}
                    <div>
                        <div className="mt-5 border-t-[20px] border-blue-500 pt-1">
                            <table className="table-auto border-collapse border border-indigo-600 w-full text-sm text-left">
                                <thead className="bg-blue-500">
                                    <tr>
                                        <th className="border border-indigo-600 px-4 py-2"></th>
                                        <th className="border border-indigo-600 px-4 py-2">
                                            Tên sản phẩm
                                        </th>
                                        <th className="border border-indigo-600 px-4 py-2">
                                            KÍCH THƯỚC
                                        </th>
                                        <th className="border border-indigo-600 px-4 py-2">
                                            SỐ LƯỢNG
                                        </th>
                                        <th className="border border-indigo-600 px-4 py-2">
                                            TỒN
                                        </th>
                                        <th className="border border-indigo-600 px-4 py-2">
                                            DANH MỤC
                                        </th>
                                        <th className="border border-indigo-600 px-4 py-2">
                                           THƯƠNG HIỆU
                                        </th>
                                        <th className="border border-indigo-600 px-4 py-2">
                                            Thao tác
                                        </th>
                                        <th className="border border-indigo-600 px-4 py-2 w-[80px]">

                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {locations?.products.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border border-indigo-600 px-4 py-2">{index + 1}</td>
                                            <td className="border border-indigo-600 px-4 py-2">
                                                {item.product?.name}
                                            </td>
                                            <td className="border border-indigo-600 px-4 py-2">
                                                {item.product?.size}
                                            </td>
                                            <td className="border border-indigo-600 px-4 py-2">
                                                {item.quantity}
                                            </td>
                                            <td className="border border-indigo-600 px-4 py-2">
                                                {item.product?.stock}
                                            </td>
                                            <td className="border border-indigo-600 px-4 py-2">
                                                {item.product?.category.name}
                                            </td>
                                            <td className="border border-indigo-600 px-4 py-2">
                                                {item.product?.manuFacture.name}
                                            </td>
                                            <td className="border border-indigo-600 px-4 py-2">
                                                <button
                                                type="button"
                                                    onClick={() =>
                                                        handleAddProduct(item)
                                                    }
                                                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                                                >
                                                    Chọn
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Submit Button */}
                   
                </form>
            </div>
        </>
    );
};

export default StockOutAdd;
