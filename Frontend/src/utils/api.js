import ROUTES from "../constant/Route/route";
import apiInstance from "./apiInstance";

const api = {
    postSignup : async (data) => {
        return await apiInstance.post(`${ROUTES.SIGNUP}`, data)
    },
    postLogin : async (data) => {
        return await apiInstance.post(`${ROUTES.LOGIN}`, data)
    },
}

export default api