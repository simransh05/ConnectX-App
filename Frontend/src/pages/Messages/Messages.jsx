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
import { Divider } from '@mui/material'
import Group from '../../components/Modals/Group/Group'

function Messages() {
  const navigate = useNavigate()
  const { userId } = useParams()
  const { allUsers } = userStore()
  const [search, setSearch] = useState('');
  const [groupModal, setGroupModal] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  if (userId) {
    useUserAvailable(`${ROUTES.MESSAGES}/${userId}`)
  } else {
    useUserAvailable(`${ROUTES.MESSAGES}`)
  }

  const { currentUser } = useContext(CurrentUserContext);
  const { setSelectedUser, setPrevUser, prevUser } = useContext(SelectedUserContext);
  const [myChats, setMyChats] = useState(null);
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

  // console.log(userId);

  const handleClick = (c) => {
    if (search.trim()) {
      setSearch("")
    }
    if (prevUser === null) {
      setPrevUser(c);
    } else {
      const prev = allUsers.find(u => u._id === userId)
      setPrevUser(prev);
    }
    setSelectedUser(c);
    navigate(`${ROUTES.MESSAGES}/${c?._id}`)
  }

  const updateChatList = (userId) => {
    setMyChats(prev => {
      if (!prev) prev = [];

      const otherInfo = allUsers.find(u => u._id === userId);
      // console.log(otherInfo)
      if (!otherInfo) return prev;

      const filtered = prev.filter(c => c._id !== userId);
      // console.log(filtered)

      return [
        {
          _id: otherInfo._id,
          name: otherInfo.name,
          profilePic: otherInfo.profilePic,
        },
        ...filtered,
      ];
    });
  };
  useEffect(() => {
    socket.on('message-send', ({ receiver }) => {
      updateChatList(receiver)
    })
    socket.on('receive', ({ sender }) => {
      updateChatList(sender)
    })

    return () => {
      socket.off('message-send');
      socket.off('receive');
    }
  }, [])
  const handleChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    const lower = value.toLowerCase();
    const result = myChats.filter(c => c.name.toLowerCase().includes(lower));
    setSearchResult(result);
    // my chat filter
  }

  const handleGroup = () => {
    // open drawer
  }

  // console.log(searchResult);
  // console.log(myChats)
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
                  <UserAvatar user={c} size={50} />
                  <div>{c?.name}</div>
                </div>
              ))}

              <button className={style.createGrp} onClick={() => setGroupModal(true)}>Create Group</button>
              {groupModal &&
                <Group
                  open={groupModal}
                  onClose={() => setGroupModal(false)}
                />
              }
            </div>
          ) : (
            <div className={style.noChats}>No Chats</div>
          )}

        </div>

        <div className={userId ? style["right-mobile"] : style["right-side"]}>
          <OneOneChat />
        </div>
      </div>

    </>
  )
}

export default Messages
