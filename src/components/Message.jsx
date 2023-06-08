import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'


const Message = ({message,key}) => {
  const {currentUser}=useContext(AuthContext)
  const {data}=useContext(ChatContext)
  const steganography=require('./steganogarphy')

  const ref=useRef()

  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:"smooth"})
  },[message])

  const handleClick=()=>{
    console.log(currentUser)
    if(message.senderId !== currentUser.uid)
    {
        steganography.decode(message.img)
      .then((originalMessage) => {
        alert('Original Message: ' + originalMessage);
        console.log('Original Message:', originalMessage);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  }
  return (

    <div className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="messageInfo">
          <img src={message.senderId === currentUser.uid ? currentUser.photoURL: data.user.photoURL} alt=""/>
          {/* <span>just now</span> */}
      </div>
      <div className="messageContent">
          <p>{message.text}</p>
          {message.img && <img src={message.img} alt="" onClick={handleClick}/>}
      </div>
    </div>
  )
}
export default Message