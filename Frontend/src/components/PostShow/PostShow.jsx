import React, { useContext, useEffect } from 'react'
import style from './PostShow.module.scss'
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";
import UserAvatar from '../userAvatar/UserAvatar';
import { useState } from 'react';
import Comment from '../Drawer/Comment/Comment';
import { allPostStore } from '../../Zustand/AllPosts';
import api from '../../utils/api';
import socket from '../../Socket/socket';
import { AiFillLike } from "react-icons/ai";
import { CurrentUserContext } from '../../Context/currentUserProvider';
function PostShow({ posts }) {
    const [commentDrawer, setCommentDawer] = useState(false);
    const { currentUser } = useContext(CurrentUserContext);
    const [postid, setpostId] = useState(null);
    const [post, setPost] = useState(null);
    const [liked, setLiked] = useState(new Set());
    useEffect(() => {
        if (!posts) return;
        setPost(posts);
        const likedSet = new Set(
            posts?.filter(p => p.likes?.includes(currentUser?._id))
                .map(p => p._id)
        );
        console.log(likedSet)
        setLiked(likedSet);
    }, [posts, currentUser])

    console.log('posts', posts);
    const handleClick = (p) => {
        setCommentDawer(true);
        setpostId(p)
    }

    console.log(liked)


    const handleClose = () => {
        setCommentDawer(false)
        setpostId(null);
    }

    const handleLikeClick = (receiver, postId) => {
        if (liked.has(postId)) return;
        socket.emit('send-notify', { sender: currentUser?._id, receiver, postId, type: 'like' }, (res) => {
            if (res.status === 200) {
                setLiked(prev => new Set([...prev, postId]));
                setPost(prev =>
                    prev.map(post =>
                        post._id === postId
                            ? { ...post, likeCount: post.likeCount + 1 }
                            : post
                    )
                );
            }
        })
    }

    const handleSuccess = (postId) => {
        // count increase
        setPost(prev =>
            prev.map(post =>
                post._id === postId
                    ? { ...post, commentCount: post.commentCount + 1 }
                    : post
            )
        );
    }

    console.log(postid)
    return (
        <div className={style.postContainer}>
            {post?.length > 0 ?
                post?.map((p, idx) => (
                    <div key={idx} className={style.postInd}>
                        <img src={p?.photoVideo} alt="Image" className={style.imagePost} />
                        <div>
                            <UserAvatar
                                user={p.userId}
                                size={30}
                            />
                            <span> {p?.userId?.name}</span>
                        </div>
                        <div className={style.postCaption}>{p?.caption}</div>
                        <div className={style.postInfo}>
                            {liked.has(p._id) ?
                                <AiFillLike className={style.likedImage} />
                                :
                                <AiOutlineLike className={style.likeImage} onClick={() => handleLikeClick(p.userId?._id, p._id)} />
                            }
                            <span>{p.likeCount > 0 && p.likeCount}</span>
                            <FaRegComment className={style.commentImage} onClick={() => handleClick(p)} />
                            <span>{p.commentCount}</span>
                        </div>

                    </div>
                )) :
                <div className={style.noPost}>No Post Available</div>
            }
            {commentDrawer &&
                <Comment
                    open={() => setCommentDawer(true)}
                    onClose={handleClose}
                    onSuccess={()=>handleSuccess(postid._id)}
                    post={postid}
                />}
        </div>
    )
}

export default PostShow
