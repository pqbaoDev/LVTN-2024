import { Link, useNavigate } from "react-router-dom";
import { useContext, useRef, useState, useEffect } from "react";
import { authContext } from "../../context/AuthContext";
import { FaFacebookMessenger, FaBell } from "react-icons/fa";
import { FaUser, FaEdit, FaLifeRing, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
    const headerRef = useRef(null);
    const menuRef = useRef();
    const imgRef = useRef();
    const [openProfile, setOpenProfile] = useState(false);
    const { dispatch, user, token } = useContext(authContext);
    const navigate = useNavigate();

    const Menus = [
        { display: "Hồ sơ", icon: <FaUser /> },
        { display: "Chỉnh sửa", icon: <FaEdit /> },
        { display: "Hỗ trợ", icon: <FaLifeRing /> },
    ];

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate("/login");
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target) &&
                imgRef.current && !imgRef.current.contains(e.target)) {
                setOpenProfile(false);
            }
        };

        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    if (!token || !user) {
        return null;
    }

    return (
        <header ref={headerRef}>
            <div className="max-w-full py-5 px-5 mx-auto flex items-center justify-end">
                <div className="flex items-center gap-4">
                    {token && user ? (
                        <div className="flex items-center justify-between gap-5">
                            <div className="flex gap-4">
                                <FaBell className="text-[22px]" />
                                <FaFacebookMessenger className="text-primaryColor text-[22px]" />
                            </div>
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={() => setOpenProfile(!openProfile)}
                                ref={imgRef}
                            >
                                <figure className="w-[35px] h-[35px] rounded-full cursor-pointer">
                                    <img
                                        src={user.photo}
                                        className="w-full rounded-full"
                                        alt=""
                                    />
                                </figure>
                                <h2>{user.name}</h2>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login">
                            <button
                                className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]"
                            >
                                Login
                            </button>
                        </Link>
                    )}
                    {openProfile && (
                        <div className='flex flex-col z-10 dropdownmenu bg-white shadow-lg rounded-md' ref={menuRef}>
                            <ul className='flex flex-col'>
                                {Menus.map((menu, index) => (
                                    <li
                                        key={index}
                                        onClick={() => setOpenProfile(false)}
                                        className='flex items-center gap-2 item-menu'
                                    >
                                        {menu.icon}
                                        {menu.display}
                                    </li>
                                ))}
                                <hr />
                                <li
                                    className='flex items-center gap-2 item-menu'
                                    onClick={handleLogout}
                                >
                                    <FaSignOutAlt className='text-gray-600' />
                                    Đăng xuất
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <hr />
        </header>
    );
}

export default Header;
