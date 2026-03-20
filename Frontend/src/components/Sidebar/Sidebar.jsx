import React, { useContext, useEffect, useState } from 'react'
import { CurrentUserContext } from '../../Context/currentUserProvider'
import UserAvatar from '../userAvatar/UserAvatar';
import { Avatar, Divider, Drawer } from '@mui/material';
import { MdModeEdit } from "react-icons/md";
import Password from '../Modals/Password/Password';
import Swal from 'sweetalert2'
import socket from '../../Socket/socket';
import { FaBookmark } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { MdOutlineWifiPassword } from "react-icons/md";
import ROUTES from '../../constant/Route/route';
import api from '../../utils/api';
import style from './Sidebar.module.scss'
import UserInfo from '../UserInfo/UserInfo';

function Sidebar({ isDrawer, open, onClose }) {
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
        socialLinks: currentUser.socialLinks || [],
        fileType: currentUser.fileType || ""
      });
    }
  }, [currentUser]);

  const handleLogout = async () => {
    if (isDrawer) {
      onClose();
    }
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
      // console.log(res.data)
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
    setFormData(prev => ({
      ...prev,
      fileType: selected.type
    }));
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
    data.append('userId', currentUser?._id)
    data.append("socialLinks", JSON.stringify(formData.socialLinks))

    if (formData.profilePic) {
      data.append("profilePic", formData.profilePic);
      data.append("fileType", formData.fileType)
    }

    const res = await api.updateProfile(data);
    console.log(res.data)
    if (res.status === 200) {
      setCurrentUser(res.data);
      setIsEditing(false);
    }
  };
  const handleCancel = () => {
    setIsEditing(false);
    setPreview(null);
  }
  console.log(isDrawer)
  return (
    <>
      {
        isDrawer ?

          <Drawer className={style['sidebar-drawer']} PaperProps={{
            sx: { width: '280px' }
          }} open={open} onClose={onClose}>
            {
              isEditing ?
                (
                  <form onSubmit={handleSubmit} className={style.editSidebar} >
                    <div className={style.profilePicInfo}>
                      {preview ?
                        <Avatar
                          src={preview}
                          sx={{ width: 80, height: 80, margin: '0 auto' }}
                        />
                        :
                        <UserAvatar
                          user={currentUser}
                          size={80}
                          IsSidebar={true}
                        />
                      }
                    </div>

                    <label className={style.uploadBtn}>
                      Change Profile Picture
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleFileChange}
                      />
                    </label>

                    <div className={style.nameInfo}>
                      <label htmlFor='name'>Name: </label>
                      <input type="text" name='name' onChange={handleChange} value={formData?.name} />
                    </div>

                    <div>Email: {formData.email}</div>
                    <div className={style.bioInfo}>
                      <label htmlFor='bio'>Bio: </label>
                      <input type="text" name='bio' onChange={handleChange} value={formData?.bio} />
                    </div>
                    <div className={style.locationInfo}>
                      <label htmlFor='location'>Location: </label>
                      <input type="text" name='location' onChange={handleChange} value={formData?.location} />
                    </div>
                    <div className={style.socialInfo}>
                      Social Links:
                    </div>
                    {formData?.socialLinks.map((s, index) => (
                      <div key={index} className={style.indSocial}>
                        <div className={style.inputSocial}>
                          <input
                            value={s.platform}
                            name='platform'
                            onChange={(e) =>
                              handleSocialChange(index, "platform", e.target.value)
                            }
                          />
                          <input
                            value={s.url}
                            name='url'
                            onChange={(e) =>
                              handleSocialChange(index, "url", e.target.value)
                            }
                          />
                        </div>
                        <button type="button" onClick={() => removeSocial(index)} className={style.removeSocial}>
                          Remove
                        </button>
                      </div>
                    ))
                    }

                    < button type="button" onClick={handleAdd} className={style.addSocial} >
                      Add Social Link
                    </button >
                    <div className={style.btnUpdate}>
                      <button type='button' onClick={handleCancel} className={style.cancelProfile}>Cancel</button>
                      <button type='submit' className={style.updateProfile}>Update</button>
                    </div>

                  </form >
                )
                :
                <div className={style.sidebar}>
                  <UserInfo
                    user={currentUser}
                  />
                  <div className={style.edit} onClick={() => setIsEditing(true)}>
                    <MdModeEdit /> Edit Profile
                  </div>

                  {!currentUser?.googleId &&
                    <div className={style.passwordChange} onClick={() => setPassword(true)} >
                      <MdOutlineWifiPassword /> Change Password
                    </div>
                  }

                  <div className={style.savedPostBtn} onClick={() => navigate(`${ROUTES.SAVEDPOST}`)}>
                    <FaBookmark /> Saved Posts
                  </div>
                  <div onClick={handleLogout} className={style.logout}>
                    <FaPowerOff /> Logout
                  </div>
                </div>
            }
            {
              password &&
              <Password
                open={() => setPassword(true)}
                onClose={() => setPassword(false)}
              />
            }

          </Drawer >
          :
          <div className={style['sidebar-container']}>
            {isEditing ?
              (
                <form onSubmit={handleSubmit} className={style.editSidebar}>
                  <div className={style.profilePicInfo}>
                    {preview ?
                      <Avatar
                        src={preview}
                        sx={{ width: 80, height: 8000 }}
                      />
                      :
                      <UserAvatar
                        user={currentUser}
                        size={80}
                        IsSidebar={true}
                      />
                    }
                  </div>

                  <label className={style.uploadBtn}>
                    Change Profile Picture
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFileChange}
                    />
                  </label>

                  <div className={style.nameInfo}>
                    <label htmlFor='name'>Name: </label>
                    <input type="text" name='name' onChange={handleChange} value={formData?.name} />
                  </div>

                  <div>Email: {formData.email}</div>
                  <div className={style.bioInfo}>
                    <label htmlFor='bio'>Bio: </label>
                    <input type="text" name='bio' onChange={handleChange} value={formData?.bio} />
                  </div>
                  <div className={style.locationInfo}>
                    <label htmlFor='location'>Location: </label>
                    <input type="text" name='location' onChange={handleChange} value={formData?.location} />
                  </div>
                  <div className={style.socialInfo}>
                    Social Links:
                  </div>
                  {formData?.socialLinks.map((s, index) => (
                    <div key={index} className={style.indSocial}>
                      <div className={style.inputSocial}>
                        <input
                          value={s.platform}
                          name='platform'
                          onChange={(e) =>
                            handleSocialChange(index, "platform", e.target.value)
                          }
                        />
                        <input
                          value={s.url}
                          name='url'
                          onChange={(e) =>
                            handleSocialChange(index, "url", e.target.value)
                          }
                        />
                      </div>
                      <button type="button" onClick={() => removeSocial(index)} className={style.removeSocial}>
                        Remove
                      </button>
                    </div>
                  ))}

                  <button type="button" onClick={handleAdd} className={style.addSocial}>
                    Add Social Link
                  </button>
                  <div className={style.btnUpdate}>
                    <button type='button' onClick={handleCancel} className={style.cancelProfile}>Cancel</button>
                    <button type='submit' className={style.updateProfile}>Update</button>
                  </div>

                </form>
              )
              :
              <div className={style.sidebar}>
                <UserInfo
                  user={currentUser}
                />
                <div className={style.edit} onClick={() => setIsEditing(true)}>
                  <MdModeEdit /> Edit Profile
                </div>

                {!currentUser?.googleId &&
                  <div className={style.passwordChange} onClick={() => setPassword(true)} >
                    <MdOutlineWifiPassword /> Change Password
                  </div>
                }

                <div className={style.savedPostBtn} onClick={() => navigate(`${ROUTES.SAVEDPOST}`)}>
                  <FaBookmark /> Saved Posts
                </div>
                <div onClick={handleLogout} className={style.logout}>
                  <FaPowerOff /> Logout
                </div>
              </div>
            }
            {
              password &&
              <Password
                open={() => setPassword(true)}
                onClose={() => setPassword(false)}
              />
            }

          </div >
      }
    </>
  )
}

export default Sidebar
