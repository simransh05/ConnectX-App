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

function Profile() {
  const [openPost, setOpenPost] = useState(false);
  const { currentUser } = useContext(CurrentUserContext);
  useUserAvailable(`${ROUTES.PROFILE}`)

  const { posts, setPosts } = useIndividualPosts(currentUser?._id);
  // console.log(posts);
  const handleSuccess = async () => {
    const res = await api.getIndividualPosts(currentUser?._id);
    console.log(res.data)
    setPosts(res.data);
  }


  return (
    <>
      <Navbar />
      <div className={style['profile-container']}>
        <Sidebar />
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
          />

          {/* all post of mine */}

        </div>
      </div>
    </>
  )
}

export default Profile
