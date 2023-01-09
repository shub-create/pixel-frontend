import React, {useState} from 'react'
import {Routes, Route} from 'react-router-dom'

import { Navbar, Feed , Search, CreatePost, PostDetail,  } from '../components'

const Posts = ({user}) => {

 const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className='px-2 md: px-5'>
        <div className='bg-gray-50'>
           <Navbar user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div className='h-full'>
            <Routes>
                <Route path='/' element={<Feed />} />
                <Route path='/category/:categoryId' element={<Feed />} />
                <Route path='/post-detail/:postId' element={<PostDetail user={user} />} />
                <Route path='/create-post' element={<CreatePost user={user}/>} />
                <Route path='/search' element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
            </Routes>

        </div>
    </div>
  )
}

export default Posts