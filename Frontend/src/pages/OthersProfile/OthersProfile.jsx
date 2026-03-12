import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar';
import useIndividualPosts from '../../utils/helper/IndividualPosts';
import useFollowDetail from '../../utils/helper/followDetails';
import PostShow from '../../components/PostShow/PostShow';
import ROUTES from '../../constant/Route/route';
import { userStore } from '../../Zustand/AllUsers';
import style from './OthersProfile.module.scss'
import { useContext } from 'react';
import { SelectedUserContext } from '../../Context/SelectedUserProvider';
import UserInfo from '../../components/UserInfo/UserInfo';
import socket from '../../Socket/socket';
import { CurrentUserContext } from '../../Context/currentUserProvider';
import { useState } from 'react';
import FollowInfo from '../../components/FollowInfo/FollowInfo';

function OthersProfile() {
    const { userId } = useParams();
    const navigate = useNavigate()
    const [isFollow, setIsFollow] = useState(false);
    const { allUsers } = userStore()
    const { detail } = useFollowDetail(userId)
    const { setSelectedUser } = useContext(SelectedUserContext);
    const { currentUser } = useContext(CurrentUserContext);
    // console.log(detail)
    const userInfo = allUsers?.find(u => u._id === userId);
    console.log(userInfo , userId)

    const { posts } = useIndividualPosts(userId)
    // console.log(posts);
    // get apis for all of them 

    const handleUser = () => {
        setSelectedUser(userInfo);
        console.log(`${ROUTES.MESSAGES}/${userInfo._id}`)
        // set select user is this user and navigate to chat page
        navigate(`${ROUTES.MESSAGES}/${userInfo._id}`)
    }

    const handleClick = () => {
        socket.emit('send-notify', { sender: currentUser?._id, receiver: userId, type: "follow" }, (res) => {
            if (res.status === 200) {
                setIsFollow(true);
            }
        })
        // socket involve here adding the person in the following of me and follower for him api of that
        // and socket will add the notification to the other person
    }

    useEffect(() => {
        if (!detail) return;
        // console.log(detail.follower);
        const alreadyFollow = detail.follower.some(f => f.userId === currentUser?._id)
        console.log(alreadyFollow, currentUser?._id)
        if (alreadyFollow) {
            setIsFollow(true);
        }
    }, [detail])

    console.log(isFollow)

    return (
        <>
            <Navbar />
            <div className={style.otherContainer}>
                {/* sidebar */}
                <div className={style.otherSidebar}>
                    <UserInfo
                        user={userInfo}
                    />
                </div>
                {/* posts side */}
                <div className={style.postSide}>
                    <div className={style.followInfo}>
                        <button onClick={handleUser} className={style.messageBtn}>Message</button>
                        {isFollow ?
                            <button disabled className={style.alreadyFollow}>Following</button>
                            : <button onClick={handleClick} className={style.followBtn}>Follow</button>}
                        <FollowInfo
                            userId={userId}
                        />
                    </div>



                    <PostShow
                        posts={posts}
                    />
                </div>


            </div>
        </>
    )
}

export default OthersProfile
