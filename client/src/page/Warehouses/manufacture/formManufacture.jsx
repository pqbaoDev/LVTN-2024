/* eslint-disable react/prop-types */

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import uploadImageToCloudinary from "../../../utils/uploadCloudinary";
import HashLoader from "react-spinners/HashLoader";
import { FaAddressBook, FaPlus } from "react-icons/fa";


const FormManufacture = ({formData,setFormData,submitHandler,loading}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState("");

    
    

    const handelInputChange = (e) => {
        setFormData(prevData => ({
            ...prevData, [e.target.name]: e.target.value
        }));
    }
    const handleFileInputChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const data = await uploadImageToCloudinary(file);
            setSelectedFile(data.url);
            setFormData({ ...formData, photo: data.url });
        }
    };

    const openModal = (imageUrl) => {
        setModalImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalImage("");
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isModalOpen) {
                closeModal();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isModalOpen]);


    
    return (
        <>
            <div>
                <form action="" onSubmit={submitHandler}>
                    <div className="grid grid-cols-12 w-2/3 mx-auto">
                    <div className="mb-5 flex items-center justify-center col-span-2">
                        {formData.photo && (
                            <figure className="w-[150px] shadow-xl p-2 border-2 border-solid border-primaryColor flex items-center justify-center">
                                <img
                                    src={formData.photo}
                                    alt="Uploaded product"
                                    className="toZoom"
                                    onClick={() => openModal(formData.photo)}
                                />
                            </figure>
                        )}
                        <div className="relative">
                            <input
                                type="file"
                                name="photo"
                                id="file-input"
                                accept=".jpg, .png"
                                onChange={handleFileInputChange}
                                className="absolute bottom-0 left-10 w-full h-full opacity-0 cursor-pointer"
                            />
                            <label
                                htmlFor="file-input"
                                className="absolute top-9 -left-28 flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-primaryColor text-white font-semibold rounded-lg truncate cursor-pointer"
                            >
                                {selectedFile || formData.photo ? 'Thay đổi' : 'Tải ảnh lên'}
                            </label>
                        </div>
                    </div>
                    <div className="m-5 col-span-9">
                        <div className="mx-auto grid grid-cols-2  ">
                            <div className="grid grid-cols-4  mb-3 mx-auto items-center">
                                <p className="form__label col-span-1">Tên NPP:</p>
                                <input onChange={handelInputChange} type="text" name="name" value={formData.name} placeholder="Nhập tên nhà phân phối.." className="col-span-3 ml-1 border-2 border-blue-300 rounded-lg focus: outline-none py-2 px-3" />
                            </div>
                            <div className="grid grid-cols-4  mb-3 mx-auto items-center">
                                <p className="form__label col-span-1">Email:</p>
                                <input onChange={handelInputChange} type="email" name="email" value={formData.email} placeholder="Nhập Email nhà phân phối.." className="col-span-3 border-2 border-blue-300 rounded-lg focus: outline-none py-2 px-3" />
                            </div>
                        </div>
                        <div className="mx-auto grid grid-cols-2 ">
                            <div className="grid grid-cols-4  mb-3 mx-auto items-center ">
                                <p className="form__label col-span-1">SĐT:</p>
                                <input onChange={handelInputChange} type="text" name="phone" value={formData.phone} placeholder="Nhập sđt nhà phân phối.." className="col-span-3 border-2 border-blue-300 rounded-lg focus: outline-none py-2 px-3" />
                            </div>
                            <div className="grid grid-cols-4  mb-3 mx-auto items-center">
                                <p className="form__label col-span-1">Địa chỉ:</p>
                                <input onChange={handelInputChange} type="text" name="address" value={formData.address} placeholder="Nhập địa chỉ nhà phân phối.." className="col-span-3 border-2 border-blue-300 rounded-lg focus: outline-none py-2 px-3" />
                            </div>
                        </div>

                    
                    </div>
                    <div className="flex justify-center items-center">
                    <div className="text-center items-center col-span-1">
                        <button type="submit" className="border bg-primaryColor text-white rounded-xl p-2 px-3">{loading ? <HashLoader />:'Lưu'}</button>
                    </div>
                    </div>
                    </div>
                </form>

            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-5">
                        <button onClick={closeModal} className="absolute top-0 right-0 m-2 text-lg">X</button>
                        <img src={modalImage} alt="Phóng to" className="max-w-full h-auto" />
                    </div>
                </div>
            )}
            
        </>
    );
}

export default FormManufacture;
