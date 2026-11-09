import {createContext, useState} from "react";
import {SRCEI_INICIAL} from "../utilities/EstadosIniciales.js";

export const ResposibilityContext = createContext(null);

// eslint-disable-next-line react/prop-types
const ResponsibilityProvider = ({children}) => {

    const [srceiFormData, setSrceiFormData] = useState({...SRCEI_INICIAL});
    const [srceiTicket, setSrceiTicket] = useState("");

    return (
        <ResposibilityContext.Provider value={{
            srceiFormData, setSrceiFormData,
            srceiTicket, setSrceiTicket}}>
            {children}
        </ResposibilityContext.Provider>
    );
};

export default ResponsibilityProvider;