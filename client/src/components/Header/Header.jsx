// import logo from "../../assets/images/logo.png"
import {  Link } from "react-router-dom";
import {BiMenu} from 'react-icons/bi';
import { authContext } from "../../context/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import Dropdownmenu from "./Dropdownmenu";
import { FaFacebookMessenger,FaBell,FaSearch } from "react-icons/fa";



const Header = () => {
    const headerRef = useRef(null);
    const menuRef = useRef(null);
    const {user,token} = useContext(authContext);
    const [openProfile,setOpenProfile]=useState(false)

    const HandleStickyHeader = () => {
        const bodyScrollTop = document.body?.scrollTop || 0;
        const docScrollTop = document.documentElement?.scrollTop || 0;
    
        if (bodyScrollTop > 80 || docScrollTop > 80) {
            headerRef.current.classList.add('sticky__header');
        } else {
            headerRef.current.classList.remove('sticky__header');
        }
    };
    
    useEffect(()=>{
        HandleStickyHeader()
        return ()=> window.removeEventListener('scroll',HandleStickyHeader)
    });
    const toggleMenu = ()=> menuRef.current.toggle('show__menu');

    return (
        <header ref={headerRef} >
            <div className="max-w-full py-5  px-5 mx-auto flex items-center justify-between">
                {/* nav left*/}
                <div className="w-2/3 justify-end flex">

                <div className="relative w-full max-w-lg">
                    <input
                        type="search"
                        placeholder="Tìm kiếm..."
                        className="w-full p-2 pl-10 border border-x-0 border-t-0 border-gray-300  focus:outline-none "
                    />
                    <button className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
                        <FaSearch />
                    </button>
                </div>
                </div>
                
                {/* nav Right  */}
                <div className="flex itmes-center gap-4">
                    
                    {
                        token && user ?<div className=" flex items-center justify-between gap-5">
                    <div className=" flex gap-4 ">
                        <FaBell className="text-[22px]"/>

                        <FaFacebookMessenger className="text-primaryColor text-[22px]"/>
                    </div>

                          <div className="flex items-center justify-between" onClick={()=>setOpenProfile((prev)=>!prev)}>
                            <figure className="w-[35px] h-[35px] rounded-full cursor-pointer">
                                <img src={user.photo} className="w-full rounded-full" alt="" />
                               
                            </figure>
                            <h2>{user.name}</h2>
                            
                          </div>
                        </div>:<Link to='/login'>
                            <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center
                            justify-center rounded-[50px] ">Login</button>
                        </Link>
}
                            
                        
                    
                        
                        <span className="md:hidden" onClick={toggleMenu}>
                            <BiMenu className = 'w-6 h-6  cursor-pointer'/>
                        </span>


                    </div>


            </div>
            {
                openProfile && <Dropdownmenu/>

            }
            <hr />
        </header>
    );
}

export default Header;
