import React, { useContext, useEffect, useState } from 'react'
import api from '../../utils/api'
import { CurrentUserContext } from '../../Context/currentUserProvider';
import UserAvatar from '../../components/userAvatar/UserAvatar';
import style from './OneOneChat.module.scss'
import { SelectedUserContext } from '../../Context/SelectedUserProvider';
import socket from '../../Socket/socket';
import { useRef } from 'react';
import { CiMenuKebab } from "react-icons/ci";
import { Menu, MenuItem } from '@mui/material';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { userStore } from '../../Zustand/AllUsers';

function OneOneChat() {
  const { userId } = useParams()
  const { allUsers } = userStore()
  const [chats, setChat] = useState(null);
  const { currentUser } = useContext(CurrentUserContext);
  const { selectedUser, setSelectedUser, prevUser } = useContext(SelectedUserContext);
  const [message, setMessage] = useState("");
  const scroll = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  // get chat of that person
  useEffect(() => {
    if (prevUser != selectedUser) {
      setMessage("")
      // setChat(null);
    }
    const fetchChat = async () => {
      if (userId) {
        const select = allUsers?.find(u => u._id === userId)
        // console.log(allUsers, select)
        setSelectedUser(select)
      }
      if (selectedUser?._id && prevUser != selectedUser) {
        const res = await api.getIndividualMessage(currentUser?._id, selectedUser?._id)
        // console.log(res.data)
        setChat(res.data);
      }
    }
    fetchChat()
  }, [userId, allUsers, selectedUser]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats])

  // console.log(chats)

  useEffect(() => {
    if (!selectedUser) return;
    socket.on('receive', ({ sender, reciever, msg }) => {
      // console.log(sender, reciever, msg)
      setChat(prev => [...prev, { sender, reciever, message: msg }])
    })
    return () => {
      socket.off('receive');
    }
  }, [])

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  }

  const handleClick = () => {
    // e.preventDefault();
    // socket
    socket.emit('send', { sender: currentUser?._id, receiver: selectedUser?._id, msg: message }, (res) => {
      // if user is not online then add in notification
      // console.log(res)
      if (res.status === 200) {
        setChat(prev => [...prev, { sender: currentUser?._id, receiver: selectedUser?._id, message }])
      }
    });
    socket.emit('send-notify', { sender: currentUser?._id, receiver: selectedUser?._id, type: "message" })
    setMessage("");
  }
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Delete Chat',
      text: 'Are you sure you want to delete chat',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      showConfirmButton: true,
      cancelButtonText: 'No'
    })
    if (result.isConfirmed) {
      const res = await api.deleteChat(currentUser?._id, userId);
      if (res.status === 200) {
        setChat(null);
      }
    }

  }

  return (
    <>
      {/* right side with whom we are chatting onclick */}
      {/* map the chats with them  if currentUser chat them on right else left (scss) */}
      {/* <div className={style["chat-section"]}> */}
      {userId ? (
        <>
          <div className={style["chat-header"]}>
            <UserAvatar
              user={selectedUser}
              size={60}
            />
            <div>{selectedUser?.name}</div>
            <div className={style.menuParent}>

              <CiMenuKebab
                style={{
                  fontSize: '14px'
                }}
                className={style.menuBtn}
                onClick={handleMenuClick}
              />
              {/* menu */}
              <Menu anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose} className={style.deleteBtn}>
                <MenuItem onClick={handleDelete}>Delete Chat</MenuItem>
                {/* add leave group option for the chat of group  */}
              </Menu>
            </div>

          </div>
          <div className={style["chat-body"]}>
            {chats?.map((c, idx) => (
              <div className={c.sender === currentUser?._id ? style.sender : style.receiver} key={idx}>{c.message}</div>
            ))}
            <div ref={scroll}></div>
            {/* space and data */}
          </div>
          <div className={style["chat-footer"]}>
            <input type="text" name='chat' className={style['input-field']} placeholder='Type a message' onChange={(e) => setMessage(e.target.value)} value={message} onKeyDown={handleEnter} />
            {message.trim()!="" ? <button onClick={handleClick} className={style.buttonSend}>Send</button> : <button className={style.buttonSendDisabled} disabled>Send</button>}
          </div>
        </>
      ) : (
        <div className={style.selectuser}>Select the user</div>
      )}
      {/* </div> */}
      {/* idea is to have the header body footer */}
    </ >
  )
}

export default OneOneChat
