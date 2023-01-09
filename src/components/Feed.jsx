import React , {useState,useEffect} from 'react'
import {useParams} from "react-router-dom"
import axios from 'axios'

import MasonryLayout from './MasonryLayout'
import { baseUrl } from '../utils/fetchUser'
import Spinner from './Spinner'


const Feed = () => {
  
  const [loading,setLoading] = useState(false);
  const [posts,setPosts] = useState(null);

  const {categoryId} = useParams();
  
  useEffect(() => {

    setLoading(true);

    if(categoryId) {
      
      const url = baseUrl+"posts/category"
      axios.post(url,{
         category: categoryId
      }).then((data) => {
         setPosts(data.data.posts);
         setLoading(false);
      })



    } else{
   const url = baseUrl+ "posts/"
   axios.get(url).then((data) => {
         setPosts(data.data.posts);
         setLoading(false);
   })

    }

  },[categoryId,posts?.length] )
  
if(!posts?.length) return <h2> No posts found 😶</h2>
  

  return (
    <>
        { loading && 
           <div className="flex w-full" style={{height: "70vh"}}>
           
                 <Spinner message="Please wait while we find you new ideas!" />
            </div>
           }
     
     <div>
        { posts && (
            <MasonryLayout posts={posts} />
        )}
     </div>
     </>
   )
}

export default Feed