import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar';
import useIndividualPosts from '../../utils/helper/IndividualPosts';
import useFollowDetail from '../../utils/helper/followDetails';
import PostShow from '../../components/PostShow/PostShow';
import ROUTES from '../../constant/Route/route';
import { userStore } from '../../Zustand/AllUsers';
import UserAvatar from '../../components/userAvatar/UserAvatar';
import { Divider } from '@mui/material';
import style from './OthersProfile.module.scss'

function OthersProfile() {
    const { userId } = useParams();
    const navigate = useNavigate()
    const { allUsers } = userStore()
    const { detail } = useFollowDetail(userId)
    console.log(detail)

    const { posts } = useIndividualPosts(userId)
    console.log(posts);
    // get apis for all of them 

    const handleUser = () => {
        // set select user is this user and navigate to chat page
        navigate(`${ROUTES.MESSAGES}`)
    }

    const handleClick = () => {
        // socket involve here adding the person in the following of me and follower for him api of that
        // and socket will add the notification to the other person
    }

    const userInfo = allUsers?.find(u => u._id === userId)

    return (
        <>
            <Navbar />
            <div className={style.otherContainer}>
                {/* sidebar */}
                <div className={style.otherSidebar}>
                    <UserAvatar
                        user={userInfo}
                    />
                    <div>{userInfo?.name}</div>
                    <div>{userInfo?.email}</div>
                    <div>{userInfo?.bio}</div>
                    <div>{userInfo?.location}</div>
                    <div>Joined On {new Date(userInfo?.joinedAt).toLocaleDateString()}</div>
                    {userInfo?.socialLinks?.length > 0 && <Divider />}
                    {userInfo?.socialLinks?.map((s) => (
                        <div key={s._id}>
                            <div>{s?.platform}</div>
                            <div>{s?.url}</div>
                        </div>
                    ))}
                </div>
                {/* posts side */}
                <div className={style.postSide}>
                    <div className={style.followInfo}>
                        <div>
                            <div>Followers</div>
                            <div>{detail?.follower?.length}</div>
                        </div>
                        <div>
                            <div>Followering</div>
                            <div>{detail?.following?.length}</div>
                        </div>
                        <button onClick={handleClick}>Follow</button>
                        <button onClick={handleUser}>Message</button>
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
