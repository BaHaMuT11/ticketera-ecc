import {createContext, useState} from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const TicketContext = createContext(null);


// eslint-disable-next-line react/prop-types
export const TicketProvider = ({ children }) => {
    const [ticketFormData, setTicketFormData] = useState({
        nombre: "",
        tipoOficina: "oficina",
        oficina: "",
        problema: "",
        correoElectronico: "",
        tipoCorreo: "registroCivil",
        celular: "",
        fonoFijo: "",
        ip: "164.96.",
        cuentaUsuario: "",
        maquina: "",
        tipoMaquina: "ETF",
        responsabilidad: "no",
        remoto: "si",
        mantenimiento: "no",
        fallaFisica: "no",
        pruebasMesa: ""
    });

    return (
        <TicketContext.Provider value={{
            ticketFormData, setTicketFormData }}>

            {children}
        </TicketContext.Provider>
    );
};