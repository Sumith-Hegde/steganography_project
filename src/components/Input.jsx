import React, { useContext, useState} from 'react'
import im from '../images/im.jpg'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db} from '../firebase'
import { v4 as uuid } from 'uuid'

const Input = () => {
  const [text,setText]=useState("")
  const [img,setImg]=useState(null)
  const {currentUser}=useContext(AuthContext)
  const {data}=useContext(ChatContext)
  const steganography=require('./steganogarphy')

  const handleSend=async()=>{
    if(img){
        let add="";
        for (let index = 0; index < 33-text.length; index++) {
          add=add+" ";
        }
        const reader = new FileReader();
        reader.onload = async () => {
        const imageDataUrl = reader.result;
        steganography.encode(imageDataUrl, " "+text+add)
    .then((modifiedImageURL) => {
      console.log('Modified Image URL:', modifiedImageURL);
      updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          senderId: currentUser.uid,
          date: Timestamp.now(),
          img: modifiedImageURL,
        }),
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
        }
      reader.readAsDataURL(img);

    } else{
      await updateDoc(doc(db,"chats",data.chatId),{
        messages:arrayUnion({
          id:uuid(),
          text,
          senderId:currentUser.uid,
          date:Timestamp.now()
        })
      })
      // await updateDoc(doc(db,"userChats",currentUser.uid),{
      //   [data.chatId+".lastMessage"]:{
      //     text
      //   },
      //   [data.chatId+".date"]:serverTimestamp()
      // })
      // await updateDoc(doc(db,"userChats",data.user.uid),{
      //   [data.chatId+".lastMessage"]:{
      //     text
      //   },
      //   [data.chatId+".date"]:serverTimestamp()
      // })
    }

    setText("")
    setImg(null)
  }
  const handleChange=(e)=>{
    setImg(e.target.files[0])
  }
  return (
    <div className='input'>
      <input type="text" placeholder='Type...' onChange={e=>setText(e.target.value)} value={text} />
      <div className="send">
        <input type="file" style={{display:'none'}} id='file' onChange={handleChange}/>
        <label htmlFor="file">
          <img src={im} alt=""/>
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}
export default Input