import React, { useContext, useEffect, useState } from 'react'
import { Link, Routes } from 'react-router-dom'
import ROUTES from '../../constant/Route/route'
import style from './Navbar.module.scss'
import { CurrentUserContext } from '../../Context/currentUserProvider'
import UserAvatar from '../userAvatar/UserAvatar'
import { userStore } from '../../Zustand/AllUsers'


function Navbar() {
  const { currentUser, loading } = useContext(CurrentUserContext);
  const { allUsers, fetchAllUsers } = userStore();
  const [search, setSearch] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  useEffect(() => {
    if (loading) return;
    // get the allusers
    fetchAllUsers()

  }, [loading])

  console.log(allUsers);
  return (
    <div className={style.navbar}>
      {/* image */}
      <img src="/ConnectX.png" alt="profile-image" height={80} width={80} />
      {/* search bar (for user) */}

      {/* idea is to when click any of the suggestions then go to that person naviagte(/profile/name) */}
      <input type="text" className={style.inputBox} placeholder='search user' onChange={(e) => setSearch(e.target.value)} />

      {search && searchResult?.length > 0 ?
        searchResult.map((u) => (
          <div key={u._id} className="search-user">
            <UserAvatar user={u} />
            <div>{u.name}</div>
          </div>
        )) :
        search && <div className="no-user">No User Available</div>
      }
      {/* routes */}

      <Link to={ROUTES.HOME} className={style.linkInfo}>Home</Link>
      <Link to={ROUTES.NOTIFICATION} className={style.linkInfo}>Notifications</Link>
      <Link to={ROUTES.MESSAGES} className={style.linkInfo}>Messages</Link>
      <Link to={ROUTES.ABOUT} className={style.linkInfo}>About</Link>
      <Link to={ROUTES.PROFILE} className={style.linkInfo}>
        <UserAvatar
          user={currentUser}
        />
      </Link>
      {/* home , messages , notification (notification idea to delete after 7 days or 30 days) 
      while getting notification */}
      {/* avatar (onClick - profile) */}
    </div>
  )
}

export default Navbar
