import { useContext, useState } from "react";
import {  NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from 'react-icons/fa';
import { authContext } from "../../context/AuthContext";
import logo from "../../assets/images/logo.png";
import miniLogo from "../../assets/images/miniLogo.png";
import control from "../../assets/images/control.png";
import chartFill from "../../assets/images/Chart_fill.png";
import productImg from "../../assets/images/product.png";
import orderImg from "../../assets/images/order.png";
import userImg from "../../assets/images/User.png";
import categoryImg from "../../assets/images/category.png";
import settingImg from "../../assets/images/Setting.png";
import employee from '../../assets/images/employees.png';
import repair from '../../assets/images/repair.png';
import sales from '../../assets/images/sale.png';
import comment from '../../assets/images/Chat.png';
import whouse from '../../assets/images/whouse.png';

const navLinks = [
    { path: '/home', display: 'Thống kê', src: chartFill },
    { path: '/category', display: 'Danh mục', src: categoryImg },
    { path: '/customer', display: 'Khách hàng', src: userImg },
    { path: '/employee', display: 'Nhân viên', src: employee },
    { path: '/product', display: 'Sản phẩm', src: productImg, gap: true },
    { path: '/order', display: 'Đơn hàng', src: orderImg },
    { path: '/warehouse', display: 'Kho hàng', src: whouse },
    { path: '/sales', display: 'Khuyến mãi', src: sales },
    { path: '/repair', display: 'Bảo hành', src: repair },
    { path: '/feedback', display: 'Phản hồi', src: comment, gap: true },
    { path: '/setting', display: 'Cài đặt', src: settingImg }
];

const LeftSideBar = () => {
    const { dispatch } = useContext(authContext);
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);

    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            dispatch({ type: 'LOGOUT' });
            navigate("/login");
        }
    };

    return (
        <section className={`relative p-5 pt-8 h-screen duration-300 bg-primaryColor ${open ? 'w-72' : 'w-20'}`}>
            <img
                src={control}
                className={`absolute cursor-pointer rounded-full -right-3 top-9 w-7 border-2 bg-white ${!open ? 'rotate-180' : ''}`}
                onClick={() => setOpen(!open)}
                alt="Control Toggle"
            />
            <div className=" mb-6">
                {open ? <img src={logo} alt="Logo" className="w-auto" /> : <img src={miniLogo} alt="Mini Logo" className="w-12" />}
            </div>
            <hr />
            
            <nav className="navigation hidden md:block">
                <ul className="py-2">
                    {navLinks.map((link, index) => (
                        <li key={index} className="item-sideBar">
                            <NavLink
                                to={link.path}
                                className={`text-sm flex items-center gap-x-4 cursor-pointer p-2 ${link.gap ?"mt-9":"mt-2"}`}>
                                <img src={link.src} className="w-4 h-4" alt={link.display} />
                                <span className={`${!open && 'hidden'} origin-left duration-300`}>
                                    {link.display}
                                </span>
                            </NavLink>
                        </li>
                    ))}
                    <hr />
                    <li className=' py-3 flex items-center gap-2 text-[16px] px-2 font-medium' onClick={handleLogout}>
                        <FaSignOutAlt className='text-gray-600' />
                        Đăng xuất
                    </li>
                </ul>
            </nav>
        </section>
    );
};

export default LeftSideBar;
