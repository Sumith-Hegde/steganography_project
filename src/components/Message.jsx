import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Message = ({ message, key }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const steganography = require('./steganogarphy');

  const ref = useRef();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  const handleClick = async () => {
    if (message.senderId !== currentUser.uid) {
      setIsPasswordModalOpen(true);
    }
  };

  const handlePasswordSubmit = async () => {
    setIsPasswordModalOpen(false);
    try {
      await signInWithEmailAndPassword(auth, currentUser.email, password);
      steganography
        .decode(message.img)
        .then((originalMessage) => {
          setDecodedMessage(originalMessage);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } catch (err) {
      alert('Wrong Password!!');
    }
  };

  const closeModal = () => {
    setDecodedMessage('');
    setPassword(''); // Clear the password when closing the modal
  };

  return (
    <div className={`message ${message.senderId === currentUser.uid && 'owner'}`}>
      <div className="messageInfo">
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" />
        {/* <span>just now</span> */}
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" onClick={handleClick} />}
      </div>
      {isPasswordModalOpen && (
        <div className="passwordModal">
          <div className="passwordModalContent">
            <h3>Please enter your password:</h3>
            <input className="passwordInput" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="passwordSubmitButton" onClick={handlePasswordSubmit}>Submit</button>
          </div>
        </div>
      )}
      {decodedMessage && (
        <div className="messageModal">
          <div className="messageModalContent">
            <h3>Original Message:</h3>
            <p>{decodedMessage}</p>
            <button className="messageCloseButton" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
