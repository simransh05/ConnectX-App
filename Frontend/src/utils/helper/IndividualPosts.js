import { useEffect, useState } from "react"
import api from "../api";

const useIndividualPosts = (userId, isHome) => {

    const [posts, setPosts] = useState([]);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const limit = 5;

    console.log(userId)

    // fetch posts
    const fetchPosts = async () => {
        if (!userId || loading || !hasMore) return;

        try {
            setLoading(true);
            let res;
            if (isHome) {
                res = await api.getAllPosts(skip);
            } else {
                res = await api.getIndividualPosts(userId, skip);
            }
            console.log(res.data, skip)
            if (res.data.length < limit) {
                setHasMore(false)
            }
            setPosts(prev => {
                const all = [...prev, ...res.data]

                const unique = all.filter(
                    (post, index, self) =>
                        index === self.findIndex(p => p._id === post._id)
                )

                return unique
            })

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
            // console.log(window.innerHeight, document.documentElement.scrollTop, document.documentElement.offsetHeight+15)
            if (
                window.innerHeight +
                document.documentElement.scrollTop
                >= document.documentElement.offsetHeight + 15
            ) {
                console.log('here')
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