import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ROUTES from '../../constant/Route/route'
import style from './Navbar.module.scss'
import { CurrentUserContext } from '../../Context/currentUserProvider'
import UserAvatar from '../userAvatar/UserAvatar'
import { userStore } from '../../Zustand/AllUsers'
import socket from '../../Socket/socket'
import api from '../../utils/api'
import { SelectedUserContext } from '../../Context/SelectedUserProvider'
import { NotificationStore } from '../../Zustand/Notification'


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
    setNumber(notify?.length)

  }, [loading , notify])

  console.log(notify)

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value)
    const searchHistory = value.toLowerCase();
    const data = allUsers.filter(u => u.name.toLowerCase().includes(searchHistory))
    setSearchResult(data)
  }

  useEffect(() => {
    socket.on('receiver-notify', ({ sender, receiver, type, postId }) => {
      // number increase 
      console.log('here')
      setNumber(prev => prev + 1)
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
    navigate(`${ROUTES.PROFILE}/${id}`)
    setSearch("");
    setSearchResult(null);
  }
  // console.log(allUsers);
  return (
    <div className={style.navbar}>
      {/* image */}
      <img src="/ConnectX.png" alt="profile-image" height={80} width={80} />
      {/* search bar (for user) */}
      <div className={style.searchUser}>
        <input
          type="text"
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
      </div>
      {/* idea is to when click any of the suggestions then go to that person naviagte(/profile/name) */}

      {/* routes */}

      <Link to={ROUTES.HOME} className={style.linkInfo}>Home</Link>
      <div className={style.notifyLink}>
        <Link to={ROUTES.NOTIFICATION} className={style.linkInfo}>Notifications</Link>
        {number > 0 && <div className={style.numNotify}>{number}</div>}
      </div>

      <Link to={ROUTES.MESSAGES} className={style.linkInfo} onClick={() => setSelectedUser(null)}>Messages</Link>
      <Link to={ROUTES.ABOUT} className={style.linkInfo}>About</Link>
      <Link to={ROUTES.PROFILE} className={style.linkInfo}>
        <UserAvatar
          user={currentUser}
          size={70}
        />
      </Link>
      {/* home , messages , notification (notification idea to delete after 7 days or 30 days) 
      while getting notification */}
      {/* avatar (onClick - profile) */}
    </div>
  )
}

export default Navbar
