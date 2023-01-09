import React, {useEffect, useState} from 'react'
import {AiOutlineCloudUpload} from 'react-icons/ai';
import {MdDelete} from 'react-icons/md';
import {useNavigate} from 'react-router-dom'

import Spinner from './Spinner';

import { categories } from '../utils/data';

import { config } from '../utils/aws-upload';

import S3 from 'react-aws-s3';

import axios from 'axios';

import { baseUrl } from '../utils/fetchUser'

window.Buffer = window.Buffer || require("buffer").Buffer;





const CreatePost = ({user}) => {
  
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState(false)
  const [category, setCategory] = useState(null)
  const [imageAsset, setImageAsset] = useState(null)
  const [wrongImageType, setWrongImageType] = useState(false)

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (imageAsset) {
      setImageUrl(URL.createObjectURL(imageAsset));
    }
  }, [imageAsset])

  const navigate = useNavigate();

  const imageType = ["image/png" ,"image/svg","image/gif","image/tiff", "image/jpg" ,"image/jpeg" ];

  const uploadImage = (e) => {
      const {type,name} = e.target.files[0];

      if(imageType.includes(type)){
        setWrongImageType(false);  
        setLoading(true);
        setImageAsset(e.target.files[0]);
        setLoading(false);

      }
      else {
        setWrongImageType(true);
        setTimeout(() => {
          setWrongImageType(false)
        },4000)
      }
  }
  
  

  const savePost = () => {
    const ReactS3Client = new S3(config);

    if(title && about && destination && imageAsset && category){

      ReactS3Client
      .uploadFile(imageAsset)
      .then((data) => {
         
        const url =  baseUrl+"posts/create";
        axios.post(url,{
          title,
          about,
          destination,
          category,
          image : data.location,
          userId : user.userId
        }).then(()=> {
           navigate('/')
        })
     
      })
      .catch(err => console.error(err))

    }

    else{
      setFields(true);
      setTimeout(() => {
        setFields(false)
      },3000)
    }
      
    


  }
 
  return (
    <div className="flex flex-col justify-center items-center mt-10 lg:h-4/5">
      {
        fields && (
          <p className="text-white mb-5 sm:text-sm  md:text-xl transition-all duration-150 ease-in bg-red-400 flex justify-center md:w-1/2 p-1 pr-3 pl-3  rounded-lg">
            Please fill in all the details.
          </p>
        )
      }
      { wrongImageType && 
      <p className='text-white mb-5 sm:text-sm  md:text-xl transition-all duration-150 ease-in bg-red-400 flex justify-center md:w-1/2 p-1 pr-3 pl-3  rounded-xl'>Please input valid image type.</p>
      }
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full shadow-sm ">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
           <div className='flex justify-center  items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-370 md:h-420'>
              
                {loading && (
                 
                  <Spinner />
               
                )} 
              
               
              { !imageAsset && !loading ? (
                <label>
                  <div className="flex flex-col items-center justify-center h-full cursor-pointer">
                    <div className='flex flex-col items-center justify-center '>
                      <p className="font-bold text-3xl">
                        <AiOutlineCloudUpload />
                      </p>
                      <p className='text-lg'>Click to upload</p>
                    </div>
                    <p className="text-gray-400 mt-10 text-center text-sm md:text-lg">
                        Use high-quality JPG, SVG, PNG, GIF less than 20 MB.
                    </p>
                  </div>
                  <input
                   type="file"
                   name="upload-image"
                   onChange={uploadImage}
                   className="w-0 h-0"
                  />
                </label>
              ): (
                 <>
                  {
                    !loading && (
                      <div className='relative h-full'>  
                          <img src={imageUrl} alt='uploaded-image' className='h-full w-full' />
                            <button
                            type='button'
                            className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                            onClick={() => {setImageAsset(null);setImageUrl(null)} }
                            >
                              <MdDelete />
                            </button>
                      </div>
                    )
                  }
                </>
                  
              )}
           </div>
        </div>
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
            <input 
             type="text"
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             placeholder="Add your title here"
             className="outline-none text-xl md:text-2xl font-bold border-b-2 border-gray-200 p-2"
             />
             {
              user && (
                <div className='flex gap-2 my-2 items-center bg-white rounded-lg'>
                    <img src={user.image}
                     className="w-10 h-10 rounded-full"
                     alt="user-profile"
                     />
                     <p className='font-bold capitalize'>{user.username}

                     </p>
                </div>
              )
             }
             <input 
             type="text"
             value={about}
             onChange={(e) => setAbout(e.target.value)}
             placeholder="Add details about your post"
             className="outline-none text-lg md:text-xl border-b-2 border-gray-200 p-2"
             />

             <input 
             type="text"
             value={destination}
             onChange={(e) => setDestination(e.target.value)}
             placeholder="Add a destination link"
             className="outline-none text-lg md:text-xl border-b-2 border-gray-200 p-2"
             />

             <div className='flex flex-col'>
              <div>
                <p className='mb-2 font-normal text-lg sm:text-xl'>
                  Choose Post Category
                </p>
                <select
                onChange={(e) => setCategory(e.target.value)}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-3 rounded-md cursor-pointer"
                >
                  <option value="other" className='bg-white '> Select Category</option>
                  {
                    categories.map((item) => (
                      <option value={item.name} className='text-base border-0 outline-none capitalize bg-white text-black'>{item.name}</option>
                    ))
                  }

                </select>
              </div>
              <div className='flex md:justify-end justify-center items-end mt-8 mb-4'>
                  <button
                  type="button"
                  onClick={savePost}
                  className="bg-red-500 text-white font-bold p-2 rounded-lg w-28 outline-none"
                  >
                      Save Post
                  </button>
              </div>

             </div>

            
        </div>
      </div>
    </div >
  )
}


export default CreatePost