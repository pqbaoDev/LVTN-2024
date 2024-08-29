
import { useRef } from "react";
// import {authContext} from "../../context/AuthContext";
import {NavLink } from "react-router-dom";
// import {BiMenu} from 'react-icons/bi';



const navLinks=[
    {
        path:'/home',
        display:'Trang chủ'
    },
    {
        path:'/product',
        display:'Sản phẩm'
    },
    {
        path:'/order',
        display:'Đơn hàng'
    },
    {
        path:'/customer',
        display:'Khách hàng'
    },
    {
        path:'/category',
        display:'Danh mục'
    },
]
const LeftSideBar = () => {
    const headerRef = useRef(null);
   
    // const{user,role,token} = useContext(authContext);

    
    return (
        <header className="header items-center" ref={headerRef}>
            <div className="container">
            <div className="max-md:hidden navigation ">
                <ul>
                    {navLinks.map((link,index)=>(
                        <li key={index}>
                            <NavLink 
                                to={link.path} 
                                className={navClass => navClass.isActive 
                                    ?"text-primaryColor text-[16px] leading-7 font-[600]"
                                    :"text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor"
                                    }
                                > 
                                    {link.display}
                                </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
            </div>
           
        </header>
    );
}

export default LeftSideBar;

