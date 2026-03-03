import { Avatar } from '@mui/material';
import getInitial from '../../utils/helper/getInitials';
import style from './userAvatar.module.scss'

function UserAvatar({ user }) {
console.log(user)
    return (
        <>
            {user?.profilePic ?
                <img src={`${user.profilePic}`} alt="profile pic" className={style.image} /> :
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
