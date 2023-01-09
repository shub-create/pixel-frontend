import React, { useState, useRef, useEffect} from 'react'
import { HiMenu} from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import {Link, Route,Routes} from 'react-router-dom'

import { Sidebar, UserProfile } from '../components'

import Posts from './Posts'
import logo from '../assets/pixel-logo.png'
import { fetchUser } from '../utils/fetchUser'

import axios from 'axios';
import { Navigate } from "react-router-dom";

import { baseUrl } from '../utils/fetchUser'


const Home = () => {

 const [toggleSideBar,setToggleSideBar] = useState(false);

 const [user,setUser] = useState(null)

 const scrollRef = useRef(null);

 const userInfo = fetchUser()
 useEffect(() => {

   const url =  baseUrl +"user/user"
       
   axios.post(url,{
         userId: userInfo?.sub
       }).then((data)=> {
      setUser(data.data.user);
   })
      

 },[]);

 useEffect(() => {
     
   if(userInfo){
      scrollRef.current.scrollTo(0,0)
   }
     
     
 },[])
  
   if(!userInfo) {
      return <Navigate to="/login" />;
   }


  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out " >
        
        {/* big screen */}
        <div className= "hidden md:flex h-screen flex-initial">
           <Sidebar user={user && user} />
        </div>

        {/* small screen */}
        <div className='flex md:hidden flex-row'>
            <div className='p-4 w-full flex flex-row justify-between items-center shadow-md'>
               <HiMenu fontSize={40} className="cursor-pointer"  onClick={() => setToggleSideBar(true)}  />
               <Link to="/">
                <img src={logo} alt="logo" width="125px" />
               </Link>
               <Link to={`/user-profile/${user?.userId}`}>
                <img src={user?.image} alt="logo" width="40px" className='rounded-full' />
               </Link>
            </div>
            { toggleSideBar && (
            <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in ">
                <div className="absolute w-full flex justify-end items-center p-2">
                   <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSideBar(false)} />
                </div>
                <Sidebar user={user && user} closeToggle={setToggleSideBar}/>     
            </div>     
            )}
        </div>
        
        <div className='pb-2 flex-1 h-screen overflow-y-scroll ' ref={scrollRef} >
           <Routes>
              <Route path= "/user-profile/:userId" element={<UserProfile />}/>
              <Route path="/*" element={<Posts  user= { user && user}/>} />
           </Routes> 
            
        </div>
         

    </div>
  )
}

export default Home