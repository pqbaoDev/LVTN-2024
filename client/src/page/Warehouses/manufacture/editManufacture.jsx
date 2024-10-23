/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../../config";
import { toast } from "react-toastify";
import FormManufacture from "./formManufacture";
import { useNavigate } from "react-router-dom";
import useFetchData from "../../../Hook/userFecthData";

const EditManufacture = ({ id }) => {
    const { data: manufactures } = useFetchData(`${BASE_URL}/manufacture/${id}`);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        photo: '',
        email: ''
    });

    useEffect(() => {
        if (manufactures) {
            // Kiểm tra từng thuộc tính trước khi cập nhật formData
            setFormData({
                name: manufactures.name || '',   // Đặt giá trị mặc định là chuỗi rỗng
                address: manufactures.address || '',
                phone: manufactures.phone || '',
                photo: manufactures.photo || '',
                email: manufactures.email || ''
            });
        }
    }, [manufactures]);

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/manufacture/${id}`, {
                method: 'PUT',
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
                <h2 className="heading">Chỉnh sửa nhà phân phối</h2>
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

export default EditManufacture;
