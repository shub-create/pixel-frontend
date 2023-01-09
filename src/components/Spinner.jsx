import React from 'react'
import {Circles} from 'react-loader-spinner'

const Spinner = ({message}) => {
  return (
    <div className=" flex flex-col justify-center items-center w-full h-full">
        <Circles
         
         color="#00BFFF"
         height={50}
         width={200}
        />
        <p className="mt-8 text-center text-lg"> {message}</p>
    </div>
  )
}

export default Spinner