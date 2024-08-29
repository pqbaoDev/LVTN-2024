import logo from "../../assets/images/logo.png"
import {  Link } from "react-router-dom";
import {BiMenu} from 'react-icons/bi';
import { authContext } from "../../context/AuthContext";
import { useContext, useEffect, useRef } from "react";




const Header = () => {
    const headerRef = useRef(null);
    const menuRef = useRef(null);
    const {user,role,token} = useContext(authContext);

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
        <header ref={headerRef}>
            <div className="max-w-full px-5 mx-auto flex justify-between">
                {/* nav left*/}
                <div className="flex items-center ">
                    <div >
                        <img src={logo} alt="" width={250} />
                    </div>
                    <div className="search max-w-full mt-[30px]  bg-[#0066ff2c] rounded-md flex items-center justify-between">
                        <input 
                            type="search" className=' py-4 pl-4 pr-2 bg-transparent   focus:outline-none
                            cursor-pointer placeholder:text-textColor ' placeholder='Tìm kiếm' />
                        <button className='btn mt-0 rounded-[0px] rounded-r-md' >Tìm</button>
                    </div>

                </div>
                {/* nav Right  */}
                <div className="flex itmes-center gap-4">
                    {
                        token && user ?<div >
                          <Link to={`${role==='user'? '/users/profile/me':'/admin/profile'}`}>
                            <figure className="w-[35px] h-[35px] rounded-full cursor-pointer">
                                <img src={user.photo} className="w-full rounded-full" alt="" />
                               
                            </figure>
                            {/* <h2>{user?.name}</h2> */}
                          </Link>
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
        </header>
    );
}

export default Header;
