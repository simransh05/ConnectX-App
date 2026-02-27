import { useEffect, useState } from "react";
import api from "../api";

const useFollowDetail = (userId) => {
    const [detail, setDetail] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchFollow = async () => {
            try {
                const res = await api.getFollow(userId);
                setDetail(res.data);
            } catch (err) {
                console.log(err)
            }
        };

        fetchFollow();
    }, [userId]);

    return { detail };
};

export default useFollowDetail;