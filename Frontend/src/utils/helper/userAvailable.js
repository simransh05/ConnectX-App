import { useContext, useEffect } from "react";
import { CurrentUserContext } from "../../Context/currentUserProvider";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../constant/Route/route";

// custom hook - react hooks + logic + reusable function
const userAvailable = (page) => {
    const { currentUser, loading } = useContext(CurrentUserContext);
    const naviagte = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!currentUser && page) return naviagte(`${page}`);
        if (!currentUser) return naviagte(`${ROUTES.LOGIN}`);
        if (currentUser && page) return naviagte(page)
        if (currentUser) return naviagte(`${ROUTES.HOME}`)
    }, [loading])
}

export default userAvailable;