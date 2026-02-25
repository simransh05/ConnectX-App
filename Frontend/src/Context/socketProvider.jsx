import { createContext, useEffect } from "react";
import { useContext } from "react";
import socket from "../Socket/socket";
import { CurrentUserContext } from "./currentUserProvider";

export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
    const { currentUser, loading } = useContext(CurrentUserContext);

    useEffect(() => {
        if (loading) return;
        if (currentUser?._id) {
            socket.emit("register", currentUser._id);
        } else {
            return;
        }
    }, [loading, currentUser]);


    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;