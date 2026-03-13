import { Divider } from '@mui/material'
import React from 'react'
import { CiLocationOn } from "react-icons/ci";
import { FaLink } from "react-icons/fa";
import UserAvatar from '../userAvatar/UserAvatar';
import style from './UserInfo.module.scss'
function UserInfo({ user }) {
    return (
        <>
            <UserAvatar
                user={user}
                size={70}
                IsSidebar={true}
            />
            <div className={style.sidebarName}>{user?.name}</div>
            {user?.bio && <div className={style.sidebarBio}>{user?.bio}</div>}
            {user?.socialLinks && <Divider />}
            {user?.socialLinks?.map((s) => (
                <div className={style.socials} key={s._id}>
                    <FaLink />
                    <a href={s.url} target='_blank' className={style.socialLink}>{s.platform}</a>
                </div>
            ))}
            <Divider />
            {user?.location && <div className={style.sidebarLocation}><CiLocationOn /> {user?.location}</div>}
            <div>Joined On {new Date(user?.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
        </>
    )
}

export default UserInfo
