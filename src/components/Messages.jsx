import React, { useContext, useEffect, useState } from 'react';
import Message from './Message.jsx';
import { ChatContext } from '../context/ChatContext.js';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.js';
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebase"

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });
    return () => {
      unSub();
    };
  }, [data.chatId]);
  // console.log("hi")
  // console.log(messages)
  // console.log("hi")
  if(messages)
  {
    return (
      <div className='messages'>
        {messages.map(m => (
        <Message message={m} key={m.id}></Message>
        ))}
        {/* <Message message={messages[0]}></Message> */}
      </div>
    );
  }
  else{
    return(
      <div className='messages'>
      </div>
    );
  }
};

export default Messages;
