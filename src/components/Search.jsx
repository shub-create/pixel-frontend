import React,{useState,useEffect} from 'react'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'

import axios from 'axios'
import { baseUrl } from '../utils/fetchUser'



const Search = ({searchTerm}) => {

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState(null);


  useEffect(() => {
    setLoading(true);
    if(searchTerm){ 

    const url = baseUrl+"posts/search";

    axios.post(url,{
        searchTerm : searchTerm
    }).then((data) => {
        setPosts(data.data.posts);
        setLoading(false);
    })

    }
    else{
        const url = baseUrl+"posts/"

         axios.get(url).then((data) => {
         setPosts(data.data.posts);
         setLoading(false);
         })
    }

  },[searchTerm])

  return (
    <>
    {
        loading && 
             <Spinner message="Searching for posts..." />
        
       
    }
    {
        posts?.length !== 0 && <MasonryLayout posts={posts} />
    }
    {
        posts?.length === 0 && !loading && searchTerm !== '' && (
            <div className="text-xl mt-10 text-center">
                No posts found.
            </div>
        )
    }
    </>

  )
}

export default Search