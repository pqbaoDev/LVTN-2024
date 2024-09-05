/* eslint-disable react/prop-types */
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
  } from "@material-tailwind/react";
  import useFetchData from "../../Hook/userFecthData";
  import { BASE_URL, token } from "../../../config";
  import { toast } from "react-toastify";
  import closeIcon from "../../assets/images/close.png"
  
  const EmployeeDeleteDialog = ({ open, handleClose, employeeId }) => {
    const { data:employee, loading, error } = useFetchData(`${BASE_URL}/employee/${employeeId}`);
    const DeleteProfileHandle = async e =>{
      e.preventDefault();
      try {
          const res = await fetch(`${BASE_URL}/employee/${employeeId}`,{
              method: 'delete',
              headers:{
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
              
          })
          const result = await res.json();
          handleClose();
          toast.success(result.message);
          // navigate('/users/profile/me')
  
          if(!res.ok){
              throw  Error(result.message)
          }
      } catch (error) {
          toast.error(error.message);
          // setLoading(false);
  
  
          
      }
  };
  
    return (
      <Dialog
        size="lg"
        open={open}
        handler={handleClose}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="mx-auto max-w-lg h-1/3 border border-gray-300 shadow-2xl bg-white"
      >
        <DialogHeader className="  text-white justify-center text-[16px] rounded-t-lg bg-blue-400">
          <span>
  
              Xóa tài khoản Nhân viên
          </span>
          <div className=" absolute top-2 right-2">
                          <img src={closeIcon} onClick={handleClose} className='w-5 h-5' alt="" />
                          
                      </div>
        </DialogHeader>
        <DialogBody className="p-4">
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          {employee && (
              <div>
                  <h3>Bạn có muốn xóa nhân viên <span className="text-[18px] font-semibold text-primaryColor">{employee.name}</span>?</h3>
              </div>
          )}
            
        </DialogBody>
        <DialogFooter className="bg-gray-100 justify-end">
          <div className="mt-7 mr-3">
              <button type="submit" onClick={DeleteProfileHandle} className="bg-red-500 text-white text-[18px] leading-[30px] w-full py-3 px-4 rounded-lg">Xóa</button>
          </div>
          
          
        </DialogFooter>
      </Dialog>
    );
  };
  
  export default EmployeeDeleteDialog;
  