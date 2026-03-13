import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import useUserAvailable from '../../utils/helper/userAvailable'
import ROUTES from '../../constant/Route/route'
import api from '../../utils/api';
import { CurrentUserContext } from '../../Context/currentUserProvider';
import PostShow from '../../components/PostShow/PostShow';

function SavedPost() {
    const { currentUser } = useContext(CurrentUserContext);
    useUserAvailable(`${ROUTES.SAVEDPOST}`);
    const [posts, setPosts] = useState(null);
    useEffect(() => {
        const fetchPosts = async () => {
            if (!currentUser) return;
            const res = await api.getSavedPost(currentUser?._id)
            setPosts(res.data);
        }
        fetchPosts()
    }, [currentUser])
    return (
        <>
            <Navbar />
            <PostShow
                posts={posts}
            />
        </>
    )
}

export default SavedPost
