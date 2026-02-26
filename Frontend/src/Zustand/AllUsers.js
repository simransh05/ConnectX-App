// get all the users
import { create } from 'zustand'
import api from '../utils/api';

export const userStore = create((set) => ({
    allUsers: [],
    // loading: true,

    fetchAllUsers: async () => {
        const res = await api.getAllUser();
        set({ allUsers: res.data.length != 0 ? res.data : [] })
    }
}))