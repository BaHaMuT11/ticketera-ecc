import {createContext, useState} from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const TicketContext = createContext(null);


// eslint-disable-next-line react/prop-types
export const TicketProvider = ({ children }) => {
    const [ticketFormData, setTicketFormData] = useState({
        nombre: "",
        tipoOficina: "OFICINA",
        oficina: "",
        problema: "",
        celular: "",
        fonoFijo: "",
        ip: "164.96.",
        cuentaUsuario: "",
        maquina: "",
        tipoMaquina: "ETF",
        responsabilidad: "NO",
        remoto: "SI",
        mantenimiento: "NO",
        fallaFisica: "NO",
        pruebasMesa: ""
    });
    const [ticket, setTicket] = useState("")
    return (
        <TicketContext.Provider value={{
            ticketFormData, setTicketFormData,
            ticket, setTicket}}>

            {children}
        </TicketContext.Provider>
    );
};