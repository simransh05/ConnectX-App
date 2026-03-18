import { useEffect, useState } from "react"
import api from "../api";

const useIndividualPosts = (userId) => {

    const [posts, setPosts] = useState([]);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const limit = 5;

    // fetch posts
    const fetchPosts = async () => {
        if (!userId || loading || !hasMore) return;

        try {
            setLoading(true);

            const res = await api.getIndividualPosts(userId, skip);
            console.log(res.data)
            if (res.data.length < limit) {
                setHasMore(false)
            }
            setPosts(prev => [...prev, ...res.data]);

            setSkip(prev => prev + limit);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // first load
    useEffect(() => {
        setPosts([]);
        setSkip(0);
    }, [userId]);


    // fetch when skip changes
    useEffect(() => {
        fetchPosts();
    }, [skip, userId]);


    // scroll listener
    useEffect(() => {

        const handleScroll = () => {

            if (
                window.innerHeight +
                document.documentElement.scrollTop
                >= document.documentElement.offsetHeight - 50
            ) {
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