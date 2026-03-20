import { Avatar } from '@mui/material';
import getInitial from '../../utils/helper/getInitials';
import style from './userAvatar.module.scss'

function UserAvatar({ user, size, IsSidebar }) {
    // console.log(user)
    return (
        <>
            {user?.profilePic ?
                <div className={IsSidebar ? style.sidebarDiv : style.divContainer}>
                    <img src={`${user.profilePic}`} alt="profile pic" className={IsSidebar ? style.imageSidebar : style.image} width={size} height={size} />
                </div>
                :
                <div className={style.sidebarDiv}>
                    <div className={IsSidebar ? style.avatarSidebar : style.avatar} style={{ height: size, width: size }}>{getInitial(user?.name)}</div>
                </div>

            }
        </>
    )
}

export default UserAvatar
