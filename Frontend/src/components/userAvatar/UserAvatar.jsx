import { Avatar } from '@mui/material';
import getInitial from '../../utils/helper/getInitials';
import style from './userAvatar.module.scss'

function UserAvatar({ user, size, IsSidebar }) {
    console.log(user)
    return (
        <>
            {user?.profilePic ?
                <img src={`${user.profilePic}`} alt="profile pic" className={IsSidebar ? style.imageSidebar : style.image} width={size} height={size} /> :
                <div className={IsSidebar ? style.avatarSidebar : style.avatar} style={{ height: size, width: size }}>{getInitial(user?.name)}</div>
            }
        </>
    )
}

export default UserAvatar
