import React, { useContext, useEffect } from 'react'
import style from './PostShow.module.scss'
import { useNavigate } from 'react-router-dom'
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";
import UserAvatar from '../userAvatar/UserAvatar';
import { useState } from 'react';
import Comment from '../Drawer/Comment/Comment';
import api from '../../utils/api';
import { FaPlay } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import socket from '../../Socket/socket';
import { AiFillLike } from "react-icons/ai";
import { CurrentUserContext } from '../../Context/currentUserProvider';
import Swal from 'sweetalert2';
import { allPostStore } from '../../Zustand/AllPosts';
import ROUTES from '../../constant/Route/route';
import { CircularProgress, Menu, MenuItem } from '@mui/material';
import formatDate from '../../utils/helper/formatDate';
import { CiMenuKebab } from "react-icons/ci";

function PostShow({ posts, loading, isProfile, isSavedPost }) {
    const [commentDrawer, setCommentDawer] = useState(false);
    const { fetchAllPosts } = allPostStore()
    const navigate = useNavigate()
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const [postid, setpostId] = useState(null);
    const [post, setPost] = useState(null);
    const [liked, setLiked] = useState(new Set());
    const [anchorEl, setAnchorEl] = useState(null);
    const [saved, setSaved] = useState(new Set());
    const [videoPlay, setVideoPlay] = useState(null);
    // console.log(currentUser)
    useEffect(() => {
        if (!posts) return;
        // console.log(posts);
        setPost(posts);
        const likedSet = new Set(
            posts?.filter(p => p.likes?.includes(currentUser?._id))
                .map(p => p._id)
        );

        const savedSet = new Set(
            posts?.filter(p => currentUser?.savedPost?.includes(p?._id))
                .map(p => p._id)
        )
        // console.log(savedSet, likedSet, currentUser)
        const arr = [];

        posts.forEach(p => {
            if (p?.fileType?.includes("video")) {
                arr.push({ id: p._id, isPlayed: false });
            }
        });
        // console.log(arr)
        setVideoPlay(arr);
        setSaved(savedSet);
        setLiked(likedSet);
    }, [posts, currentUser])

    // console.log('posts', posts);
    const handleClick = (p) => {
        if (!currentUser) {
            Swal.fire({
                title: 'Not Login',
                text: 'Need to login first',
                icon: 'error',
                showCancelButton: false,
                showConfirmButton: false,
                timer: 5000
            })
            navigate(ROUTES.LOGIN);
            return;
        }
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
        if (!currentUser) {
            Swal.fire({
                title: 'Not Login',
                text: 'Need to login first',
                icon: 'error',
                showCancelButton: false,
                showConfirmButton: false,
                timer: 5000
            })
            navigate(ROUTES.LOGIN);
            return;
        }
        if (liked.has(postId)) {
            socket.emit('send-notify', { sender: currentUser?._id, receiver, postId, type: 'like', status: 'remove' }, (res) => {
                if (res.status === 200) {
                    // filter
                    setLiked(prev => {
                        const old = new Set(prev);
                        old.delete(postId);
                        return old;
                    })
                    setPost(prev =>
                        prev.map(post =>
                            post._id === postId
                                ? { ...post, likeCount: post.likeCount - 1 }
                                : post
                        )
                    );
                }
            })
            return;
        } else {
            socket.emit('send-notify', { sender: currentUser?._id, receiver, postId, type: 'like', status: 'add' }, (res) => {
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
    }

    const handleSave = async (postId) => {
        if (!currentUser) {
            Swal.fire({
                title: 'Not Login',
                text: 'Need to login first',
                icon: 'error',
                showCancelButton: false,
                showConfirmButton: false,
                timer: 5000,
                width: '50%'
            })
            navigate(ROUTES.LOGIN);
            return;
        }
        // add in set and save api 
        const data = {
            postId,
            userId: currentUser?._id
        }
        if (saved.has(postId)) {
            // console.log(saved.has(postId))
            const res = await api.deleteSave(postId);
            // console.log(res.status)
            if (res.status === 200) {
                setSaved(prev => {
                    const old = new Set(prev);
                    old.delete(postId);
                    return old;
                })
            }
            setCurrentUser(prev => ({
                ...prev,
                savedPost: (prev.savedPost || []).filter(s => s !== postId)
            }));
            if (isSavedPost) {
                posts = posts.filter(p => p._id !== postId)
            }
            return;
        } else {
            const res = await api.savePost(data);
            if (res.status === 200) {
                setSaved(prev => new Set([...prev, postId]));
                setCurrentUser(prev => ({
                    ...prev,
                    savedPost: [...(prev.savedPost || []), postId]
                }));
            }
        }
    }

    const handleSuccess = (postId, type) => {
        if (type === 'delete') {
            setPost(prev =>
                prev.map(post =>
                    post._id === postId
                        ? { ...post, commentCount: post.commentCount - 1 }
                        : post
                )
            );
        }

        else if (type === 'add') {
            setPost(prev =>
                prev.map(post =>
                    post._id === postId
                        ? { ...post, commentCount: post.commentCount + 1 }
                        : post
                )
            );
        }
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
            socket.emit('send-notify', { sender: currentUser?._id, type: 'post', postId, status: 'remove' })
            const res = await api.deletePost(postId);
            if (res.status === 200) {
                fetchAllPosts();
                const res1 = await api.getIndividualPosts(currentUser?._id, 0);
                if (res1.status === 200) {
                    setPost(prev => prev?.filter(p => p._id != postId))
                }
            }
        }
    }

    const handleVideo = (id) => {
        // console.log(videoPlay, id)
        setVideoPlay(prev => prev.map(p => {
            p?.id === id
                ? { ...p, isPlayed: true }
                : p
        }))
    }

    const handleUser = (userId) => {
        if (userId === currentUser?._id) return navigate(`${ROUTES.PROFILE}`)
        navigate(`${ROUTES.PROFILE}/${userId}`)
    }

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        setAnchorEl(null);
    }, []);

    console.log(posts)
    return (
        <div className={style.postContainer}>
            {post?.length > 0 ? (
                <>
                    {post?.map((p, idx) => {

                        const vid = videoPlay?.find(v => v?.id === p._id)
                        // console.log(vid, p._id)
                        return (
                            <div key={p._id} className={style.postInd}>
                                <div className={style.postHead}>
                                    <div className={style.postUserInfo} onClick={() => handleUser(p.userId._id)}>
                                        <UserAvatar
                                            user={p.userId}
                                            size={40}
                                        />
                                        <div className={style.postUserName}>{p?.userId?.name}</div>
                                    </div>
                                    {isProfile && <CiMenuKebab className={style.menuProfile} onClick={handleMenuClick} />}
                                    <Menu anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose} className={style.deleteBtn}>
                                        <MenuItem onClick={() => handleDelete(p._id)}>Delete Post</MenuItem>
                                    </Menu>
                                </div>


                                {p?.fileType?.includes("image") && (
                                    <img src={p?.photoVideo} alt="Image" className={style.imagePost} />
                                )}
                                {p?.fileType?.includes("video") && (
                                    vid && !vid.isPlayed ?
                                        <div className={style.videoContainer}>
                                            <FaPlay className={style.playBtn} />
                                            <video src={p?.photoVideo} alt="Video" className={style.imagePost} onClick={() => handleVideo(p._id)} />
                                        </div>
                                        :
                                        <video src={p?.photoVideo} alt="Video" className={style.imagePost} controls />
                                )}
                                <div className={style.postInfo}>
                                    {liked.has(p._id) ?
                                        <AiFillLike className={style.likedImage} onClick={() => handleLikeClick(p.userId?._id, p._id)} />
                                        :
                                        <AiOutlineLike className={style.likeImage} onClick={() => handleLikeClick(p.userId?._id, p._id)} />
                                    }
                                    <span>{p.likeCount > 0 && p.likeCount}</span>
                                    <FaRegComment className={style.commentImage} onClick={() => handleClick(p)} />
                                    <span>{p.commentCount > 0 && p.commentCount}</span>
                                    {saved?.has(p._id) ? <FaBookmark className={style.alreadySave} onClick={() => handleSave(p._id)} /> : <CiBookmark className={style.addSave} onClick={() => handleSave(p._id)} />}
                                </div>
                                <div className={style.postCaption}>{p?.caption}</div>
                                <div className={style.postTypeInfo}>
                                    <div className={style.timeCreated}>{formatDate(p?.createdAt)}</div>
                                    {isProfile && <div className={style.postType}>{p.postType}</div>}
                                </div>
                            </div>
                        )
                    }
                    )}
                    {loading && <CircularProgress />}
                </>
            )
                // loading
                :
                <div className={style.noPost}>No Post Available</div>
            }
            {commentDrawer &&
                <Comment
                    open={() => setCommentDawer(true)}
                    onClose={handleClose}
                    onSuccess={(type) => handleSuccess(postid._id, type)}
                    post={postid}
                />}
        </div>
    )
}

export default PostShow
