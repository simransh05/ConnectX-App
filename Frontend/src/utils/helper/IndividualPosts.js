import { useEffect, useState } from "react"
import api from "../api";

const useIndividualPosts = (userId, isHome) => {

    const [posts, setPosts] = useState(null);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const limit = 5;


    // fetch posts
    const fetchPosts = async () => {
        if (loading || !hasMore) return;

        try {
            setLoading(true);
            let res;
            if (isHome) {
                res = await api.getAllPosts(skip);
            } else {
                if (!userId) return;
                res = await api.getIndividualPosts(userId, skip);
            }
            console.log(res.data)
            if (res.data.length < limit) {
                setHasMore(false)
            }
            setPosts(prev => {
                let all;
                if (!prev) all = res.data
                else {
                    all = [...prev, ...res.data]
                }

                const unique = all.filter(
                    (post, index, self) =>
                        index === self.findIndex(p => p._id === post._id)
                )

                return unique
            })

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // first load
    useEffect(() => {
        setPosts(null);
        setSkip(0);
        setLoading(true);
        setHasMore(true);
        fetchPosts()
    }, [userId]);


    // fetch when skip changes
    useEffect(() => {
        fetchPosts();
    }, [skip, userId, isHome, setHasMore]);


    // scroll listener
    useEffect(() => {

        const handleScroll = () => {
            console.log(window.innerHeight, document.documentElement.scrollTop, document.documentElement.offsetHeight + 15)
            if (
                window.innerHeight +
                document.documentElement.scrollTop
                >= document.documentElement.offsetHeight - 50
            ) {
                // console.log('here')
                setSkip(prev => prev + limit);
            }

        };

        window.addEventListener("scroll", handleScroll);

        return () =>
            window.removeEventListener("scroll", handleScroll);

    }, []);


    return { posts, setPosts, loading };

};

export default useIndividualPosts;