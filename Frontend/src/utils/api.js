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
        return await apiInstance.get(`${ROUTES.USER}`)
    },
    getMyPosts: async (userId) => {
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
    logout : async () => {
        return await apiInstance.get(`${ROUTES.LOGOUT}`)
    },
}

export default api