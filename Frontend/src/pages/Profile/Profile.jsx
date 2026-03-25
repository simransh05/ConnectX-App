import React, { useContext, useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import { useState } from 'react'
import Post from '../../components/Modals/Post/Post';
import useUserAvailable from '../../utils/helper/userAvailable';
import ROUTES from '../../constant/Route/route';
import style from './Profile.module.scss'
import api from '../../utils/api';
import { CurrentUserContext } from '../../Context/currentUserProvider';
import useIndividualPosts from '../../utils/helper/IndividualPosts';
import PostShow from '../../components/PostShow/PostShow';
import FollowInfo from '../../components/FollowInfo/FollowInfo';
import { CiMenuBurger } from "react-icons/ci";
import { useMediaQuery } from '@mui/material';
import useFollowDetail from '../../utils/helper/followDetails';
import socket from '../../Socket/socket';

function Profile() {
  const [openPost, setOpenPost] = useState(false);
  const { currentUser } = useContext(CurrentUserContext);
  const [sideMenu, setSideMenu] = useState(false);
  useUserAvailable(`${ROUTES.PROFILE}`)
  const { detail, setDetail } = useFollowDetail(currentUser?._id);

  const { posts, setPosts, loading } = useIndividualPosts(currentUser?._id);
  // console.log(posts);
  const handleSuccess = async () => {
    const res = await api.getIndividualPosts(currentUser?._id, 0);
    // console.log(res.data)
    setPosts(res.data);
  }
  useEffect(() => {
    socket.on('receiver-notify', async ({ type }) => {
      if (type === 'follow') {
        const res = await api.getFollow(currentUser?._id);
        setDetail(res.data)
      }
    })
    return () => {
      socket.off('receiver-notify')
    }
  }, [])


  const isMobile = useMediaQuery("(max-width: 768px)")


  return (
    <>
      <Navbar />
      <div className={style['profile-container']}>
        <CiMenuBurger
          onClick={() => setSideMenu(true)}
          className={style.mobileMenu} />
        <Sidebar
          isDrawer={isMobile}
          open={sideMenu}
          onClose={() => setSideMenu(false)}
        />
        {/* right side */}
        {/* followers , follwing , new post  */}
        <div className={style.right}>
          <div className={style["head-profile"]}>
            <FollowInfo
              userId={currentUser?._id}
              detail={detail}
            />
            <button onClick={() => setOpenPost(true)}>New Post</button>
            {openPost &&
              <Post
                open={openPost}
                onClose={() => setOpenPost(false)}
                onSuccess={handleSuccess}
              />}
          </div>
          <PostShow
            posts={posts}
            isProfile={true}
            loading={loading}
          />

          {/* all post of mine */}

        </div>
      </div>
    </>
  )
}

export default Profile
