import React from 'react'
import style from './PostShow.module.scss'
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";
import UserAvatar from '../userAvatar/UserAvatar';
import { useState } from 'react';
import Comment from '../Drawer/Comment/Comment';
import { allPostStore } from '../../Zustand/AllPosts';
import api from '../../utils/api';
function PostShow({ posts }) {
    const [commentDrawer, setCommentDawer] = useState(false);
    const [postid ,setpostId] = useState(null);
    console.log(posts);
    const handleClick =(id) =>{
        setCommentDawer(true);
        setpostId(id)   
    }

    const handleClose = ()=>{
        setCommentDawer(false)
        setpostId(null);
    }

    console.log(postid)
    return (
        <div className={style.postContainer}>
            {posts?.length > 0 ?
                posts?.map((p, idx) => (
                    <div key={idx} className={style.postInd}>
                        <img src={p?.photoVideo} alt="Image" className={style.imagePost} />
                        <div>
                            <img src={p?.userId?.profilePic} alt="profile pic" className={style.imageProfile} />
                            <span> {p?.userId?.name}</span>
                        </div>
                        <div className={style.postCaption}>{p?.caption}</div>
                        <div>
                            <button>
                                <AiOutlineLike />
                            </button>
                            <span>{p.likeCount > 0 && p.likeCount}</span>
                            <button onClick={()=>handleClick(p._id)}>
                                <FaRegComment />
                            </button>
                            <span>{p.commentCount}</span>
                        </div>
                        {commentDrawer &&
                        <Comment
                        open={() => setCommentDawer(true)}
                        onClose={handleClose}
                        postId={postid}
                        /> }

                    </div>
                )) :
                <div className={style.noPost}>No Post Available</div>
            }
        </div>
    )
}

export default PostShow
