import { Drawer, TextField } from '@mui/material'
import React from 'react'
import style from './Comment.module.scss'
import { useEffect } from 'react';
import api from '../../../utils/api';
import { useState } from 'react';
import { CurrentUserContext } from '../../../Context/currentUserProvider';
import { useContext } from 'react';
import socket from '../../../Socket/socket';
import UserAvatar from '../../userAvatar/UserAvatar';

function Comment({ open, onClose, onSuccess, post }) {
    const [commentInput, setCommentInput] = useState("");
    const { currentUser } = useContext(CurrentUserContext)
    const [commentData, setCommentData] = useState([]);
    useEffect(() => {
        const fetchComment = async () => {
            const res = await api.getComments(post._id);
            // console.log(res)
            setCommentData(res.data);
        }
        fetchComment();
    }, [])

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            handleComment();
        }
    }

    const handleComment = async (e) => {
        if (!commentInput.trim()) return;
        const data = {
            userId: currentUser?._id,
            comment: commentInput,
            postId: post?._id
        }
        socket.emit('send-notify', { sender: currentUser?._id, receiver: post.userId._id, type: 'comment', postId: post._id }, (res) => {
            if (res.status === 200) {

            }
        })
        // console.log(data)
        const res = await api.postComment(data);
        if (res.status === 200) {
            const res1 = await api.getComments(post?._id);
            // console.log(res1)
            setCommentData(res1.data);
            setCommentInput("");
            onSuccess()
        }
    }

    // console.log(post);
    return (
        <Drawer open={open} onClose={onClose} anchor='bottom' className={style.commentDrawer}
            PaperProps={{
                sx: {
                    height: '60%',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px'
                }
            }}>
            <div className={style.commentInputContainer}>
                <div className={style.sendComment}>
                    <textarea type='text' name='comment' placeholder='Add Comment' onChange={(e) => setCommentInput(e.target.value)} value={commentInput} onKeyDown={handleEnter} />
                    <button onClick={handleComment}>Send</button>
                </div>
            </div>

            <div>
                {commentData?.map(c => (
                    <div key={c?._id} className={style.commentContainer}>
                        <div className={style.indComment}>
                            <UserAvatar
                                user={c.userId}
                                size={50}
                            />
                            <div className={style.commentName}>{c?.userId?.name}</div>
                        </div>
                        <div className={style.commentMessage}>
                            <p>{c?.message}</p>
                        </div>

                    </div>
                ))}
            </div>
        </Drawer>
    )
}

export default Comment
