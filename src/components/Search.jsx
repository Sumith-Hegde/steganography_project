import React,{useContext, useState} from 'react'
import { doc,collection, query, where,getDoc,getDocs,setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import {db} from '../firebase'
import {AuthContext} from '../context/AuthContext'
import {ChatContext} from '../context/ChatContext'


const Search = () => {
  const [userName,setUserName]=useState("")
  const [user,setUser]=useState(null)
  const [err,setErr]=useState(false)
  const {currentUser}=useContext(AuthContext)
  const {dispatch}=useContext(ChatContext)

  const handleSearch=async()=>{
    const q=query(
      collection(db,"users"),
      where("displayName","==",userName)
    );
    try{
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data())
      });
    }catch{
      setErr(true)
    }
  };
  const handleKey = e=>{
    e.code==="Enter" && handleSearch();
  };

  const handleSelect=async (u)=>{
    const combinedId=currentUser.uid > user.uid ? currentUser.uid+user.uid:user.uid+currentUser.uid;
    const id1=combinedId+".userInfo"
    const id2=combinedId+".date"
    const uid1=user.uid
    const uid2=currentUser.uid
    const displayName1=user.displayName
    const displayName2=currentUser.displayName
    const photoURL1=user.photoURL
    const photoURL2=currentUser.photoURL
    try{
      const res=await getDoc(doc(db,"chats",combinedId));
      if(!res.exists()){
        // console.log(res)
        await setDoc(doc(db,"chats",combinedId),{messages:[]});
        //creating user chats
      }
      await updateDoc(doc(db,"userChats",currentUser.uid),{[id1]:{uid:uid1,displayName:displayName1,photoURL:photoURL1},[id2]:serverTimestamp()})
      await updateDoc(doc(db,"userChats",user.uid),{[id1]:{uid:uid2,displayName:displayName2,photoURL:photoURL2},[id2]:serverTimestamp()})
              
    }catch(err){}
    setUser(null)
    setUserName("")
  //   //create userChats
    // console.log(user);
    dispatch({type:"CHANGE_USER",payload:u})
  }
  return (
    <div className='search'>
      <div className="searchForm">
      <input type="text" placeholder='Search' onKeyDown={handleKey} onChange={e=>setUserName(e.target.value)} value={userName}/>
      </div>
      {err && <span>Something went wrong</span>}
      {user && <div className="userChat" onClick={()=>handleSelect(user)}>
        <img src={user.photoURL} alt="" />
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
      </div>}
    </div>

  )
}
export default Search