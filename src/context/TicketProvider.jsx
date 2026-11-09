import {createContext, useState} from "react";
import {TICKET_INICIAL} from "../utilities/EstadosIniciales.js";

// eslint-disable-next-line react-refresh/only-export-components
export const TicketContext = createContext(null);


// eslint-disable-next-line react/prop-types
export const TicketProvider = ({ children }) => {
    const [ticketFormData, setTicketFormData] = useState({...TICKET_INICIAL});
    const [ticket, setTicket] = useState("")
    const [reporte, setReporte] = useState("");
    const [derivacion, setDerivacion] = useState("")
    const [ticketExport, setTicketExport] = useState({
        nombre: "",
        correo: "",
        estacion: "",
        numero: "",
        responsabilidad: "",
        oficina: "",
        region: ""
    });

    const [oficioForm, setOficioForm] = useState({
        numeroOficio: "",
        tipoOficio: "CÉDULA",
        anioOficio: String(new Date().getFullYear()),
        codigoOficina: "",
        run: ""
    });
    const [oficio, setOficio] = useState("");

    return (
        <TicketContext.Provider value={{
            ticketFormData, setTicketFormData,
            ticket, setTicket,
            derivacion, setDerivacion,
            ticketExport, setTicketExport,
            reporte, setReporte,
            oficioForm, setOficioForm,
            oficio, setOficio}}>

            {children}
        </TicketContext.Provider>
    );
};