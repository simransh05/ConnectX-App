import api from "../utils/api";
import { create } from 'zustand'

export const followStore = create((set) => ({
    followInfo: null,

    fetchFollowInfo: async (userId) => {
        if (!userId) return;
        const res = await api.getFollow(userId);
        // console.log(res);
        set({ followInfo: res.data })
    }
}))

