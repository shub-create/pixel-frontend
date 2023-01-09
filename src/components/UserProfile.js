import React,{ useState,useEffect} from 'react'
import {AiOutlineLogout} from 'react-icons/ai';
import {useParams , useNavigate } from 'react-router-dom'
import { googleLogout} from '@react-oauth/google'
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import axios from 'axios';
import { baseUrl } from '../utils/fetchUser'

const UserProfile = () => {

   const [user,setUser] = useState(null);
   const [posts,setPosts] = useState(null);
   const [text, setText] = useState('Created');
   const [activeBtn,setActiveBtn] = useState('created');

   const navigate = useNavigate();
   const {userId} = useParams();

   const activeBtnStyle = "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none"
   const notActiveBtnStyle = "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none"

   const randomImage = "https://source.unsplash.com/1600x900/?abstract";

   useEffect(() => {

    const url = baseUrl+"user/user"

    axios.post(url,{
        userId : userId
    }).then((data) => {
        setUser(data.data.user)
    })
      
   },[userId])


   useEffect(() => {
        if(text === "Created"){
            const url = baseUrl+"posts/user-post"

            axios.post(url,{
                userId: userId
            }).then((data) => {
                setPosts(data.data.posts);
            })
        }
        else {
            const url = baseUrl + "posts/user-saved"

            axios.post(url,{
                userId: userId
            }).then((data) => {
                setPosts(data.data.savedPosts);
            })
        }

   },[text, userId])

   const logout = () => {
    googleLogout();
    localStorage.clear();

    navigate('/login');
   }

   if(!user) return <Spinner message="Loading user profile..." />

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
        <div className='flex flex-col pb-5'>
            <div className='relative flex flex-col mb-7'>
                <div className='flex flex-col justify-center items-center '>
                    <img 
                        src={randomImage}
                        className="w-full h-340 2xl:h-510 shadow-lg object-cover"
                        alt="banner"
                    />
                    <img 
                       src={user.image}
                       className="rounded-full w-30 h-30 -mt-10 shadow-xl object-cover"

                    />
                    <h1 className='font-bold text-3xl text-center mt-3'>
                        {user.username}
                    </h1>
                    <div className='absolute top-1 z-1 right-1 p-2'>
                        {
                            userId === user.userId && (
                                <button
                                 type='button'
                                 className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md'
                                 onClick={logout}
                                >
                                <AiOutlineLogout color="red" fontSize={21} />
                                </button>
                            )
                        }
                    </div>

                </div>
                <div className='text-center mt-5 mb-7'>
                    <button
                     type="button"
                     onClick={(e) => {
                        setText(e.target.textContent);
                        setActiveBtn('created');
                     }}
                     className={`${activeBtn === "created" ? activeBtnStyle : notActiveBtnStyle }`}
                    >
                        Created
                    </button>
                    <button
                     type="button"
                     onClick={(e) => {
                        setText(e.target.textContent);
                        setActiveBtn('saved');
                     }}
                     className={`${activeBtn === "saved" ? activeBtnStyle : notActiveBtnStyle }`}
                    >
                        Saved
                    </button>
                </div>

                {

                    posts?.length ? (
                        <div className='px-2'>
                            <MasonryLayout posts={posts} />
                        </div>    
                    ) : (
                        <div className='flex justify-center font-bold items-center w-full text-xl mt-4  rounded-full'>
                            <div className='text-xl font-normal w-auto px-5 py-1'>
                            No Posts Found 😶
                            </div>
                        </div>
                    )
                }

                 
            </div>
        </div>
        
    </div>
  )
}

export default UserProfile