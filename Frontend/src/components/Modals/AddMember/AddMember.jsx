import { Dialog, Divider } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { CurrentUserContext } from '../../../Context/currentUserProvider'
import api from '../../../utils/api'
import UserAvatar from '../../userAvatar/UserAvatar'
import style from './AddMember.module.scss'
import { useParams } from 'react-router-dom'
import socket from '../../../Socket/socket'

function AddMember({ open, onClose, members }) {
    const { currentUser } = useContext(CurrentUserContext)
    const { userId } = useParams()

    const [allMutual, setAllMutual] = useState([])
    const [addMore, setAddMore] = useState(new Set())
    const [memberList, setMemberList] = useState([])

    useEffect(() => {
        const fetchFollow = async () => {
            const res = await api.getFollow(currentUser?._id)

            const mutual = res.data.follower.filter(f =>
                res.data.following.some(f2 => f2.userId === f.userId)
            )

            setAllMutual(mutual)
        }

        if (currentUser?._id) fetchFollow()
    }, [currentUser])

    const handleAdd = (id, name) => {
        if (members.size + addMore.size > 19) {
            alert('Only 20 members allowed')
            return;
        }

        if (addMore.has(id)) {
            // remove
            setAddMore(prev => {
                const updated = new Set(prev)
                updated.delete(id)
                return updated
            })

            setMemberList(prev => prev.filter(p => p.id !== id))
        } else {
            // add
            setAddMore(prev => new Set([...prev, id]))
            setMemberList(prev => [...prev, { id, name }])
        }
    }

    const handleClick = async () => {
        if (addMore.size === 0) {
            alert('need to add members');
            return;
        } else if (addMore.size + members.length > 20) {
            alert('only 20 members allowed');
            return;
        } else {
            const data = {
                groupId: userId,
                members: Array.from(addMore)
            }
            console.log(data);
            const res = await api.addMember(data);
            console.log(res.data);
        }
        // idea is first check then api send to add and the socket send message to the new members 
        // socket.emit("send-notify", {
        //     sender: data.admin,
        //     receiver: data.members,
        //     groupId: data._id,
        //     name: data.groupName,
        //     groupName: data.groupName,
        //     type: "group",
        //     status: "add"
        // });
        // const info = {
        //     _id: data._id,
        //     type: "group",
        //     groupName: data.groupName,
        //     members: data.members
        // }
    }

    console.log(members, allMutual)

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: '300px', padding: '10px' }
            }}
        >
            <div className={style.heading}>Add Members</div>
            <Divider />

            {allMutual.length > 0 ? (
                <>
                    {allMutual.map(a => (
                        <div key={a._id} >
                            <div className={style.userRow}>
                                <div className={style.userInfo}>
                                    <UserAvatar user={a} size={40} />
                                    <div className={style.name}>{a.name}</div>
                                </div>

                                {members.some(m => m._id === a.userId) ?
                                    <button disabled className={style.disbaledBtn}>
                                        Aready Added
                                    </button>
                                    :
                                    <button
                                        onClick={() => handleAdd(a.userId, a.name)}
                                        className={
                                            addMore.has(a.userId)
                                                ? style.removeMember
                                                : style.addMember
                                        }
                                    >
                                        {addMore.has(a.userId) ? 'Remove' : 'Add'}
                                    </button>}
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

                    <button
                        className={addMore.size > 0 ? style.finalBtn : style.disabledBtncreate}
                        disabled={addMore.size === 0}
                        onClick={handleClick}
                    >
                        Add Members
                    </button>
                </>
            ) : (
                <div className={style.noUser}>No Available User</div>
            )}
        </Dialog>
    )
}

export default AddMember