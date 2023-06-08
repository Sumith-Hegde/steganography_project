import React from 'react'
import { useNavigate,Link } from "react-router-dom";
import { useState } from 'react'
import {auth} from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth";

export const Login = () => {
  const [err,setErr]=useState(false);
  const navigate=useNavigate();
  const handleSubmit = async (e)=>{
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    // console.log(email)
    // console.log(password)

    try{
     await signInWithEmailAndPassword(auth, email, password)
      navigate("/");
    }
    catch(err){
      setErr(true);
    }
  }
  return (
    <div className="formContainer">
        <div className="formWrapper">
            <span className="logo">ChatApp</span>
            <span className="title">Login</span>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="display name" />
                <input type="password" placeholder="password"/>
                <button>Login</button>
            </form>
            <p>Do not have an account? <Link to="/register">Register</Link></p>
        </div>
    </div>
  )
}
