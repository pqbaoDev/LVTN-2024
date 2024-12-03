/* eslint-disable no-unused-vars */

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import SaveIcon from "../../../assets/images/saveIcon.png";
import CategoryIcon from "../../../assets/images/category2.png";
import { useCallback,useMemo, useState } from "react";
import { BASE_URL } from "../../../../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BiPlus, BiPrinter } from "react-icons/bi";
import Inventory from "../product/ProductInventory";
import useFetchData from "../../../Hook/userFecthData";
import PrintStockOut from "./printStockOut";
import StockoutTable from "./stockoutTable";
import CategoryStockOut from "./categoryStockOut";
import { CiInboxOut } from "react-icons/ci";
import { BiSolidPlusCircle } from "react-icons/bi";
import StockOutAdd from "./stockOutAdd";
import { IoIosHome } from "react-icons/io";


const StockOut = ({ handleClose, locations, stockIns }) => {
    const { data: stockOuts } = useFetchData(`${BASE_URL}/stockOut/getLocationId/${locations?._id}`);
    const employee = useMemo(() => JSON.parse(localStorage.getItem('user')), []);
  const [tab, setTab] = useState('categories');

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [print, setPrint] = useState(false); // Thêm state cho print

    const [formData, setFormData] = useState({
        products: [],
        dateOut: '',
        note: '',
        locationId:locations?._id,
        status: 'Đã hoàn tất',
        employeeGive: '',
        employeeId: employee._id
    });
    
    

    const submitHandler = useCallback(async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/stockOut`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const { message } = await response.json();

            if (!response.ok) {
                throw new Error(message);
            }
            if (response.ok) {
                handleClose()
            }


            toast.success(message);
            navigate('/warehouse');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, [formData, navigate]);

    const handlePrint = () => {
        setPrint(true); // Thiết lập trạng thái in khi nhấn
        setTimeout(() => {
            window.print();
            setPrint(false); // Reset trạng thái in sau khi in
        }, 0);
    };
    return (
        <>
            <>
              

                <div className="relative border-0 border-slate-500 flex-auto">
                    <div className="border-b-2 px-2 bg-white flex gap-3">
                    <div className="items-center cursor-pointer" onClick={() => setTab('categories')}>
                          <div className="items-center text-center text-blue-800 text-lg w-6 h-6">
                            <IoIosHome />
                          </div>
                          <p className="text-[12px] font-normal">Home</p>
                        </div>


                    {tab === 'categories' || tab === 'inventory' ? (
                        <div className="items-center cursor-pointer" onClick={() => setTab('add')}>
                          <div className="items-center text-center text-blue-800 text-[22px] font-extrabold w-6 h-6">
                          <CiInboxOut />
                          </div>
                          <p className="text-[12px] font-normal">Xuất</p>
                        </div>
                      ) : null}
                      {tab === 'add' && (
                        <div className="items-center cursor-pointer" onClick={submitHandler}>
                          <img src={SaveIcon} className="w-6 h-6" alt="Save Icon" />
                          <p className="text-[12px] font-normal">Lưu</p>
                        </div>
                      )}

                        <div className="items-center cursor-pointer" >
                            <div className="items-center text-center text-blue-800 text-[25px] w-6 h-6" onClick={handlePrint}>
                                <BiPrinter className="mt-[0.75px]" />
                            </div>
                            <p className="text-[12px] font-normal text-center">In</p>
                        </div>



                    </div>

                </div>
                <div className="bg-white h-[600px] overflow-auto">
                    <div className="flex gap-x-2 bg-blue-500">
                    <div className="flex gap-x-2 bg-blue-500">
                      {
                        tab === 'categories' && <div className="p-1  cursor-pointer text-white italic font-normal" onClick={() => setTab('categories')}>
                          <p>Danh sách phiếu Xuất</p>
                        </div>}
                     
                      {tab === 'add' &&
                        <div className="p-1  cursor-pointer text-white italic font-normal" onClick={() => setTab('add')}>
                          <p>Xuất sản phẩm</p>
                        </div>}
                    </div>

                    </div>
                    {
                        tab === 'add' && 
                        <StockOutAdd
                            // zone={zone}
                          setLoading={setLoading}
                          loading={loading}
                          locations={locations}
                          formData={formData}
                          setFormData={setFormData}
                          
                          submitHandler={submitHandler}
                        />

                    }
                    

                  {tab=== 'categories' && <CategoryStockOut locationId={locations?._id} />}
                    {/* <div>
                        <StockoutTable />

                    </div> */}
                    
                    {print && <PrintStockOut stockOut={stockOuts} />}
                    


                </div>
            </>
            

            

        </>
    );
}

export default StockOut;
