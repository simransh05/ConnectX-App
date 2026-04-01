import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ROUTES from '../../constant/Route/route'
import style from './Navbar.module.scss'
import { CurrentUserContext } from '../../Context/currentUserProvider'
import UserAvatar from '../userAvatar/UserAvatar'
import { userStore } from '../../Zustand/AllUsers'
import socket from '../../Socket/socket'
import api from '../../utils/api'
import { IoIosHome, IoIosNotifications, } from "react-icons/io";
import { IoChatbubble } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";
import { SelectedUserContext } from '../../Context/SelectedUserProvider'
import { NotificationStore } from '../../Zustand/Notification'
import { AiOutlineLogin } from 'react-icons/ai'


function Navbar() {
  const { currentUser, loading } = useContext(CurrentUserContext);
  const { allUsers, fetchAllUsers } = userStore();
  const { setSelectedUser } = useContext(SelectedUserContext)
  const [number, setNumber] = useState(0);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const { fetchNotification, notify } = NotificationStore()
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!notify) {
      fetchNotification(currentUser?._id)
    }
    if (!allUsers) {
      fetchAllUsers();
    }
    setNumber(notify?.length)

  }, [loading, notify, currentUser])

  // console.log(allUsers)

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value)
    const searchHistory = value.toLowerCase();
    const data = allUsers.filter(u => u.name.toLowerCase().includes(searchHistory) && u._id != currentUser?._id)
    setSearchResult(data)
  }

  useEffect(() => {
    socket.on('receiver-notify', ({ sender, receiver, type, postId, status }) => {
      // number increase 
      console.log(status)
      if (status === 'add') {
        setNumber(prev => prev + 1)
      }
      else if (status === 'remove') {
        setNumber(prev => prev - 1)
      }

    })
    socket.on('message-send', ({ receiver, type }) => {
      const available = notify?.some(n => n.userId === receiver && n.type === type)
      // console.log(available, receiver)
      fetchNotification(currentUser?._id)
      if (available) {
        setNumber(prev => prev - 1);
      }
    })

    socket.on('deleted', () => {
      setNumber(0)
    })
    return () => {
      socket.off('receiver-notify');
      socket.off('deleted')
    }
  }, [])

  const handleClick = (id) => {
    setSearch("");
    setSearchResult(null);
    navigate(`${ROUTES.PROFILE}/${id}`)
  }
  console.log(number);
  return (
    <div className={style.navbar}>
      {/* image */}
      <img src="/ConnectX.png" alt="profile-image" height={80} width={80} />
      {/* search bar (for user) */}
      {currentUser && <div className={style.searchUser}>
        <input
          type="text"
          value={search}
          className={style.inputBox}
          placeholder="Search User..."
          onChange={handleChange}
        />

        {search && (
          <div className={style.searchContainer}>
            {searchResult?.length > 0 ? (
              searchResult.map((u) => (
                <div
                  key={u._id}
                  className={style.searchResult}
                  onClick={() => handleClick(u._id)}
                >
                  <UserAvatar user={u}
                    size={40}
                  />
                  <div>{u.name}</div>
                </div>
              ))
            ) : (
              <div className={style.noUser}>No User Available</div>
            )}
          </div>
        )}
      </div>}
      {/* idea is to when click any of the suggestions then go to that person naviagte(/profile/name) */}

      {/* routes */}

      <Link to={ROUTES.HOME} className={style.linkInfo}>
        <IoIosHome className={currentUser ? style.navIcon : style.nonLoginIcon} />
        <span className={currentUser ? style.textMenu : style.nonLoginText}>Home</span>
      </Link>
      {currentUser &&
        <>
          <div className={style.notifyLink}>
            <Link to={ROUTES.NOTIFICATION} className={style.linkInfo}>
              <IoIosNotifications className={style.navIcon} />
              <span className={style.textMenu}>Notification</span>
            </Link>
            {number > 0 && <div className={style.numNotify}>{number}</div>}
          </div>

          <Link to={ROUTES.MESSAGES} className={style.linkInfo} onClick={() => setSelectedUser(null)}>
            <IoChatbubble className={style.navIcon} />
            <span className={style.textMenu}>Messages</span>
          </Link>
        </>
      }
      <Link to={ROUTES.ABOUT} className={style.linkInfo}>
        <FaInfoCircle className={currentUser ? style.navIcon : style.nonLoginIcon} />
        <span className={currentUser ? style.textMenu : style.nonLoginText}>About</span>
      </Link>
      {currentUser && <Link to={ROUTES.PROFILE} className={style.linkInfo}>
        <UserAvatar
          user={currentUser}
          size={70}
        />
      </Link>}
      {!currentUser &&
        <>
          <Link to={ROUTES.LOGIN} className={style.linkInfo}>
            <span className={style.nonLoginText}>Login</span>
          </Link>

          <Link to={ROUTES.SIGNUP} className={style.linkInfo}>
            <span className={style.nonLoginText}>SignUp</span>
          </Link>
        </>
      }
      {/* home , messages , notification (notification idea to delete after 7 days or 30 days) 
      while getting notification */}
      {/* avatar (onClick - profile) */}
    </div>
  )
}

export default Navbar
