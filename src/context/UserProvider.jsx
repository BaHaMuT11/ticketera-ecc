import { createContext, useState } from "react";


// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext(null);


// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
    const [userName, setUserName] = useState({nombre2: ""});

    return (
        <UserContext.Provider value={{
            userName, setUserName }}>

            {children}
        </UserContext.Provider>
    );
};