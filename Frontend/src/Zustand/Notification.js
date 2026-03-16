import api from "../utils/api";
import { create } from 'zustand'

export const NotificationStore = create((set) => ({
    notify: null,

    fetchNotification: async (userId) => {
        if (!userId) return;
        const res = await api.getNotification(userId);
        console.log(res);
        set({ notify: res.data })
    }
}))

