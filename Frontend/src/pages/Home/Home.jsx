import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import useUserAvailable from '../../utils/helper/userAvailable'
import ROUTES from '../../constant/Route/route';
import PostShow from '../../components/PostShow/PostShow';
import { useEffect } from 'react';
import { allPostStore } from '../../Zustand/AllPosts';

function Home() {
  const { allPosts, fetchAllPosts } = allPostStore();
  useUserAvailable(`${ROUTES.HOME}`); // custom hook
  useEffect(() => {
    fetchAllPosts();
  }, [])

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
