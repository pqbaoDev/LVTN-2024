import { useContext } from 'react';
import { FaUser, FaEdit, FaLifeRing, FaSignOutAlt } from 'react-icons/fa';
import { authContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dropdownmenu = () => {
    const { dispatch, user, token } = useContext(authContext);
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate("/login");

    };

    if (!token || !user) {
        return null;
    }

    return (
        <div className='flex flex-col dropdownmenu bg-white shadow-lg rounded-md'>
            <ul className='flex flex-col'>
                <li className='flex items-center gap-2 item-menu' key="profile">
                    <FaUser className='text-gray-600' />
                    Hồ sơ
                </li>
                <li className='flex items-center gap-2 item-menu' key="edit">
                    <FaEdit className='text-gray-600' />
                    Chỉnh sửa
                </li>
                <li className='flex items-center gap-2 item-menu' key="support">
                    <FaLifeRing className='text-gray-600' />
                    Hỗ trợ
                </li>
                <hr />
                <li className='flex items-center gap-2 item-menu' onClick={handleLogout} key="logout">
                    <FaSignOutAlt className='text-gray-600' />
                    Đăng xuất
                </li>
            </ul>
        </div>
    );
};

export default Dropdownmenu;
