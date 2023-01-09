import React,{useState,useEffect} from 'react'
import {Link,useParams} from "react-router-dom"
import {MdDownloadForOffline} from "react-icons/md";
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import axios from 'axios'
import { saveAs } from 'file-saver'
import { baseUrl } from '../utils/fetchUser'


const PostDetail = ({user}) => {

   const [posts, setPosts] = useState(null);
   const [postDetail, setPostDetail] = useState(null);
   const [comment, setComment] = useState(" ");
   const [addingComment, setAddingComment] = useState(false);
   const {postId} = useParams();

   const addComment = () => {
      if(comment.length > 0){
        setAddingComment(true);

        const url = baseUrl+"comment/";

        axios.post(url,{
            postId: postId,
            userId: user.userId,
            comment: comment
        })
        .then(() => {
            fetchPostDetails();
            setComment("");
            setAddingComment(false)
        })

      }
   }

   const download = (urlArr) => {
    fetch(urlArr)
        .then(res => res.blob())
        .then((blob) => {
            saveAs(blob, 'image.jpg');
        })  
   }
   

   const fetchPostDetails = () => {
    

    const url = baseUrl+"posts/postId";

    axios.post(url,{
        postId: postId
    }).then((data) => {
        console.log(data);
        setPostDetail(data.data.post);

        if(data.data.post){
            const relatedPostUrl = baseUrl+"posts/category";
            
            axios.post(relatedPostUrl,{
                category: data.data.post.category,
                postId: postId,
            }).then((result)=>{
                setPosts(result.data.posts);
            })

        }
    })



   }

   useEffect(() => {
    fetchPostDetails();
   },[postId]);

   if(!postDetail) return <Spinner message="Loading post..." />

  return (
   <>
    { postDetail && ( 
    <div className='flex xl:flex-row flex-col m-auto overflow-hidden' style={{ maxWidth: "1500px"}}>
       <div className = 'flex justify-center items-center md:items-start flex-initial' >
          <img 
            src={postDetail?.image}
            className=""
            alt="user-post" 
            style={{ maxHeight: "650px"}}
          />
       </div>
       <div className='w-full flex-1 xl:min-w-620 sm:p-0 pt-5 md:p-5 '>
         <div className="flex xl:flex-row flex-col  items-center justify-between">
            <a
                onClick={(e) => { e.stopPropagation();download(postDetail?.image)}}
                className='flex justify-between gap-2 items-center px-3 py-2 rounded-lg text-white text-lg  sm: text-md bg-green-400 cursor-pointer'
            >
                <div>
                    Free Download
                </div>
               <div
                
                >
                    <MdDownloadForOffline /> 
               </div>
            </a>
            <a href={postDetail.destination} target="_blank" rel="noreferrer" className='hidden lg:block bg-slate-300 p-2 rounded-lg' >
            { postDetail.destination.length > 45 ? `${postDetail.destination.slice(0,45)}...` : postDetail.destination}
            </a>
         </div>
         <div>
            <h1 className='text-4xl font-bold break-words mt-7'> 
                {postDetail.title}
            </h1>
            <p className='mt-3'>{postDetail.about}</p> 
         </div>
         <Link
            to={`/user-profile/${postDetail?.postedBy?.userId}`}
            className="flex gap-2 mt-7 items-center rounded-lg"
            >
                <img 
                className='w-8 h-8 rounded-full object-cover'
                src={postDetail?.postedBy?.image}
                alt="user-profile"
                />
                <p className="font-semibold capitalize">{postDetail?.postedBy?.username}</p>
        </Link>
        <h2 className='mt-5 text-2xl'>
            Comments
        </h2>
        <div className='overflow-y-auto' style={{maxHeight: "200px"}}>
            {postDetail?.commentArr?.map((comment,i) => (
                <div className='flex gap-2 mt-5 items-center bg-whit rounded-lg' key={i}>
                    <img 
                     src={comment.postedBy.image} 
                     alt="user-profile"
                     className= 'w-10 h-10 rounded-full cursor-pointer'
                     />
                    <div className='flex flex-col'>
                        <p className='font-bold'> {comment.postedBy.username} </p>
                        <p> {comment.comment} </p>
                    </div>
                </div>
            ))}
        </div>
        <div className='flex flex-wrap mt-6 gap-3 '>
            <Link
                to={`/user-profile/${postDetail?.postedBy?.userId}`}
            >
                <img 
                className='w-10 h-10 rounded-full cursor-pointer'
                src={user?.image}
                alt="user-profile"
                />
            </Link>
            <input 
             className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
             type="text"
             placeholder='Add a comment'
             value={comment}
             onChange={(e) => setComment(e.target.value) }
            />
            <button
              type="button"
              className='bg-red-500 text-white rounded-lg px-3 p-0 py-0 md:px-6 my-1 font-semibold text-base outline-1 '
              onClick={addComment}
            >
             {addingComment ? "Posting comment..." : "Post"}
            </button>
        </div>
       </div>
    </div>
  )
}


{
    posts?.length > 0 && (
        <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
            More like this
        </h2>
    )
}
{
    posts ? (
        <MasonryLayout posts={posts} />
    ) : (
        <Spinner message="Loading more posts" />
    )
}
</>
)
}

export default PostDetail