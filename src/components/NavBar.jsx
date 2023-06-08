import React, { useContext } from 'react'
import {signOut} from "firebase/auth"
import {auth} from "../firebase"
import {AuthContext} from "../context/AuthContext"

const NavBar = () => {
  const currentUser = useContext(AuthContext)
  const name=currentUser.currentUser.displayName
  const logo=currentUser.currentUser.photoURL
  console.log(currentUser)
  return (
    <div className='navbar'>
      <span className="logo">ChatApp</span>
      <div className="user">
        <img src={logo} alt="" />
        <span>{name}</span>
        <button onClick={()=>signOut(auth)}>log out</button>
      </div>
    </div>
  )
}

export default NavBar
