import { useContext, useEffect } from "react";
import { CurrentUserContext } from "../../Context/currentUserProvider";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../constant/Route/route";

// custom hook - react hooks + logic + reusable function
const useUserAvailable = (page) => {
    const { currentUser, loading } = useContext(CurrentUserContext);
    const navigate = useNavigate();
    console.log(currentUser, loading)

    useEffect(() => {
        if (loading) return;
        if (!currentUser) navigate(`${ROUTES.LOGIN}`);
        else if (currentUser && page) navigate(page);
        else navigate(`${ROUTES.HOME}`)
    }, [loading, currentUser])
}

export default useUserAvailable;