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
    const [esLlamadoNuevo, setEsLlamadoNuevo] = useState(true);
    const [idLLamadoActiva, setIdLLamadoActiva] = useState(-1);
    const [inventario, setInventario] = useState([]);

    return (
        <UserContext.Provider value={{
            userName, setUserName,
            llamados, setLlamados,
            llamadoActivo, setLlamadoActivo,
            esLlamadoNuevo, setEsLlamadoNuevo,
            idLLamadoActiva, setIdLLamadoActiva,
            inventario, setInventario}}>

            {children}
        </UserContext.Provider>
    );
};