import React, { useContext, useEffect, useState } from 'react'
import api from '../../utils/api'
import { CurrentUserContext } from '../../Context/currentUserProvider';
import UserAvatar from '../../components/userAvatar/UserAvatar';
import style from './OneOneChat.module.scss'
import { SelectedUserContext } from '../../Context/SelectedUserProvider';
import socket from '../../Socket/socket';
import { useRef } from 'react';

function OneOneChat() {
  const [chats, setChat] = useState(null);
  const { currentUser } = useContext(CurrentUserContext);
  const { selectedUser } = useContext(SelectedUserContext);
  const [message, setMessage] = useState("");
  const scroll = useRef(null);
  // get chat of that person
  useEffect(() => {
    const fetchChat = async () => {
      if (selectedUser != null) {
        const res = await api.getIndividualMessage(currentUser?._id, selectedUser?._id)
        console.log(res.data)
        setChat(res.data);
      }
    }
    fetchChat()
  }, [selectedUser]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats])

  console.log(chats)

  useEffect(() => {
    socket.on('receive', ({ sender, reciever, msg }) => {
      console.log(sender, reciever, msg)
      setChat(prev => [...prev, { sender, reciever, message: msg }])
    })
    return () => {
      socket.off('receive');
    }
  }, [])

  const handleEnter = (e) => {
    if(e.key === 'Enter') {
      handleClick();
    }
  }

  const handleClick = (e) => {
    // e.preventDefault();
    // socket
    socket.emit('send', { sender: currentUser?._id, receiver: selectedUser?._id, msg: message }, (res) => {
      console.log(res)
      if (res.status === 200) {
        setChat(prev => [...prev, { sender: currentUser?._id, receiver: selectedUser?._id, message }])
      }
    });
    setMessage("");
  }

  return (
    <>
      {/* right side with whom we are chatting onclick */}
      {/* map the chats with them  if currentUser chat them on right else left (scss) */}
      {selectedUser ? (
        <div className={style["chat-section"]}>
          <div className={style["chat-header"]}>
            <UserAvatar
              user={selectedUser}
              size={60}
            />
            <div>{selectedUser?.name}</div>
            <button>:</button>
          </div>
          <div className={style["chat-body"]}>
            {chats?.map((c, idx) => (
              <div className={c.sender === currentUser?._id ? style.sender : style.receiver} key={idx}>{c.message}</div>
            ))}
            <div ref={scroll}></div>
            {/* space and data */}
          </div>
          <div className={style["chat-footer"]}>
            <input type="text" name='chat' className={style['input-field']} placeholder='Type a message' onChange={(e) => setMessage(e.target.value)} value={message} onKeyDown={handleEnter}/>
            <button onClick={handleClick} className={style.buttonSend}>Send</button>
          </div>
        </div>
      ) : (
        <div className={style.selectuser}>Select the user</div>
      )}

      {/* idea is to have the header body footer */}
    </ >
  )
}

export default OneOneChat
