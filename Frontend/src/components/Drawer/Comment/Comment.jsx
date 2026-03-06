import { Drawer, TextField } from '@mui/material'
import React from 'react'
import style from './Comment.module.scss'
import { useEffect } from 'react';
import api from '../../../utils/api';
import { useState } from 'react';
import { CurrentUserContext } from '../../../Context/currentUserProvider';
import { useContext } from 'react';

function Comment({ open, onClose, onSuccess, postId }) {
    const [commentInput, setCommentInput] = useState("");
    const { currentUser } = useContext(CurrentUserContext)
    const [commentData, setCommentData] = useState([]);
    useEffect(() => {
        const fetchComment = async () => {
            const res = await api.getComments(postId);
            // console.log(res)
            setCommentData(res.data);
        }
        fetchComment();
    }, [])
    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentInput.trim()) return;
        const data = {
            userId: currentUser?._id,
            comment: commentInput,
            postId
        }
        // console.log(data)
        const res = await api.postComment(data);
        if (res.status === 200) {
            const res1 = await api.getComments(postId);
            // console.log(res1)
            setCommentData(res1.data);
        }
    }
    return (
        <Drawer open={open} onClose={onClose} anchor='bottom' className={style.commentDrawer}
            PaperProps={{
                sx: {
                    height: '300px',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px'
                }
            }}>
            <div className={style.sendComment}>
                <input type='text' name='comment' placeholder='Add Comment' onChange={(e) => setCommentInput(e.target.value)} />
                <button onClick={handleComment}>Send</button>
            </div>

            <div>
                {commentData?.map(c => (
                    <div key={c?._id} className={style.indComment}>
                        <img src={c?.userId?.profilePic} alt="profile pic"  className={style.imageComment}/>
                        <div className={style.commentName}>{c?.userId?.name}</div>
                        <p className={style.commentMessage}>{c?.message}</p>
                    </div>
                ))}
            </div>
        </Drawer>
    )
}

export default Comment
