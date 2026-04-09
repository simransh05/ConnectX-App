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
import { CiMenuBurger } from 'react-icons/ci';
import { Drawer, useMediaQuery } from '@mui/material';
import api from '../../utils/api';
import Swal from 'sweetalert2';

function OthersProfile() {
    const { userId } = useParams();
    const navigate = useNavigate()
    const [isFollow, setIsFollow] = useState(false);
    const { allUsers } = userStore()
    const { detail, setDetail } = useFollowDetail(userId)
    const { setSelectedUser } = useContext(SelectedUserContext);
    const { currentUser } = useContext(CurrentUserContext);
    const [sideMenu, setSideMenu] = useState(false);
    // console.log(detail)
    const userInfo = allUsers?.find(u => u._id === userId);
    // console.log(userInfo , userId)

    const { posts, loading } = useIndividualPosts(userId)
    // console.log(posts);
    // get apis for all of them 

    const handleUser = () => {
        if (!currentUser) {
            Swal.fire({
                title: 'Not Login',
                text: 'Need to login first',
                icon: 'error',
                showCancelButton: false,
                showConfirmButton: false,
                timer: 5000
            })
            navigate(ROUTES.LOGIN);
            return;
        }
        const data = {
            _id: userInfo?._id,
            type: 'individual',
            name: userInfo?.name,
            profilePic: userInfo?.profilePic
        }
        // console.log(data)
        setSelectedUser(data);
        // console.log(`${ROUTES.MESSAGES}/${userInfo._id}`)
        // set select user is this user and navigate to chat page
        navigate(`${ROUTES.MESSAGES}/${userInfo._id}`)
    }

    const handleClick = () => {
        if (!currentUser) {
            Swal.fire({
                title: 'Not Login',
                text: 'Need to login first',
                icon: 'error',
                showCancelButton: false,
                showConfirmButton: false,
                timer: 5000
            })
            navigate(ROUTES.LOGIN);
            return;
        }
        if (isFollow) {
            socket.emit('send-notify', { sender: currentUser?._id, receiver: userId, type: "follow", status: 'remove' }, async (res) => {
                if (res.status === 200) {
                    setIsFollow(false);
                    const r = await api.getFollow(userId);
                    setDetail(r.data);
                }
            })
        } else {
            socket.emit('send-notify', { sender: currentUser?._id, receiver: userId, type: "follow", status: 'add' }, async (res) => {
                if (res.status === 200) {
                    setIsFollow(true);
                    const r = await api.getFollow(userId);
                    setDetail(r.data);
                }
            })
        }
        // socket involve here adding the person in the following of me and follower for him api of that
        // and socket will add the notification to the other person
    }

    useEffect(() => {
        if (!detail) return;
        // console.log(detail.follower);
        const alreadyFollow = detail.follower.some(f => f.userId === currentUser?._id)
        // console.log(alreadyFollow, detail)
        if (alreadyFollow) {
            setIsFollow(true);
        } else {
            setIsFollow(false)
        }
    }, [detail, userId])

    const isMobile = useMediaQuery("(max-width: 768px)")

    // console.log(isFollow)

    return (
        <div className={style.othersContainer}>
            <Navbar />
            <div className={style.otherContainer}>
                {/* sidebar */}
                <CiMenuBurger
                    onClick={() => setSideMenu(true)}
                    className={style.mobileMenu} />
                {isMobile ?
                    <Drawer open={sideMenu} onClose={() => setSideMenu(false)} className={style.otherDrawer} PaperProps={{
                        sx: {
                            width: '250px'
                        }
                    }}>
                        <UserInfo
                            user={userInfo}
                            isMobile={isMobile}
                            isOther={true}
                            open={sideMenu}
                            onClose={() => setSideMenu(false)}
                        />
                    </Drawer>
                    :
                    <div className={style.otherSidebar}>
                        <UserInfo
                            user={userInfo}
                            isMobile={isMobile}
                            isOther={true}
                            open={sideMenu}
                            onClose={() => setSideMenu(false)}
                        />
                    </div>}

                {/* posts side */}
                <div className={style.postSide}>
                    <div className={style.followInfo}>
                        <button onClick={handleUser} className={style.messageBtn}>Message</button>
                        {isFollow ?
                            <button onClick={handleClick} className={style.unFollowBtn}>Unfollow</button>
                            : <button onClick={handleClick} className={style.followBtn}>Follow</button>}
                        <FollowInfo
                            userId={userId}
                            detail={detail}
                        />
                    </div>
                    <div className={style.postInfo}>
                        <PostShow
                            posts={posts}
                            loading={loading}
                        />
                    </div>

                </div>


            </div>
        </div>
    )
}

export default OthersProfile
