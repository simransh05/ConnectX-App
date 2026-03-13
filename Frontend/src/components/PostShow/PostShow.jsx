import React, { useContext, useEffect } from 'react'
import style from './PostShow.module.scss'
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";
import UserAvatar from '../userAvatar/UserAvatar';
import { useState } from 'react';
import Comment from '../Drawer/Comment/Comment';
import api from '../../utils/api';
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import socket from '../../Socket/socket';
import { AiFillLike } from "react-icons/ai";
import { CurrentUserContext } from '../../Context/currentUserProvider';
import Swal from 'sweetalert2';
import { allPostStore } from '../../Zustand/AllPosts';
function PostShow({ posts, isProfile }) {
    const [commentDrawer, setCommentDawer] = useState(false);
    const { fetchAllPosts } = allPostStore()
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const [postid, setpostId] = useState(null);
    const [post, setPost] = useState(null);
    const [liked, setLiked] = useState(new Set());
    const [saved, setSaved] = useState(new Set());
    console.log(currentUser)
    useEffect(() => {
        if (!posts) return;
        setPost(posts);
        const likedSet = new Set(
            posts?.filter(p => p.likes?.includes(currentUser?._id))
                .map(p => p._id)
        );

        const savedSet = new Set(
            posts?.filter(p => currentUser?.savedPost?.includes(p?._id))
                .map(p => p._id)
        )
        setSaved(savedSet);
        // console.log(savedSet, likedSet, currentUser)
        setLiked(likedSet);
    }, [posts, currentUser])

    // console.log('posts', posts);
    const handleClick = (p) => {
        setCommentDawer(true);
        setpostId(p)
    }

    // posts?.map(p => {
    //     console.log(p.likes, p._id)
    // })


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

    const handleSave = async (postId) => {
        // add in set and save api 
        if (saved.has(postId)) return;
        const data = {
            postId,
            userId: currentUser?._id
        }
        const res = await api.savePost(data);
        if (res.status === 200) {
            setSaved(prev => new Set([...prev, postId]));
            // setCurrentUser(prev => [{ ...prev, }])
        }
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

    const handleDelete = async (postId) => {
        const result = await Swal.fire({
            title: 'Delete Post',
            text: 'Are you sure you want to delete post',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        })
        if (result.isConfirmed) {
            const res = await api.deletePost(postId);
            if (res.status === 200) {
                fetchAllPosts();
                const res1 = await api.getIndividualPosts(currentUser?._id);
                if (res1.status === 200) {
                    setPost(prev => prev?.filter(p => p._id != postId))
                }
            }
        }
    }

    console.log(posts)
    return (
        <div className={style.postContainer}>
            {post?.length > 0 ?
                post?.map((p, idx) => (
                    <div key={idx} className={style.postInd}>
                        {p?.fileType?.includes("image") && (
                            <img src={p?.photoVideo} alt="Image" className={style.imagePost} />
                        )}
                        {p?.fileType?.includes("video") && (
                            <video src={p?.photoVideo} alt="Video" className={style.imagePost} controls/>
                        )}
                        <div className={style.postUserInfo}>
                            <UserAvatar
                                user={p.userId}
                                size={30}
                            />
                            <div> {p?.userId?.name}</div>
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
                            <span>{p.commentCount > 0 && p.commentCount}</span>
                            {saved?.has(p._id) ? <FaBookmark className={style.alreadySave} /> : <CiBookmark className={style.addSave} onClick={() => handleSave(p._id)} />}
                        </div>
                        {isProfile &&
                            <div className={style.deletePost}>
                                <button onClick={() => handleDelete(p._id)} className={style.isProfile}>Delete Post</button>
                            </div>}
                    </div>
                )) :
                <div className={style.noPost}>No Post Available</div>
            }
            {commentDrawer &&
                <Comment
                    open={() => setCommentDawer(true)}
                    onClose={handleClose}
                    onSuccess={() => handleSuccess(postid._id)}
                    post={postid}
                />}
        </div>
    )
}

export default PostShow
