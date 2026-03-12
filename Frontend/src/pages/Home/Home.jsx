import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import useUserAvailable from '../../utils/helper/userAvailable'
import ROUTES from '../../constant/Route/route';
import PostShow from '../../components/PostShow/PostShow';
import { useEffect } from 'react';
import { allPostStore } from '../../Zustand/AllPosts';
import { followStore } from '../../Zustand/Follow';
import { useContext } from 'react';
import { CurrentUserContext } from '../../Context/currentUserProvider';

function Home() {
  const { allPosts, fetchAllPosts } = allPostStore();
  const { fetchFollowInfo } = followStore();
  const { currentUser } = useContext(CurrentUserContext);
  useUserAvailable(`${ROUTES.HOME}`); // custom hook
  useEffect(() => {
    if (allPosts) return;
    fetchAllPosts();
    fetchFollowInfo(currentUser?._id)
  }, [currentUser])

  console.log(allPosts);
  return (
    <div>
      <Navbar />
      <PostShow
        posts={allPosts}
      />
    </div>
  )
}

export default Home
