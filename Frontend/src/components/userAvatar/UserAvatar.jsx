import { Avatar } from '@mui/material';
import React, { useContext } from 'react'
import getInitial from '../../utils/helper/getInitials';
import style from './userAvatar.module.scss'
import { CurrentUserContext } from '../../Context/currentUserProvider';

function UserAvatar({ user }) {

    return (
        <>
            {user?.profilePic ?
                <img src="" alt="" className={style.image} /> :
                <Avatar sx={{
                    height: 70,
                    width: 70,
                    background: "orange"
                }}>{getInitial(user?.name)}</Avatar>
            }
        </>
    )
}

export default UserAvatar
