/* eslint-disable react/prop-types */
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter
} from "@material-tailwind/react";
import closeIcon from "../../assets/images/close.png"
import HashLoader from 'react-spinners/HashLoader';
import { toast } from "react-toastify";
import { BASE_URL } from "../../../config";
import { useState } from "react";
import {  useNavigate } from "react-router-dom";



const ProductAddDialog = ({open,handleClose}) => {
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewURL, setPriviewURL] = useState("")
    const [formData,setFormData] = useState({
        name:'',
        photo: selectedFile,
        dicount:'',
        stock:'',
        price:'',
        category:'',
        manuFacture:'',
        rating:'',
        description:'',

    });
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const handleInputChange = e =>{
        setFormData ({... formData, [e.target.name]: e.target.value});
    }
    const handleFileInputChange = async (event) =>{
        const file = event.target.files[0];
        const data = await uploadImageToCloudinary(file);
        
        setPriviewURL(data.url);
        setSelectedFile(data.url);
        setFormData({ ... formData, photo: data.url});

       
    }
    const submitHandler = async (event)=>{
       
        event.preventDefault();
         setLoading(true);
         try {
            const res = await fetch(`${BASE_URL}/product`,{
                method: 'post',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                
            })
            const {message} = await res.json();

            if(!res.ok){
                throw new Error(message)
            }
            setLoading(false);
            handleClose();
            navigate('/product')
            toast.success(message);
         } catch (error) {
            toast.error(error.message);
            setLoading(false);
         }
    };


    return (
        <Dialog
            open ={open}
            handler={handleClose}
            size="lg"
            animate={{
                mount:{x:1,y:0},
                unmount:{x:0.9,y:-100}
            }}
      className="mx-auto max-w-lg border border-gray-300 shadow-2xl bg-white"


        >
            <DialogHeader className="  text-white justify-center text-[16px] bg-blue-400 rounded-t-lg">
                <h3 className="text-headingColor text-[22px] leading-9 font-bold ">Thêm 
                <span className="text-primaryColor"> Khách hàng</span></h3>
                <div className=" absolute top-2 right-2">
                        <img src={closeIcon} onClick={handleClose} className='w-5 h-5' alt="" />
                        
                </div>
      </DialogHeader>
      <DialogBody className="p-2">
        
      </DialogBody>
      <DialogFooter>
            <div className="m-0">
                <button 
                disabled = {loading && true}
                type="submit" className="w-full bg-primaryColor  text-white text-[18px] leading-[30px] rounded-lg px-4 py-3">
                    {loading ? <HashLoader size={35} color="#ffffff"/>:'Đăng ký'}
                </button>
            </div>
            
      </DialogFooter>
            
        </Dialog>
    );
}

export default ProductAddDialog;
