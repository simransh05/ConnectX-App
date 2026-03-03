import React from 'react'
import { useState } from 'react';
import { createContext } from 'react'
export const SelectedUserContext = createContext(null);
function SelectedUserProvider({ children }) {
    const [selectedUser, setSelectedUser] = useState(null);
    return (
        <SelectedUserContext.Provider value={{ selectedUser, setSelectedUser }}>
            {children}
        </SelectedUserContext.Provider>
    )
}

export default SelectedUserProvider
