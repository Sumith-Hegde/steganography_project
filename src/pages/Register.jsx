import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth,storage,db } from "../firebase";
import React, { useState } from 'react'
import Add from "../images/add.png"
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate,Link } from "react-router-dom";

export const Register = () => {
  const [err,setErr]=useState(false);
  const navigate=useNavigate();
  const handleSubmit = async (e)=>{
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    // console.log(displayName)
    // console.log(email)
    // console.log(password)

    try{
      const res = await createUserWithEmailAndPassword(auth, email, password)
      console.log(res)

      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
  (error) => {
    setErr(true);
  },
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
      await updateProfile(res.user,{
        displayName
      });
      await setDoc(doc(db,"users",res.user.uid),{
        uid:res.user.uid,
        displayName,
        photoURL:downloadURL
      })

      await setDoc(doc(db,"userChats",res.user.uid),{});
      
      
      
    });
    navigate("/");
  }
);

    }
    catch(err){
      console.log(err)
      setErr(true);
    }
  }
  return (
    <div className="formContainer">
        <div className="formWrapper">
            <span className="logo">ChatApp</span>
            <span className="title">Register</span>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="display name" />
                <input type="email" placeholder="email"/>
                <input type="password" placeholder="password"/>
                <input style={{display:"none"}} type="file" id="file"/>
                <label htmlFor="file">
                  <img src={Add} alt="" />
                  <span>add avatar</span>
                </label>
                <button>Sign Up</button>
                {/* {err && <span>Something went wrong!</span>} */}
            </form>
            <p>You already have an account? <Link to="/login">Login</Link></p>
        </div>
    </div>
  )
}
