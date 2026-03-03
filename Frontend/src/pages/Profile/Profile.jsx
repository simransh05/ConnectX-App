import React, { useContext, useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import { useState } from 'react'
import Post from '../../components/Modals/Post/Post';
import useUserAvailable from '../../utils/helper/userAvailable';
import ROUTES from '../../constant/Route/route';
import style from './Profile.module.scss'
import api from '../../utils/api';
import useFollowDetail from '../../utils/helper/followDetails';
import { CurrentUserContext } from '../../Context/currentUserProvider';
import useIndividualPosts from '../../utils/helper/IndividualPosts';
import PostShow from '../../components/PostShow/PostShow';

function Profile() {
  const [openPost, setOpenPost] = useState(false);
  const { currentUser } = useContext(CurrentUserContext);
  useUserAvailable(`${ROUTES.PROFILE}`)

  const { detail } = useFollowDetail(currentUser?._id);
  console.log(detail);
  const { posts } = useIndividualPosts(currentUser?._id);
  console.log(posts);
  const handleSuccess = async () => {
    await api.getIndividualPosts(currentUser?._id);
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
            <div>
              <div>Followers</div>
              <div>{detail?.follower?.length}</div>
            </div>
            <div>
              <div>Followering</div>
              <div>{detail?.following?.length}</div>
            </div>
            <button onClick={() => setOpenPost(true)}>New Post</button>
            {openPost &&
              <Post
                open={() => setOpenPost(true)}
                onClose={() => setOpenPost(false)}
                onSuccess={handleSuccess}
              />}
          </div>
          <PostShow
            posts={posts}
          />

          {/* all post of mine */}

        </div>
      </div>
    </>
  )
}

export default Profile
