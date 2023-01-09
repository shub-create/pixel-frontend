import React from 'react'
import {GoogleLogin,GoogleOAuthProvider} from '@react-oauth/google'
import { useNavigate} from "react-router-dom"
import mvid from '../assets/mvid.mp4'
import logo from "../assets/pixel-logo.png"
import jwt_decode from "jwt-decode";

import axios from 'axios';
import { baseUrl } from '../utils/fetchUser'

const Login = () => {

    const navigate = useNavigate();
   
    const responseGoogle = (response) => {
        var decodedReS = jwt_decode(response.credential);
        localStorage.setItem('user' , JSON.stringify(decodedReS))

        const { name , sub , picture} = decodedReS;

        const url = baseUrl+"user/login"

        axios.post(url,{
            userId : sub,
            username : name,
            image : picture 
        }).then(() => {
            navigate('/',{replace: true})
        })

    }

    


  return (
    <div className="flex justify-start items-center flex-col h-screen">
        <div className ="relative w-full h-full">
            <video
                src={mvid}
                type="video/mp4"
                loop
                controls = {false}
                muted
                autoPlay
                className='w-full h-full object-cover'
            />
            <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
                <div>
                  <img src={logo} width="175px" className='mb-6' alt="logo" />
                </div>

                <div className="shadow-2xl ">
                <GoogleOAuthProvider clientId="223891794884-3kou7mum8t9mcekik4rmk1o7oltj596o.apps.googleusercontent.com">
                <GoogleLogin

                      onSuccess={responseGoogle}
                      onFailure={responseGoogle}
                      cookiePolicy="single_host_origin"

                    />
                </GoogleOAuthProvider>; 
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login