import api from "../utils/api";
import { create } from 'zustand'

export const allPostStore = create((set) => ({
    allPosts: null,

    fetchAllPosts: async () => {
        const res = await api.getAllPosts();
        console.log(res);
        set({ allPosts: res.data })
    }
}))

