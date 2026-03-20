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

function Profile() {
  const [openPost, setOpenPost] = useState(false);
  const { currentUser } = useContext(CurrentUserContext);
  const [sideMenu, setSideMenu] = useState(false);
  useUserAvailable(`${ROUTES.PROFILE}`)

  const { posts, setPosts, loading } = useIndividualPosts(currentUser?._id);
  // console.log(posts);
  const handleSuccess = async () => {
    const res = await api.getIndividualPosts(currentUser?._id, 0);
    console.log(res.data)
    setPosts(res.data);
  }

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
