import React from 'react'
import NavBar from '../components/NavBar'
import Search from '../components/Search'
import Chats from '../components/Chats'
import { AuthContext } from '../context/AuthContext'

const SideBar = () => {
  return (
    <div className='sidebar'>
      <NavBar></NavBar>
      <Search></Search>
      <Chats></Chats>
    </div>
  )
}
export default SideBar
