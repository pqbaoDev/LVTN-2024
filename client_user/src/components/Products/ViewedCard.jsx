/* eslint-disable react/prop-types */

import { useContext } from "react";
import FormatPrice from "../../utils/formatPrice";
import { MdCancel } from "react-icons/md";
import { authContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import ViewedProductService from "../../services/viewedproduct.service";
import { useNavigate } from "react-router-dom";


const ViewedCard = ({products,setRefetch}) => {
    const {name,price,photo,_id} = products;
    const {user} = useContext(authContext);
    const userId = user? user._id :null;
    const navigate = useNavigate();
    const handleDeleteItem = async(event)=>{
        event.preventDefault();
        try {
            const viewedProductRes = await ViewedProductService.deleteViewedProduct(userId, _id);
            if (!viewedProductRes.success) {
                throw new Error('Không thể xóa sản phẩm trong danh sách đã xem');
            }
            navigate('/')
            setRefetch(true)
            
        } catch (error) {
            toast.error(error.message);
        }

    }
    return (
        <>
        <div className=" border border-slate-300 p-2 grid grid-cols-3 max-w-[277px] h-[86px] rounded-md relative">
            <div className="col-span-1 flex justify-center items-center max-h-[63px]">
                {
                    photo?.slice(0,1).map((pho,index)=>(
                        <img key={index} src={pho} className="max-w-[57px] " alt="hình sản phẩm" />

                    ))
                }

            </div>
            <div className="col-span-2">
                <p className="h-2/3 w-[130px] overflow-y-hidden">{name}</p>
                <span className="text-red-500">{FormatPrice (price)} <sup>đ</sup></span>

            </div>
            <div className="absolute top-2 right-2 text-[22px] text-slate-400 cursor-pointer" onClick={handleDeleteItem}>
            <MdCancel />

            </div>


        </div>
            
            
        </>
    );
}

export default ViewedCard;
