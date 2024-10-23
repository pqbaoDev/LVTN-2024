/* eslint-disable react/prop-types */
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter
} from "@material-tailwind/react";
import closeIcon from "../../assets/images/close.png";
import { BASE_URL,token } from "../../../config";
import { toast } from "react-toastify";
const WarrantiesDeleteDialog = ({open,warrantiesIds,handleClose}) => {
    const handleDelete = async e =>{
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/warranty/${warrantiesIds}`,{
                method: 'delete',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,

                },
                body: JSON.stringify({_id:warrantiesIds})
            })
            const result = await res.json();
            handleClose();
            toast.success(result.message);
            if(!res.ok){
                throw  Error(result.message)
            }
        } catch (error) {
          toast.error(error.message);
            
        }
    }
    return (
        <Dialog
            open = {open}
            handler={handleClose}
            animate={{
                mount: { x: 1, y: 0 },
                unmount: { x: 0.9, y: -100 }
            }}
            className="mx-auto max-w-lg h-1/3 border border-gray-300 shadow-2xl bg-white"
        
        >
           <DialogHeader className="  text-white justify-center text-[16px] rounded-t-lg bg-blue-400">
          <span>
  
              Xóa bảo hành
          </span>
          <div className=" absolute top-2 right-2">
                          <img src={closeIcon} onClick={handleClose} className='w-5 h-5' alt="" />
                          
                      </div>
        </DialogHeader>
        <DialogBody className="p-4">
              <div>
                  <p>Bạn có chắc là muốn xóa bảo hành không!</p>
              </div>
            
        </DialogBody>
        <DialogFooter className="bg-gray-100 justify-end">
          <div className="mt-7 mr-3">
              <button type="submit" onClick={handleDelete} className="bg-red-500 text-white text-[18px] leading-[30px] w-full py-3 px-4 rounded-lg">Xóa</button>
          </div>
          
          
        </DialogFooter>
        </Dialog>
    );
}

export default WarrantiesDeleteDialog;
