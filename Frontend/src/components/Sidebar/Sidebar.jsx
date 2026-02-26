import React, { useContext, useEffect, useState } from 'react'
import { CurrentUserContext } from '../../Context/currentUserProvider'
import UserAvatar from '../userAvatar/UserAvatar';
import { Divider } from '@mui/material';
import Password from '../Modals/Password/Password';
import Swal from 'sweetalert2'
import socket from '../../Socket/socket';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../constant/Route/route';
import api from '../../utils/api';
import style from './Sidebar.module.scss'

function Sidebar() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState(false)
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
        socialLinks: currentUser.socialLinks || []
      });
    }
  }, [currentUser]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout",
      text: 'Are you sure you want to logout',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    })
    if (result.isConfirmed) {
      const res = await api.logout();
      console.log(res.data)
      if (res.status === 200) {
        setCurrentUser(null);
        socket.disconnect()
        navigate(`${ROUTES.LOGIN}`)
      }

    }
  }
  const handleSubmit = async () => {
    await api.updateProfile(data);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  return (
    <div className={style.sidebar}>
      {isEditing ?
        (
          <form onSubmit={handleSubmit}>
            <UserAvatar />
            <input type="file" name='file' />
            <label htmlFor='name'>Name</label>
            <input type="text" name='name' onChange={handleChange} value={formData?.name} />
            <label htmlFor='email'>Email</label>
            <input type="text" name='email' onChange={handleChange} value={formData?.email} required />
            <label htmlFor='bio'>Bio</label>
            <input type="text" name='bio' onChange={handleChange} value={formData?.bio} />
            <label htmlFor='location'>Location</label>
            <input type="text" name='location' onChange={handleChange} value={formData?.location} />
            <button onClick={() => setIsEditing(false)}>Cancel</button>
            <button type='submit'>Update</button>
          </form>
        )
        :
        <>
          <UserAvatar />
          <div>{currentUser?.name}</div>
          <div>{currentUser?.email}</div>
          <div>{currentUser?.bio}</div>
          <div>{currentUser?.location}</div>
          <div>Joined On {currentUser?.joinedAt}</div>
          {currentUser?.socialLinks && <Divider />}
          {currentUser?.socialLinks?.map((s) => (
            <>
              <div>{s?.platform}</div>
              <div>{s?.url}</div>
            </>
          ))}
          <button onClick={() => setIsEditing(true)}>Update</button>
          <button onClick={() => setPassword(true)}>Change Passowrd</button>
          <button onClick={handleLogout}>Logout</button>
        </>
      }
      {password &&
        <Password
          open={() => setPassword(true)}
          onClose={() => setPassword(false)}
        />}


      {/* user info */}
      {/* avatar */}
      {/* name */}
      {/* email */}
      {/* linkedln profile */}
      {/* github */}
      {/* facebook */}
      {/* skills list */}

      {/* add the list  */}
      {/* save btn or update btn */}
    </div>
  )
}

export default Sidebar
