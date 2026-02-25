import React, { useContext, useEffect } from 'react'
import { Link, Routes } from 'react-router-dom'
import ROUTES from '../../constant/Route/route'
import style from './Navbar.module.scss'
import { CurrentUserContext } from '../../Context/currentUserProvider'
import UserAvatar from '../userAvatar/UserAvatar'


function Navbar() {
  const { currentUser, loading } = useContext(CurrentUserContext);
  useEffect(() => {
    if (loading) return;
    // get the allusers
  }, [loading])
  return (
    <div className={style.navbar}>
      {/* image */}
      <img src="/ConnectX.png" alt="profile-image" height={80} width={80} />
      {/* search bar (for user) */}

      {/* idea is to when click any of the suggestions then go to that person naviagte(/profile/name) */}
      <input type="text" className={style.inputBox} placeholder='search user' />
      {/* routes */}

      <Link to={ROUTES.HOME} className={style.linkInfo}>Home</Link>
      <Link to={ROUTES.NOTIFICATION} className={style.linkInfo}>Notifications</Link>
      <Link to={ROUTES.MESSAGES} className={style.linkInfo}>Messages</Link>
      <Link to={ROUTES.ABOUT} className={style.linkInfo}>About</Link>
      <Link to={ROUTES.PROFILE} className={style.linkInfo}>
        <UserAvatar />
      </Link>
      {/* home , messages , notification (notification idea to delete after 7 days or 30 days) 
      while getting notification */}
      {/* avatar (onClick - profile) */}
    </div>
  )
}

export default Navbar
