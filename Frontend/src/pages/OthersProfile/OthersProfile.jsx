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

function OthersProfile() {
    const { userId } = useParams();
    const navigate = useNavigate()
    const [isFollow, setIsFollow] = useState(false);
    const { allUsers } = userStore()
    const { detail } = useFollowDetail(userId)
    const { setSelectedUser } = useContext(SelectedUserContext);
    const { currentUser } = useContext(CurrentUserContext);
    console.log(detail)

    const { posts } = useIndividualPosts(userId)
    console.log(posts);
    // get apis for all of them 

    const handleUser = () => {
        setSelectedUser(userInfo);
        // set select user is this user and navigate to chat page
        navigate(`${ROUTES.MESSAGES}`)
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

    const userInfo = allUsers?.find(u => u._id === userId);

    useEffect(() => {
        if (!detail) return;
        const alreadyFollow = detail.follower.some(f => f._id === currentUser?._id)
        if (alreadyFollow) {
            setIsFollow(true);
        }
    }, [detail])

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
                            <button disabled>Following</button>
                            : <button onClick={handleClick} className={style.followBtn}>Follow</button>}
                        <div className={style.followerInfo}>
                            <div>Followers</div>
                            <div>{detail?.follower?.length}</div>
                        </div>
                        <div className={style.followingInfo}>
                            <div>Followering</div>
                            <div>{detail?.following?.length}</div>
                        </div>
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
