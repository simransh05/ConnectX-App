import { useContext, useEffect } from "react";
import { CurrentUserContext } from "../../Context/currentUserProvider";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../constant/Route/route";
import Swal from "sweetalert2";

// custom hook - react hooks + logic + reusable function
const useUserAvailable = (page) => {
    const { currentUser, loading } = useContext(CurrentUserContext);
    const navigate = useNavigate();
    // console.log(currentUser, loading)

    // console.log(page)

    useEffect(() => {
        if (loading) return;
        if (!currentUser && page === `${ROUTES.SIGNUP}`) return navigate(page);
        if (!currentUser) {
            Swal.fire({
                title: 'Not Login',
                text: 'Need to login first',
                icon: 'error',
                showCancelButton: false,
                showConfirmButton: false,
                timer: 5000,
                width: '50%'
            })
            navigate(`${ROUTES.LOGIN}`);
            return;
        }
        else if (currentUser && page) navigate(page);
        else navigate(`${ROUTES.HOME}`)
    }, [loading, currentUser])
}

export default useUserAvailable;