import { Dialog, Divider, Modal, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { CurrentUserContext } from '../../../Context/currentUserProvider'
import api from '../../../utils/api';
import UserAvatar from '../../userAvatar/UserAvatar';
import style from './Group.module.scss'
import Swal from 'sweetalert2';

function Group({ open, onClose, onSuccess }) {
    const { currentUser } = useContext(CurrentUserContext);
    const [details, setDetails] = useState(null);
    const [groupName, setGroupName] = useState("");
    const [members, setMembers] = useState(new Set())
    const [memberList, setMemberList] = useState([]);
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

    const handleGroup = async () => {
        if (!groupName) {
            alert('group name required');
            return;
        }
        if (members.size < 1) {
            alert('atleast one member required')
        }
        const users = Array.from(members);
        users.unshift(currentUser?._id);
        console.log(users);
        const data = {
            admin: currentUser?._id,
            members: users,
            groupName,
            defaultMessage: 'Group Created'
        }
        console.log(data)
        const res = await api.postGroup(data);
        if (res.status === 200) {
            onClose()
            onSuccess(res.data)
        }
        // require name  + you  + alteast one more user added 
        // api for post of the group 
        // receive the group id then join all in that groupid 
        // then add that in the chat list 
        // logic change for the format of chat
    }

    const handleAdd = (id, name) => {
        if (members.size > 19) {
            alert('Only 20 members allowed')
        } else {
            if (members.has(id)) {
                setMemberList(prev => {
                    return prev?.filter(p => p.id !== id)
                })
                // remove
                setMembers(prev => {
                    const old = new Set(prev);
                    old.delete(id);
                    return old;
                })
            } else {
                setMemberList(prev => [...prev, { id, name }])
                setMembers(prev => new Set([...prev, id]))
            }
        }
    }

    console.log(memberList)

    return (
        <Dialog open={open} onClose={onClose}
            PaperProps={{
                sx: {
                    padding: '20px',
                    width: '250px'
                }
            }}
            className={style.groupContainer}>
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
                            <div key={d._id}>
                                <div className={style.groupInd}>
                                    <div className={style.userInfoGroup}>
                                        <UserAvatar
                                            user={d}
                                            size={40}
                                        />
                                        <div className={style.usernameGroup}>{d.name}</div>
                                    </div>

                                    {members.has(d.userId) ? <button onClick={() => handleAdd(d.userId, d.name)} className={style.removeMember}>Remove</button> : <button onClick={() => handleAdd(d.userId, d.name)} className={style.addMember}>Add</button>}

                                </div>
                                <Divider />
                            </div>
                        ))}
                        {memberList.length > 0 &&
                            <div className={style.memberContainer}>
                                <div>Selected:- </div>
                                {memberList.length > 0 && memberList.map(m => (
                                    <div key={m.id} className={style.memberList}>{m.name}</div>
                                ))}
                            </div>
                        }

                        <button onClick={handleGroup} className={style.createGroup}>Create Group</button>
                    </>
                )
                :
                <div className={style.noUserPresent}>No User Available</div>
            }
        </Dialog >
    )
}

export default Group
