// get all the users
import { create } from 'zustand'
import api from '../utils/api';

export const userStore = create((set) => ({
    allUsers: null,
    // loading: true,

    fetchAllUsers: async (userId) => {
        const res = await api.getAllUser(userId);
        set({ allUsers: res.data.length != 0 ? res.data : [] })
    }
}))