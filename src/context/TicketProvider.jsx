import {createContext, useState} from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const TicketContext = createContext(null);


// eslint-disable-next-line react/prop-types
export const TicketProvider = ({ children }) => {
    const [ticketFormData, setTicketFormData] = useState({
        nombre: "",
        tipoOficina: "OFICINA",
        oficina: "",
        whatsapp: "",
        problema: "",
        celular: "",
        correoElectronico: "",
        tipoCorreo:"REGISTROCIVIL",
        fonoFijo: "",
        ip: "164.96.",
        cuentaUsuario: "",
        maquina: "",
        tipoMaquina: "ETF",
        responsabilidad: "NO",
        pruebasMesa: ""
    });
    const [ticket, setTicket] = useState("")
    const [reporte, setReporte] = useState("");
    const [derivacion, setDerivacion] = useState("")
    const [ticketExport, setTicketExport] = useState({
        nombre: "",
        correo: "",
        estacion: "",
        numero: "",
        responsabilidad: "",
        oficina: ""
    });

    const [oficioForm, setOficioForm] = useState({
        numeroOficio: "",
        tipoOficio: "CÉDULA",
        anioOficio: "2025",
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