import React, { useState } from 'react'
import useFollowDetail from '../../utils/helper/followDetails';
import Follow from '../Drawer/Follow/Follow';
import style from './FollowInfo.module.scss'

function FollowInfo({ userId }) {
    const { detail } = useFollowDetail(userId);
    console.log(detail);
    const [data, setData] = useState(null);
    const [type, setType] = useState(null);
    const [followDrawer, setFollowDrawer] = useState(false);
    const handleClick = (value) => {
        console.log(detail?.[value])
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
