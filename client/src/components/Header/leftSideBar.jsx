import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from 'react-icons/fa';
import { authContext } from "../../context/AuthContext";
import logo from "../../assets/images/logo.png";
import miniLogo from "../../assets/images/miniLogo.png";
import control from "../../assets/images/control.png";
import chartFill from "../../assets/images/Chart_fill.png";
import productImg from "../../assets/images/product.png";
import orderImg from "../../assets/images/order.png";
import userImg from "../../assets/images/User.png";
import settingImg from "../../assets/images/Setting.png";
import employee from '../../assets/images/employees.png';
import repair from '../../assets/images/repair.png';
import sales from '../../assets/images/sale.png';
import comment from '../../assets/images/Chat.png';
import whouse from '../../assets/images/whouse.png';

const navLinks = [
    { path: '/home', display: 'Thống kê', src: chartFill },
    { path: '/user', display: 'Khách hàng', src: userImg },
    { path: '/employee', display: 'Nhân viên', src: employee },
    { path: '/product', display: 'Sản phẩm', src: productImg, gap: true },
    { path: '/order', display: 'Đơn hàng', src: orderImg },
    { path: '/warehouse', display: 'Kho hàng', src: whouse },
    { path: '/promotion', display: 'Khuyến mãi', src: sales },
    { path: '/warranty', display: 'Bảo hành', src: repair },
    { path: '/feedback', display: 'Phản hồi', src: comment, gap: true },
    { path: '/setting', display: 'Cài đặt', src: settingImg }
];

// Thành phần phụ cho các mục điều hướng
// eslint-disable-next-line react/prop-types
const NavItem = ({ path, display, src, gap, open }) => (
  <li className="item-sideBar ">
    <NavLink
      to={path}
      className={`text-l group relative flex items-center gap-x-4 cursor-pointer p-2 ${
        gap ? "mt-9" : "mt-2"
      }`}
    >
      <img src={src} className="w-4 h-4" alt={display} />
      <span className={`${!open && "hidden"} origin-left duration-300`}>
        {display}
      </span>
      {!open && (
        <div
          className={`absolute left-full rounded-md py-1 ml-6  w-20 flex justify-center 
                bg-indigo-100 text-indigo-800 text-sm z-10
                 invisible
                 opacity-20 -translate-x-3
                 transition-all
                 group-hover:visible
                 group-hover:opacity-100 group-hover:translate-x-0
                `}
        >
          {display}
        </div>
      )}
    </NavLink>
  </li>
);

const LeftSideBar = () => {
    const { dispatch } = useContext(authContext);
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);

    // Xử lý đăng xuất
    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            try {
                dispatch({ type: 'LOGOUT' });
                navigate("/login");
            } catch (error) {
                console.error("Đăng xuất thất bại:", error);
                // Có thể hiển thị thông báo lỗi cho người dùng ở đây
            }
        }
    };

    return (
      <section
        className={` relative p-5 pt-8 duration-300 h-full bg-primaryColor text-white ${
          open ? "w-52" : "w-20"
        }`}
      >
        <img
          src={control}
          className={`absolute cursor-pointer rounded-full -right-3 top-[325px] w-7 border-2 bg-white ${
            !open ? "rotate-180" : ""
          }`}
          onClick={() => setOpen(!open)}
          alt="Chuyển đổi điều khiển"
        />
        <div className="mb-6">
          {open ? (
            <img src={logo} alt="Logo" className="w-auto" />
          ) : (
            <img src={miniLogo} alt="Logo nhỏ" className="w-12" />
          )}
        </div>
        <hr />
        <nav className="navigation  hidden md:block">
          <ul className="py-2">
            {navLinks.map((link, index) => (
              <NavItem
                key={index}
                path={link.path}
                display={link.display}
                src={link.src}
                gap={link.gap}
                open={open}
              />
            ))}
            <hr />
            <li
              className="py-3 flex items-center gap-2 text-[16px] px-2 font-medium cursor-pointer"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="text-gray-600" />
              Đăng xuất
            </li>
          </ul>
        </nav>
      </section>
    );
};

export default LeftSideBar;
