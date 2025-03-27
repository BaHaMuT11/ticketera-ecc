import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
    const [userName, setUserName] = useState({nombre2: ""});
    const [llamados, setLlamados] = useState([]);
    const [llamadoActivo, setLlamadoActivo] = useState({
        id: 0,
        oficina: "",
        atenciones: []
    });
    const [atencionActiva, setAtencionActiva] = useState({
        id: 1,
        ticket: "",
        funcionario: "",
        resolucion: "",
        responsabilidad: "SI"
    });

    return (
        <UserContext.Provider value={{
            userName, setUserName,
            llamados, setLlamados,
            atencionActiva, setAtencionActiva,
            llamadoActivo, setLlamadoActivo}}>

            {children}
        </UserContext.Provider>
    );
};