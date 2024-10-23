/* eslint-disable no-unused-vars */
import { useState } from "react";
import { BASE_URL } from "../../../../config";
import { toast } from "react-toastify";
import FormManufacture from "./formManufacture";
import { useNavigate } from "react-router-dom";


const AddManufacture = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        photo: '',
        email: ''
    });
    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/manufacture`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(formData)

            });
            const { message } = await response.json();
            if (!response.ok) {
                throw new Error(message);
            }
            toast.success(message);
            navigate('/warehouse');
        } catch (error) {
            toast.error(`Lỗi: ${error.message}`);
        } finally {
            setLoading(false);
        }

    }


    return (
        <div>
            <div className="text-center mb-5">
                <h2 className="heading">Thêm nhà phân phối</h2>
            </div>
            <div>
                <FormManufacture
                    formData={formData}
                    setFormData={setFormData}
                    submitHandler={submitHandler}
                    loading={loading}
                />
            </div>


        </div>

    );
}

export default AddManufacture;
