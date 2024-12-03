/* eslint-disable react/prop-types */

import { useState } from "react";
import ProductDetail from "./productDetail";
import { FaRegTrashAlt } from "react-icons/fa";
import ProductDelete from "./productDelete";

const ProductItem = ({products,setRefetch}) => {
    const {name,size,avatar, category, manuFacture, stock,_id}=products;
    const [isOpenProDetail,setIsOpenProDetail] = useState(false);
    const [isOpenDelete,setIsOpenDelete] = useState(false);
    const [selectedId,setSelectedId] = useState('')
    const handelOpenProDetail = (id)=>{
        setSelectedId(id);
        setIsOpenProDetail(true);
    }
    const handleCloseProDetail = ()=>{
        setIsOpenProDetail(false);
        setSelectedId(null)
    }

    const handelOpenDelete = (id)=>{
        setSelectedId(id);
        setIsOpenDelete(true);
    }
    const handleCloseDelete = ()=>{
        setIsOpenDelete(false);
        setSelectedId(null)
    }
    return (
        <>
            <div className="py-3 px-1 relative lg:b-5  border border-slate-400 rounded-lg bg-[#3399FF] cursor-pointer" >
                <div onClick={()=>handelOpenProDetail(_id)} >
                    <div className="h-[160px] flex justify-center p-4">
                        
                                <img  src={avatar} className="max-w-[217px]"  />
                           
            
                    </div>
                    <div className='p-3'>
            
            
                    <div className="text-[14px] h-[50px]  text-headingColor font-semibold overflow-x-clip "> {category.name} {name } {size}</div>
            
                    <div>Hãng: {manuFacture.name}</div>
                    <div>số lượng: {stock}</div>
                    </div>
            
                </div>
                
                <div onClick={()=>handelOpenDelete(_id)} className="absolute z-30 text-red-500 shadow-lg -top-3 -right-2 border border-red-500 p-2 bg-white rounded-full">
                    <FaRegTrashAlt />

                </div>
                
            
            </div>
                <ProductDetail
                    open={isOpenProDetail}
                    productId={selectedId}
                    handleClose={handleCloseProDetail}
                    setRefetch={setRefetch}
            
                 />
                 <ProductDelete
                    open={isOpenDelete}
                    handleClose={handleCloseDelete}
                    productId={selectedId}
                    setRefetch={setRefetch}
                 />
        </>
    );
}

export default ProductItem;
