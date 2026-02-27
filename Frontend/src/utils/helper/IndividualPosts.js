import { useEffect, useState } from "react"
import api from "../api";

const useIndividualPosts = (userId) => {
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!userId) return;
            try {
                const res = await api.getIndividualPosts(userId);
                console.log(res.data);
                setPosts(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchPosts()
    }, [userId]);

    return { posts };
}

export default useIndividualPosts;