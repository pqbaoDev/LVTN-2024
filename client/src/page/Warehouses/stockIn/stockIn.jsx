/* eslint-disable react/prop-types */
import SaveIcon from "../../../assets/images/saveIcon.png";
import CategoryIcon from "../../../assets/images/category2.png";
import { useMemo, useState } from "react";
import CategoryStockIn from "./categoryStockIn";
import DetailStokIn from "./detailStokIn";
const StockIn = ({handleClose,open,stopPropagation,locationId,zone}) => {
  const employee = useMemo(() => JSON.parse(localStorage.getItem('user')), [])
  const[tab,setTab] = useState('categories');
  console.log('check',employee._id)
    const [formData,setFormData] = useState({
      name:'',
      manuFacture:'',
      category:'',
      photo:'',
      color:'',
      size:'',
      discount:'',
      price:'',
      stock:'',
      tags:'',
      rating:'',
      rack:'',
      pallet:'',
      level:'',
      type:'',
      quantity:'',
      employeeId:employee._id,
    });
   
    const submitHandler = async(event)=>{

    }
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData({
          ...formData,
          [name]: value,
      });
  };
    
    return (
        <>
        {open ? (
          <div>
          {/* Nền mờ bên ngoài, đóng modal khi click vào */}
          <div
            onClick={() => handleClose()}
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-2/3 my-5 mx-auto max-w-3xl" onClick={stopPropagation}>
            
              {/* Nội dung modal */}
              <div className="border-0 p-5 bg-blue-500 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                {/* Header */}
                
                <div className="flex items-start justify-between border-b border-solid border-blueGray-200 rounded-t">
                  <div className="flex gap-2 items-center">
                    <img src={CategoryIcon} className="w-4 h-4" alt="Category Icon" />
                    <h3 className="text-[14px] font-normal">Nhập sản phẩm</h3>
                  </div>
                  <button
                  className="p-2 ml-auto  border-0  rounded-b-none hover:bg-red-500 hover:text-white text-black  float-right text-lg leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => handleClose()}
                >
                  <span className="mx-auto">x</span>
                </button>
                  
                  
                </div>

                {/* Body */}
                <div className="relative border-0 border-slate-500 flex-auto">
                  <div className="border-b-2 px-2  bg-white">
                    <div className="items-center cursor-pointer" onClick={submitHandler}>
                      <img src={SaveIcon} className="w-6 h-6" alt="Save Icon" />
                      <p className="text-[12px] font-normal">Lưu</p>
                    </div>
                  </div>
                  <div className="bg-white h-[300px]">
                    <div className="flex gap-x-2 bg-blue-500">
                      <div className={`${tab==='categories' ? 'text-black bg-white border-slate-400 border-2 border-b-0 ':'text-white '} p-1 ml-5 cursor-pointer`} onClick={()=>setTab('categories')}>
                        <p>Danh sách</p>
                      </div>
                      <div className={`${tab==='detail' ? 'text-black bg-white border-slate-400 border-2 border-b-0':'text-white'} p-1 cursor-pointer`} onClick={()=>setTab('detail')}>
                        <p>Chi tiết</p>
                      </div>
                    </div>
                    <div>
                      {
                        tab === 'categories' && <CategoryStockIn />
                      }
                       {
                        tab === 'detail' && <DetailStokIn />
                      }
                    </div>
                    {/* <table className="border-slate-400 border-t-2">
                      <thead className="bg-blue-100">
                        <tr>
                          <th className="border-0 border-r-2 border-solid border-slate-400 p-1"></th>
                          <th className="border-0 border-r-2 border-solid border-slate-400 p-1">TÊN</th>
                          <th className="border-0 border-r-2 border-solid border-slate-400 p-1">KÍ HIỆU</th>
                          <th className="w-1/3 border-2 border-r-0 border-solid border-slate-400 p-1"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {zone?.map((item, index) => (
                          <tr key={index}>
                            <td className="w-4 bg-white hover:bg-blue-500 text-center items-center border-2 border-l-0 border-solid border-slate-400 p-1"></td>
                            <td className="bg-white hover:bg-blue-500 border-2 border-solid border-slate-400 uppercase p-1">{item.name}</td>
                            <td className="bg-white hover:bg-blue-500 w-1/6 border-2 border-solid border-slate-400 p-1">{item.symbol}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table> */}
                  </div>

                  {/* Form nhập liệu */}
                  <div className="border-2 border-solid border-slate-400 px-2">
                    <h1 className="text-[16px] font-bold text-primaryColor">Thông tin</h1>
                    <form onSubmit={submitHandler}>
                      <div className="grid grid-cols-8 w-3/4 items-center mx-auto">
                        <div className="flex gap-3 col-span-5">
                          <p className="form__label">Tên</p>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập tên"

                            className="border-2 p-1 w-full border-slate-300 focus:outline-none"
                          />
                        </div>
                        <div className="flex col-span-3">
                          <p className="form__label w-1/3">Ký hiệu</p>
                          <input
                            type="text"
                            name="symbol"
                            value={formData.symbol}
                            onChange={handleChange}
                            placeholder="Nhập ký hiệu"
                            className="border-2 w-2/3 p-1 border-slate-300 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="mx-auto mt-3 w-3/4">
                        <div className="flex items-center justify-center mb-5">
                          <p className="form__label w-1/6">Mô tả</p>
                          <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Nhập mô tả"

                            className="border-2 p-1 w-full border-slate-300 focus:outline-none"
                          />
                        </div>
                      </div>
                      {/* <div className="flex justify-center">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                        >
                          {loading ? "Đang lưu..." : "Lưu"}
                        </button>
                      </div> */}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nền mờ */}
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>
        ) : null}
  
        {open ? <div className="opacity-25 fixed inset-0 z-40 bg-black"></div> : null}
      </>
    );
}

export default StockIn;
