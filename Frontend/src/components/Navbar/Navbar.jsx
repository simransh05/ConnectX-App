import React from 'react'
import { Link } from 'react-router-dom'
import ROUTES from '../../constant/Route/route'
import { Avatar } from '@mui/material'

function Navbar() {
  return (
    <div>
      {/* image */}
      <img src="/ConnectX.png" alt="profile-image" height={80} width={80} />
      {/* search bar (for user) */}
      <input type="text" className='input-box' placeholder='search user' />
      {/* routes */}
      <div className="link-list">
        <Link to={ROUTES.HOME} className='link-info'>Home</Link>
        <Link to={ROUTES.NOTIFICATION} className='link-info'>Notifications</Link>
        <Link to={ROUTES.MESSAGES} className='link-info'>Messages</Link>
        <Link to={ROUTES.PROFILE} className='link-info'>
          <Avatar />
        </Link>

      </div>
      {/* home , messages , notification (notification idea to delete after 7 days or 30 days) 
      while getting notification */}
      {/* avatar (onClick - profile) */}
    </div>
  )
}

export default Navbar
