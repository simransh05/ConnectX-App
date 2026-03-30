import React, { useContext, useEffect, useState } from 'react'
import useUserAvailable from '../../utils/helper/userAvailable'
import ROUTES from '../../constant/Route/route'
import Navbar from '../../components/Navbar/Navbar'
import OneOneChat from '../One-One-Chat/OneOneChat'
import api from '../../utils/api'
import { CurrentUserContext } from '../../Context/currentUserProvider'
import style from './Messages.module.scss'
import { SelectedUserContext } from '../../Context/SelectedUserProvider'
import UserAvatar from '../../components/userAvatar/UserAvatar'
import { useNavigate, useParams } from 'react-router-dom'
import { userStore } from '../../Zustand/AllUsers'
import socket from '../../Socket/socket'
import { MdGroups } from "react-icons/md";
import { Divider } from '@mui/material'
import Group from '../../components/Modals/Group/Group'

function Messages() {
  const navigate = useNavigate()
  const { userId } = useParams()
  const { allUsers } = userStore()
  const [search, setSearch] = useState('');
  const [groupModal, setGroupModal] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const { currentUser } = useContext(CurrentUserContext);
  const { selectedUser, setSelectedUser, setPrevUser, prevUser } = useContext(SelectedUserContext);
  const [myChats, setMyChats] = useState(null);

  if (userId) {
    useUserAvailable(`${ROUTES.MESSAGES}/${userId}`)
  } else {
    useUserAvailable(`${ROUTES.MESSAGES}`)
  }

  useEffect(() => {
    const fetchMyChatUsers = async () => {
      if (currentUser) {
        const res = await api.getMessages(currentUser?._id)
        // console.log(res.data);
        setMyChats(res.data);
      }
    }
    fetchMyChatUsers();
  }, [currentUser])

  useEffect(() => {
    if (userId) {
      const select = myChats?.find(c => c._id === userId);
      console.log(select)
      if (select) {
        setSelectedUser(select)
      }
    }
  }, [userId, myChats])

  // console.log(userId);

  const handleClick = (c) => {
    if (search.trim()) {
      setSearch("")
    }

    setPrevUser(selectedUser);

    console.log(c)
    setSelectedUser(c);
    navigate(`${ROUTES.MESSAGES}/${c?._id}`)
  }

  const updateChatList = (data, isGroup) => {
    console.log(data, isGroup);
    setMyChats(prev => {
      if (!prev) prev = [];

      let formatted;

      if (isGroup) {
        formatted = data;
      } else {
        const otherInfo = allUsers?.find(u => u._id === data);
        // if (!otherInfo) return prev;
        console.log(otherInfo);
        formatted = {
          _id: otherInfo?._id,
          type: 'individual',
          name: otherInfo?.name,
          profilePic: otherInfo.profilePic
        };
      }
      console.log(formatted);

      const filtered = prev.filter(c => c._id !== formatted._id);
      console.log(filtered)
      return [formatted, ...filtered];
    });
  };
  useEffect(() => {
    socket.on('message-send', ({ receiver }) => {
      updateChatList(receiver)
    })
    socket.on('receive', ({ sender }) => {
      if (sender != currentUser?._id) {
        updateChatList(sender)
      }
    })
    socket.on('receiver-notify', ({ receiver, groupId, type, groupName }) => {
      const data = {
        _id: groupId,
        type,
        members: receiver,
        groupName
      }
      if (type === 'group') {
        updateChatList(data, true)
      }
    })

    return () => {
      socket.off('message-send');
      socket.off('receive');
      socket.off('receiver-notify')
    }
  }, [])

  const handleChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    const lower = value.toLowerCase();
    const result = myChats.filter(c => c.name.toLowerCase().includes(lower) || c.groupName.toLowerCase().includes(lower));
    setSearchResult(result);
    // my chat filter
  }

  const handleSuccess = (data) => {
    socket.emit("send-notify", {
      sender: data.admin,
      receiver: data.members,
      groupId: data._id,
      name: data.groupName,
      groupName: data.groupName,
      type: "group",
      status: "add"
    });
    const info = {
      _id: data._id,
      type: "group",
      groupName: data.groupName,
      members: data.members
    }
    console.log(info)
    setMyChats(prev => [info, ...prev])
    setSelectedUser(info)
    navigate(`/chats/${data._id}`);
  }

  // console.log(searchResult);
  console.log(myChats)
  return (
    <>
      <Navbar />
      <div className={style["message-container"]}>
        <div className={userId ? style["left-mobile"] : style["left-side"]}>
          <div className={style.inputContainer}>
            <input
              type="text"
              name="search"
              placeholder="Search"
              onChange={handleChange}
              value={search}
              className={style.searchMessage}
            />

            {search && (
              <div className={style.searchContainer}>
                {searchResult?.length > 0 ? (
                  searchResult.map((s) => (
                    <div
                      className={style.searchIndividual}
                      key={s._id}
                      onClick={() => handleClick(s)}
                    >
                      <div className={style.userName}>{s.name}</div>
                    </div>
                  ))
                ) : (
                  <div className={style.noUserAvailable}>
                    User Not Found
                  </div>
                )}
              </div>
            )}
          </div>

          {myChats?.length > 0 ? (
            <div className={style.nameContainer}>
              {myChats.map((c) => (
                <div
                  className={style.people}
                  onClick={() => handleClick(c)}
                  key={c?._id}
                >
                  {c.type === 'group' ?
                    <>
                      <MdGroups className={style.groupIcon} />
                      <div className={style.nameOfChat}>{c.groupName}</div>
                    </>
                    :
                    <>
                      <UserAvatar user={c} size={50} />
                      <div className={style.nameOfChat}>{c?.name}</div>
                    </>}

                </div>
              ))}

            </div>
          ) : (
            <div className={style.noChats}>No Chats</div>
          )}
          <button className={style.createGrp} onClick={() => setGroupModal(true)}>Create Group</button>
          {groupModal &&
            <Group
              open={groupModal}
              onClose={() => setGroupModal(false)}
              onSuccess={(data) => handleSuccess(data)}
            />
          }
        </div>

        <div className={userId ? style["right-mobile"] : style["right-side"]}>
          <OneOneChat />
        </div>
      </div>

    </>
  )
}

export default Messages
