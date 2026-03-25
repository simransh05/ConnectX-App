import { Dialog, Modal, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { CurrentUserContext } from '../../../Context/currentUserProvider'
import api from '../../../utils/api';
import UserAvatar from '../../userAvatar/UserAvatar';
import style from './Group.module.scss'

function Group({ open, onClose }) {
    const { currentUser } = useContext(CurrentUserContext);
    const [details, setDetails] = useState(null);
    const [groupName, setGroupName] = useState("");
    const [members, setMembers] = useState(new Set())
    useEffect(() => {
        const fetchFollow = async () => {
            const res = await api.getFollow(currentUser?._id);

            const mutual = res.data.follower.filter(f =>
                res.data.following.some(f2 => f2.userId === f.userId)
            )
            // console.log(res.data.follower, res.data.following)
            setDetails(mutual);
            // console.log(mutual)
        }
        fetchFollow()
    }, [currentUser])

    const handleGroup = () => {
        // require name  + you  + alteast one more user added 
        // api for post of the group 
        // receive the group id then join all in that groupid 
        // then add that in the chat list 
        // logic change for the format of chat
    }

    const handleAdd = (id) => {
        if (members.size > 19) {
            alert('Only 20 members allowed')
        } else {
            if (members.has(id)) {
                // remove
                setMembers(prev => {
                    const old = new Set(prev);
                    old.delete(id);
                    return old;
                })
            }
            setMembers(prev => new Set([...prev, id]))
        }
    }

    return (
        <Dialog open={open} onClose={onClose} sx={{ padding: '10px' }}>
            <TextField
                name='groupName'
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
                label='Group Name'
                required
            />
            {details?.length > 0 ?
                (
                    <>
                        {details.map(d => (
                            <div key={d._id} className={style.groupInd}>
                                <div className={style.userInfoGroup}>
                                    <UserAvatar
                                        user={d}
                                        size={40}
                                    />
                                    <div className={style.usernameGroup}>{d.name}</div>
                                </div>

                                {members.has(d.userId) ? <button onClick={() => handleAdd(d.userId)}>Remove</button> : <button onClick={() => handleAdd(d.userId)}>Add</button>}
                            </div>
                        ))}
                        {members.size > 0 && members.forEach(m => {
                            <span></span>
                        })}
                        <button onClick={handleGroup}>Create Group</button>
                    </>
                )
                :
                <div>No User Available</div>
            }
        </Dialog >
    )
}

export default Group
