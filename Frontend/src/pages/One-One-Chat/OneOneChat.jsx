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
import { useNavigate, useParams } from 'react-router-dom';
import { userStore } from '../../Zustand/AllUsers';
import { MdGroups } from 'react-icons/md';
import AddMember from '../../components/Modals/AddMember/AddMember';
import ROUTES from '../../constant/Route/route';

function OneOneChat({ leave }) {
  const navigate = useNavigate();
  const { userId } = useParams()
  const { allUsers } = userStore()
  const [chats, setChat] = useState(null);
  const [showMember, setShowMember] = useState(false);
  const { currentUser } = useContext(CurrentUserContext);
  const { selectedUser, setSelectedUser, prevUser, setPrevUser } = useContext(SelectedUserContext);
  const [message, setMessage] = useState("");
  const scroll = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  // get chat of that person
  useEffect(() => {
    if (prevUser != selectedUser) {
      setMessage("");
    }
    const fetchChat = async () => {
      // console.log(selectedUser?._id, prevUser, selectedUser)
      if (selectedUser?._id && prevUser != selectedUser) {
        // console.log(currentUser?._id, selectedUser?._id, selectedUser?.type)
        const res = await api.getIndividualMessage(currentUser?._id, selectedUser?._id, selectedUser?.type)
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
    socket.on('receive-member', ({ groupId, members }) => {
      if (selectedUser._id === groupId) {
        setSelectedUser(prev => ({ ...prev, members }))
      }
    })

    socket.on('left', ({ groupId, userId }) => {
      if (groupId === selectedUser?._id) {
        setSelectedUser(prev => ({ ...prev, members: prev.members.filter(f => f._id !== userId) }))
      }
    })
    socket.on('receive', ({ sender, receiver, msg, type }) => {
      // console.log(sender, reciever, msg)
      if (selectedUser.type !== type) {
        return;
      }
      if (selectedUser?.type === 'group') {
        setChat(prev => [...prev, { sender, groupId: receiver, message: msg, typeOfChat: type }])
      } else {
        setChat(prev => [...prev, { sender, receiver, message: msg, typeOfChat: type }])
      }
    })
    return () => {
      socket.off('receive');
      socket.off('receive-member')
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
    console.log('here')
    socket.emit('send', { sender: currentUser?._id, receiver: selectedUser?._id, msg: message, type: selectedUser?.type }, (res) => {
      // if user is not online then add in notification
      console.log(res)
      if (res.status === 200) {
        if (selectedUser?.type === 'group') {
          // console.log('here', currentUser?._id, selectedUser?._id, message, selectedUser.type)
          setChat(prev => [...prev, { sender: currentUser?._id, groupId: selectedUser?._id, message, typeOfChat: selectedUser?.type }])
        } else {
          setChat(prev => [...prev, { sender: currentUser?._id, receiver: selectedUser?._id, message, typeOfChat: selectedUser?.type }])
        }
      }
    });
    if (selectedUser?.type !== 'group') {
      socket.emit('send-notify', { sender: currentUser?._id, receiver: selectedUser?._id, type: "message" })
    }
    setMessage("");
  }
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setAnchorEl(null);
  }, [selectedUser]);

  const handleDelete = async () => {
    handleClose()
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
      const res = await api.deleteChat(currentUser?._id, userId, selectedUser?.type);
      if (res.status === 200) {
        setChat(prev => prev.filter(c => c.defaultMessage));
      }
    }

  }

  console.log(chats)

  const handleSuccess = (data, selected) => {
    // send socket for the same 
    socket.emit("send-notify", {
      sender: data.members[0]._id,
      receiver: selected,
      groupId: data._id,
      name: data.groupName,
      groupName: data.groupName,
      type: "group",
      status: "add",
      members: data.members
    });
    socket.emit('add-member', { groupId: data._id, members: data.members })
  }

  const handleLeave = async () => {
    handleClose()
    const data = {
      userId: currentUser?._id,
      groupId: selectedUser?._id
    }
    socket.emit('group-leave', { groupId: selectedUser?._id, userId: currentUser?._id, members: selectedUser?.members })
    const res = await api.leaveGroup(data);
    if (res.status === 200) {
      leave(selectedUser?._id);
      setSelectedUser(null);
      setPrevUser(null)
      navigate(ROUTES.MESSAGES)
    }
    // idea is api remove then update on all removed user
  }

  console.log('select', selectedUser)

  return (
    <>
      {/* right side with whom we are chatting onclick */}
      {/* map the chats with them  if currentUser chat them on right else left (scss) */}
      {/* <div className={style["chat-section"]}> */}
      {userId ? (
        <>
          <div className={style["chat-header"]}>
            {selectedUser?.type === 'group' ?
              <>
                <div className={style.groupInfo}>
                  <MdGroups className={style.groupIcon} />
                  <div>{selectedUser?.groupName}</div>
                </div>
                <div className={style.memberNames}>
                  {selectedUser.members.map(m => (
                    <span key={m._id} className={style.members}>{m.name}</span>
                  ))}
                </div>

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
                  <MenuItem onClick={handleLeave}>Leave Group</MenuItem>
                  <MenuItem onClick={() => setShowMember(true)}>Add Member</MenuItem>
                  {/* add leave group option for the chat of group  */}
                </Menu>
                {showMember &&
                  <AddMember
                    open={showMember}
                    onClose={() => setShowMember(false)}
                    members={selectedUser?.members}
                    onSuccess={(data, selected) => handleSuccess(data, selected)}
                  />
                }
              </>
              // avatar
              // names
              // menu with leave group
              :
              <>
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
              </>
            }
          </div>
          <div className={style["chat-body"]}>
            {chats?.map((c, idx) => (
              <div className={c.defaultMessage
                ? style.defaultMessage
                : c.sender === currentUser?._id
                  ? style.sender
                  : style.receiver
              } key={idx}>{c.message ? c.message : c.defaultMessage}</div>
            ))}
            <div ref={scroll}></div>
            {/* space and data */}
          </div>
          <div className={style["chat-footer"]}>
            <input type="text" name='chat' className={style['input-field']} placeholder='Type a message' onChange={(e) => setMessage(e.target.value)} value={message} onKeyDown={handleEnter} />
            {message.trim() != "" ? <button onClick={handleClick} className={style.buttonSend}>Send</button> : <button className={style.buttonSendDisabled} disabled>Send</button>}
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
