import React, { useContext } from 'react'
import vc from "../images/vc.png"
import ac from "../images/ac.PNG"
import m from "../images/m.png"
import Messages from "./Messages.jsx"
import Input from "./Input.jsx"
import { ChatContext } from '../context/ChatContext.js'

const Chat = () => {
  const {data}=useContext(ChatContext)
  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img src={vc} alt="" />
          <img src={ac} alt="" />
          <img src={m} alt="" />
        </div>
      </div>
        <Messages></Messages>
        <Input></Input>
    </div>
  )
}

export default Chat
