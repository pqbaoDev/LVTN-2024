/* eslint-disable react/prop-types */
import SaveIcon from "../../../assets/images/saveIcon.png";
import CategoryIcon from "../../../assets/images/category2.png";
import { useMemo, useState } from "react";
import CategoryStockIn from "./categoryStockIn";
import DetailStokIn from "./detailStokIn";
import { BASE_URL } from "../../../../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BiPrinter, BiSolidPlusCircle } from "react-icons/bi";
import PrintStockIn from "./printStockIn";
import useFetchData from "../../../Hook/userFecthData";
import Inventory from "../inventory/inventory";
import { AiOutlineProduct } from "react-icons/ai";

const StockIn = ({ handleClose, open, stopPropagation, zone, locationId }) => {
  const { data: stockIns } = useFetchData(`${BASE_URL}/stockIn/getOne/${locationId}`);
  const [tab, setTab] = useState('categories');
  const employee = useMemo(() => JSON.parse(localStorage.getItem('user')), []);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [print, setPrint] = useState(false); // Thêm state cho print

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    manuFacture: '',
    photo: '',
    color: '',
    size: '',
    discount: '',
    price: '',
    stock: '',
    tags: '',
    rating: '',
    rack: '',
    pallet: '',
    level: '',
    type: 'rack',
    date: '',
    status: '',
    note: '',
    quantity: '',
    employeeId: employee._id
  });

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData })
      });
      const { message } = await response.json();

      if (!response.ok) {
        throw new Error(message);
      }

      toast.success(message);
      navigate('/warehouse');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    setPrint(true); // Thiết lập trạng thái in khi nhấn
    setTimeout(() => {
      window.print();
      setPrint(false); // Reset trạng thái in sau khi in
    }, 0);
  };

  return (
    <>
      {open && (
        <div>
          <div
            onClick={handleClose}
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-[1080px] my-5 mx-auto" onClick={stopPropagation}>
              
                <div className="border-0 py-3 px-1.5 bg-blue-500 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                <div className="flex items-start justify-between border-b border-solid border-blueGray-200 rounded-t">
                  <div className="flex gap-2 items-center">
                    <img src={CategoryIcon} className="w-4 h-4" alt="Category Icon" />
                    <h3 className="text-[14px] font-normal">Nhập sản phẩm</h3>
                  </div>
                  <button
                    className="p-2 ml-auto border-0 rounded-b-none hover:bg-red-500 hover:text-white text-black float-right text-lg leading-none font-semibold outline-none focus:outline-none"
                    onClick={handleClose}
                  >
                    <span className="mx-auto">x</span>
                  </button>
                </div>

                <div className="relative border-0 border-slate-500 flex-auto">
                  <div className="border-b-2 px-2 bg-white flex gap-3">
                    {tab === 'categories' || tab === 'inventory'   ? (
                      <div className="items-center cursor-pointer" onClick={() => setTab('detail')}>
                        <div className="items-center text-center text-blue-800 text-lg w-6 h-6">
                          <BiSolidPlusCircle />
                        </div>
                        <p className="text-[12px] font-normal">Thêm</p>
                      </div>
                    ):null}
                    {tab === 'detail' && (
                      <div className="items-center cursor-pointer" onClick={submitHandler}>
                        <img src={SaveIcon} className="w-6 h-6" alt="Save Icon" />
                        <p className="text-[12px] font-normal">Lưu</p>
                      </div>
                    )}
                    <div className="items-center cursor-pointer" onClick={() => setTab('detail')}>
                      <div className="items-center text-center text-blue-800 text-[25px] w-6 h-6" onClick={handlePrint}>
                        <BiPrinter className="mt-[0.75px]" />
                      </div>
                      <p className="text-[12px] font-normal text-center">In</p>
                    </div>
                    
                      <div className="items-center cursor-pointer" onClick={() => setTab('inventory')}>
                      <div className="items-center text-center text-blue-800 text-[25px] w-6 h-6" >
                        
                        <AiOutlineProduct className="mt-[0.75px]" />
                      </div>
                        <p className="text-[12px] font-normal">Hàng tồn</p>
                      </div>
                  </div>

                  {tab === 'inventory' ? stockIns ? <Inventory stockIn={stockIns} />:"Không có hàng tồn tại vị trí này!" :( <div className="bg-white h-[600px] overflow-auto">
                    <div className="flex gap-x-2 bg-blue-500">
                      <div className={`${tab === 'categories' ? 'text-black bg-white border-slate-400 border-2 border-b-0' : 'text-white'} p-1 ml-5 cursor-pointer`} onClick={() => setTab('categories')}>
                        <p>Danh sách</p>
                      </div>
                      <div className={`${tab === 'detail' ? 'text-black bg-white border-slate-400 border-2 border-b-0' : 'text-white'} p-1 cursor-pointer`} onClick={() => setTab('detail')}>
                        <p>Thêm</p>
                      </div>
                    </div>
                    <div>
                      {tab === 'categories' && <CategoryStockIn />}
                      {tab === 'detail' && (
                        <DetailStokIn
                          zone={zone}
                          setLoading={setLoading}
                          loading={loading}
                          formData={formData}
                          setFormData={setFormData}
                          submitHandler={submitHandler}
                        />
                      )}
                    </div>
                    </div>)}
                  </div>
                </div>
            </div>
          </div>

          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>
      )}
      {open && <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>}
      {print && <PrintStockIn stockIn={stockIns} />}
    </>
  );
}

export default StockIn;
