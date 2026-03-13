import ROUTES from "../constant/Route/route";
import apiInstance from "./apiInstance";

const api = {
    postSignup: async (data) => {
        return await apiInstance.post(`${ROUTES.SIGNUP}`, data)
    },
    postLogin: async (data) => {
        return await apiInstance.post(`${ROUTES.LOGIN}`, data)
    },
    getUser: async () => {
        return await apiInstance.get(`${ROUTES.USER}${ROUTES.INDIVIDUAL}`)
    },
    getAllUser: async (userId) => {
        return await apiInstance.get(`${ROUTES.USER}/${userId}`)
    },
    getIndividualPosts: async (userId) => {
        return await apiInstance.get(`${ROUTES.POST}${ROUTES.INDIVIDUAL}/${userId}`)
    },
    getAllPosts: async () => {
        return await apiInstance.get(`${ROUTES.POST}`)
    },
    getNotification: async (userId) => {
        return await apiInstance.get(`${ROUTES.NOTIFICATION}/${userId}`)
    },
    getIndividualMessage: async (user1, user2) => {
        return await apiInstance.get(`${ROUTES.MESSAGES}${ROUTES.INDIVIDUAL}/${user1}/${user2}`)
    },
    getMessages: async (userId) => {
        return await apiInstance.get(`${ROUTES.MESSAGES}/${userId}`)
    },
    getFollow: async (userId) => {
        return await apiInstance.get(`${ROUTES.FOLLOW}/${userId}`)
    },
    logout: async () => {
        return await apiInstance.get(`${ROUTES.LOGOUT}`)
    },
    updateProfile: async (data) => {
        return await apiInstance.post(`${ROUTES.UPDATE}${ROUTES.USER}`, data)
    },
    postUploadPost: async (data) => {
        return await apiInstance.post(`${ROUTES.POST}`, data)
    },
    postPassword: async (data) => {
        return await apiInstance.post(`${ROUTES.USER}${ROUTES.UPDATE}`, data)
    },
    getComments: async (postId) => {
        return await apiInstance.get(`${ROUTES.POST}${ROUTES.COMMENT}/${postId}`)
    },
    postComment: async (data) => {
        return await apiInstance.post(`${ROUTES.POST}${ROUTES.COMMENT}`, data)
    },
    deleteChat: async (userId, other) => {
        return await apiInstance.post(`${ROUTES.MESSAGES}${ROUTES.DELETE}/${userId}/${other}`)
    },
    deleteNotify: async (userId) => {
        return await apiInstance.post(`${ROUTES.NOTIFICATION}${ROUTES.DELETE}/${userId}`)
    },
    savePost: async (data) => {
        return await apiInstance.post(`${ROUTES.POST}${ROUTES.SAVE}`, data)
    },
    deletePost: async (postId) => {
        return await apiInstance.delete(`${ROUTES.POST}/${postId}`)
    },
    getSavedPost: async (userId) => {
        return await apiInstance.get(`${ROUTES.POST}${ROUTES.SAVE}/${userId}`)
    }
}

export default api