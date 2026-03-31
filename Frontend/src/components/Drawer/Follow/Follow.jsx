import { Divider, Drawer } from '@mui/material'
import React from 'react'
import UserAvatar from '../../userAvatar/UserAvatar'
import style from './Follow.module.scss'
import ROUTES from '../../../constant/Route/route'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { CurrentUserContext } from '../../../Context/currentUserProvider'

function Follow({ open, onClose, data, type }) {
    const navigate = useNavigate();
    const { currentUser } = useContext(CurrentUserContext);
    // console.log(data)
    const formatName = (name) => {
        return name.charAt(0).toUpperCase() + name.slice(1, name.length)
    }

    const handleUser = (userId) => {
        if (userId === currentUser?._id) return navigate(`${ROUTES.PROFILE}`)
        navigate(`${ROUTES.PROFILE}/${userId}`)
    }
    return (
        <Drawer
            open={open}
            onClose={onClose}
            anchor="right"
            PaperProps={{
                sx: {
                    width: "250px",
                    height: "100vh",
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "10px",
                },
            }}
        >
            <table>
                <thead>
                    <tr>
                        <th colSpan="3" className={style.headFollow}>{formatName(type)}</th>
                    </tr>
                </thead>

                <tbody>
                    {data?.length > 0 ? (
                        data.map((d, idx) => (
                            <tr key={idx} className={style.indFollow}>
                                <td>
                                    <UserAvatar user={d} size={60} />
                                </td>

                                <td className={style.username}>{d?.name}</td>

                                <td className={style.btnView}>
                                    <button
                                        onClick={() => handleUser(d.userId)}
                                        className={style.viewProfile}
                                    >
                                        View Profile
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className={style.noFollow}>
                                No {type}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Drawer>
    )
}

export default Follow
