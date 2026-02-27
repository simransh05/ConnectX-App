import React, { useContext, useEffect, useState } from 'react'
import { CurrentUserContext } from '../../Context/currentUserProvider'
import UserAvatar from '../userAvatar/UserAvatar';
import { Avatar, Divider } from '@mui/material';
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
  const [preview, setPreview] = useState(null);
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

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setPreview(URL.createObjectURL(selected));

    setFormData(prev => ({
      ...prev,
      profilePic: selected
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const removeSocial = (index) => {
    const updated = formData.socialLinks.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, socialLinks: updated }));
  };

  const handleAdd = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "", url: "" }]
    }));
  }

  const handleSocialChange = (index, field, value) => {
    const updated = [...formData.socialLinks];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, socialLinks: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      return alert("Email is required");
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("bio", formData.bio);
    data.append("location", formData.location);

    if (formData.profilePic) {
      data.append("profilePic", formData.profilePic);
    }

    const res = await api.updateProfile(data);

    if (res.status === 200) {
      setCurrentUser(res.data);
      setIsEditing(false);
    }
  };
  const handleCancel = () => {
    setIsEditing(false);
    setPreview(null);
  }
  return (
    <div className={style['sidebar-container']}>
      {isEditing ?
        (
          <form onSubmit={handleSubmit} className={style.sidebar}>
            {preview ?
              <Avatar
                src={preview}
                sx={{ width: 60, height: 60 }}
              />
              :
              <UserAvatar
                user={currentUser}
              />
            }

            <label className={style.uploadBtn}>
              Change Profile Picture
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </label>


            <label htmlFor='name'>Name</label>
            <input type="text" name='name' onChange={handleChange} value={formData?.name} />
            <div>{formData.email}</div>
            <label htmlFor='bio'>Bio</label>
            <input type="text" name='bio' onChange={handleChange} value={formData?.bio} />
            <label htmlFor='location'>Location</label>
            <input type="text" name='location' onChange={handleChange} value={formData?.location} />
            {formData?.socialLinks.map((s, index) => (
              <div key={index}>
                <input
                  value={s.platform}
                  onChange={(e) =>
                    handleSocialChange(index, "platform", e.target.value)
                  }
                />
                <input
                  value={s.url}
                  onChange={(e) =>
                    handleSocialChange(index, "url", e.target.value)
                  }
                />
                <button type="button" onClick={() => removeSocial(index)}>
                  Remove
                </button>
              </div>
            ))}

            <button type="button" onClick={handleAdd}>
              Add Social Link
            </button>

            <button type='submit' onClick={handleCancel}>Cancel</button>
            <button type='submit'>Update</button>
          </form>
        )
        :
        <div className={style.sidebar}>
          <UserAvatar
            user={currentUser}
          />
          <div>{currentUser?.name}</div>
          <div>{currentUser?.email}</div>
          <div>{currentUser?.bio}</div>
          <div>{currentUser?.location}</div>
          <div>Joined On {new Date(currentUser?.joinedAt).toLocaleDateString()}</div>
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
        </div>
      }
      {password &&
        <Password
          open={() => setPassword(true)}
          onClose={() => setPassword(false)}
        />}

    </div>
  )
}

export default Sidebar
