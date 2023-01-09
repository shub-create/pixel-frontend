import React, {useEffect, useState} from 'react'
import {Link ,useNavigate} from 'react-router-dom'
import {MdDownloadForOffline} from 'react-icons/md'
import {AiTwotoneDelete} from 'react-icons/ai'
import {BsFillArrowUpRightCircleFill} from 'react-icons/bs' 
import { fetchUser } from '../utils/fetchUser'
import axios from 'axios'
import S3 from 'react-aws-s3';
import { config } from '../utils/aws-upload'

import { baseUrl } from '../utils/fetchUser'

const SinglePost = ({ post}) => {

const {image, _id, destination, postedBy} = post

  const navigate = useNavigate();

  const [postHovered,setPostHovered] = useState(false);
  const [savingPost,setSavingPost] = useState(false);

  const user = fetchUser()

  let alreadySaved = post?.saveArr?.filter((p) => p === user?.sub);
  
  alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

  


  const savePost = (id,userId) => {
    if(alreadySaved?.length===0) {
        setSavingPost(true);

        const url = baseUrl+"posts/save";

        axios.post(url,{
            postId: id,
            userId: userId
        }).then(() => {
            window.location.reload();
            setSavingPost(false);
        })
    }
  }

  const deleteFromS3 = (id) => {
      

    const ReactS3Client = new S3(config);

    const fetchPostUrl = baseUrl+"posts/postId";

    axios.post(fetchPostUrl,{
        postId: id
    }).then((data) => {
        var imageUrl = data.data.post?.image;

        var imageId = imageUrl?.split('/');

        var filename = imageId[imageId?.length-1];

        console.log(filename);

        ReactS3Client
            .deleteFile(filename)
            .then(response => console.log(response))
            .catch(err => console.error(err))
        
    })


  }

  const deletePost=(id,userId) => {
        
         const url = baseUrl+"posts/delete"

        deleteFromS3(id); 
        
        axios.post(url,{
            postId: id,
            userId : userId
        }).then(() => {
            
            window.location.reload();
        })
  }



  return (
    <div className='m-2'>
        <div 
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/post-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
        >
        <img className='rounded-lg w-full' alt="user" src={image} />

        {postHovered && (
            <div className='absolute top-0 w-full h-full flex flex-col justify-between p-2 p2 z-50' style={{height:"100%"}}>
                
               <div className="flex items-center justify-between" >
                   <div className='flex gap-2'>
                        <a
                        href={`${image}?dl=`}
                        download
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                        >
                            <MdDownloadForOffline />
                        </a>
                    </div>
                    { 
                        alreadySaved?.length !== 0 ? (
                        <button type='button' className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none '
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                        >
                           {post?.saveArr?.length} Saved
                        </button>
                        ): (
                        <button 
                        type='button'
                        className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none "
                        onClick={(e) => {
                            e.stopPropagation()
                            savePost(_id,user.sub);
                        }}
                        >
                            {post?.saveArr?.length}   {savingPost ? 'Saving' : 'Save'}
                        </button>    
                        )
                    }
               </div>

               <div className='flex justify-between items-center gap-2 w-full'>
                {
                    destination && (
                        <a
                         href={destination}
                         target="_blank"
                         rel="noreferrer"
                         className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-2 rounded-full opacity-70 hover:100 hover:shadow-md'
                        >
                         <BsFillArrowUpRightCircleFill />
                         { destination.length > 15 ? `${destination.slice(0,15)}...` : destination}
                        </a>
                    )
                }
                {
                    postedBy?.userId === user.sub && (
                        <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            deletePost(_id,user.sub)
                        }}
                        className="bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold text-base rounded-3xl hover:shadow-md outlined-none "                        >
                        <AiTwotoneDelete />
                        </button>
                    )
                } 

               </div>                 
            </div>
        )}

        </div>
        <Link
        to={`/user-profile/${postedBy?.userId}`}
        className="flex gap-2 mt-2 items-center"
        >
            <img 
             className='w-8 h-8 rounded-full object-cover'
             src={postedBy?.image}
             alt="user-profile"
            />
            <p className="font-semibold capitalize">{postedBy?.username}</p>
        </Link>

    </div>
  )
}

export default SinglePost