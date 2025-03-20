import {createContext, useState} from "react";

export const ResposibilityContext = createContext(null);

// eslint-disable-next-line react/prop-types
const ResponsibilityProvider = ({children}) => {

    const [srceiFormData, setSrceiFormData] = useState({
    });
    return (
        <ResposibilityContext.Provider value={{
            srceiFormData, setSrceiFormData}}>
            {children}
        </ResposibilityContext.Provider>
    );
};

export default ResponsibilityProvider;