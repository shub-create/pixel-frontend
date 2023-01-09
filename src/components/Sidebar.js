import React from 'react'
import {NavLink , Link} from 'react-router-dom';
import {RiHomeFill} from 'react-icons/ri';
import { IoIosArrowForward} from 'react-icons/io'

import logo from '../assets/pixel-logo.png'
import { categories } from '../utils/data';


const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize'
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize'


const Sidebar = ({user, closeToggle}) => {

 const handleCloseSideBar = () => {
    if(closeToggle) closeToggle(false)
 }

  return (
    <div className='flex flex-col justify-between bg-white h-full overflow-y-auto min-w-210 scrollbar-hide'>
        <div className='flex flex-col'>
           <Link
            to="/"
            className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
            onClick={handleCloseSideBar}
           >
            <img src= {logo} alt="logo" width="125px" />
           </Link>
           <div className='flex flex-col gap-5'>
            <NavLink
                to="/"
                className={({isActive}) => (isActive ? isActiveStyle : isNotActiveStyle) } 
                onClick={handleCloseSideBar}
            >
            <RiHomeFill />
            Home
            </NavLink>
            <h3 className='mt-2 px-5 text-base 2xl:text-xl' >
             Discover Categories
            </h3>
             {  
                categories.slice(0,categories.length-1).map((category) =>(
                    <NavLink
                     to={`/category/${category.name}`}
                     className={({isActive}) => (isActive ? isActiveStyle : isNotActiveStyle) } 
                     onClick={handleCloseSideBar}
                     key={category.name}
                    >
                    <img src={category.image} className="w-8 h-8 rounded-full shadow-sm" />     
                     { category.name}
                    </NavLink>
                ) )
             }
           </div>
        </div>
        { user && (
            <Link
             to={`/user-profile/${user.userId}`}
             className="flex mb-3 my-5 gap-2 p-2 items-center bg-gray-50 rounded-lg shadow-2xl mx-3"
             onClick={handleCloseSideBar}
            >
              <img src={user.image} className="w-9 h-9 rounded-full" alt="user-profile" /> 
              <p > { user.username } </p>
              <IoIosArrowForward />
            </Link>
        )}


    </div>
  )
}

export default Sidebar