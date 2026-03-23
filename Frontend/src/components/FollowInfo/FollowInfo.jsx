import React, { useContext, useState } from 'react'
import Follow from '../Drawer/Follow/Follow';
import style from './FollowInfo.module.scss'
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../constant/Route/route';
import Swal from 'sweetalert2';
import { CurrentUserContext } from '../../Context/currentUserProvider';

function FollowInfo({ userId, detail }) {
    // console.log(detail);
    const [data, setData] = useState(null);
    const [type, setType] = useState(null);
    const navigate = useNavigate();
    const { currentUser } = useContext(CurrentUserContext);
    const [followDrawer, setFollowDrawer] = useState(false);
    const handleClick = (value) => {
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
        // console.log(detail?.[value])
        setFollowDrawer(true);
        setData(detail?.[value])
        setType(value)
    }
    return (
        <>
            <div onClick={() => handleClick('follower')} className={style.follower}>
                <div>Followers</div>
                <div>{detail?.follower?.length}</div>
            </div>
            <div onClick={() => handleClick('following')} className={style.following}>
                <div>Following</div>
                <div>{detail?.following?.length}</div>
            </div>
            {followDrawer &&
                <Follow
                    open={() => setFollowDrawer(true)}
                    onClose={() => setFollowDrawer(false)}
                    data={data}
                    type={type}
                />
            }
        </>
    )
}

export default FollowInfo
