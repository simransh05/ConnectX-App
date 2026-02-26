import api from "../utils/api";
import { create } from 'zustand'

export const allPostStore = create((set) => ({
    allPosts: [],

    fetchAllPosts: async () => {
        const res = api.getAllPosts();
        set({ allPosts: res.data })
    }
}))

