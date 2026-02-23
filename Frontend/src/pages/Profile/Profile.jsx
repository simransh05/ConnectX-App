import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import { useState } from 'react'
import Post from '../../components/Modals/Post/Post';

function Profile() {
  const [openPost, setOpenPost] = useState(false);
  return (
    <>
      <Navbar />
      <div className="profile-conainer">
        <Sidebar />
        {/* right side */}
        {/* followers , follwing , new post  */}
        <button onClick={() => setOpenPost(true)}>New Post</button>
        {openPost &&
          <Post
            open={() => setOpenPost(true)}
            onClose={() => setOpenPost(false)}
          />}
        {/* all post of mine */}
      </div>
    </>
  )
}

export default Profile
