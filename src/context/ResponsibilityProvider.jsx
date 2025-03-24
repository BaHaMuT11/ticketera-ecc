import {createContext, useState} from "react";

export const ResposibilityContext = createContext(null);

// eslint-disable-next-line react/prop-types
const ResponsibilityProvider = ({children}) => {

    const [srceiFormData, setSrceiFormData] = useState({
        nombreTicket: "",
        servicio: "Impresoras",
        sintoma: "",
        diagnostico: "",
        otros: "",
        region: "",
        taxonomia: ""
    });
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