import {createContext, useCallback, useMemo, useState} from "react";
import PropTypes from "prop-types";

// eslint-disable-next-line react-refresh/only-export-components
export const PreferenciasTablaContext = createContext(null);

const CLAVE = "ticketera-tabla";
const ORDENES = ["desc", "asc"];
const VISTAS = ["paginas", "todas"];
const INICIAL = {orden: "desc", vista: "paginas"};

const leer = () => {
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE));
        return {
            orden: ORDENES.includes(guardado?.orden) ? guardado.orden : INICIAL.orden,
            vista: VISTAS.includes(guardado?.vista) ? guardado.vista : INICIAL.vista
        };
    } catch {
        return INICIAL;
    }
};

const guardar = (preferencias) => {
    try {
        localStorage.setItem(CLAVE, JSON.stringify(preferencias));
    } catch {
        // sin localStorage las preferencias valen solo mientras la página siga abierta
    }
};

/**
 * Orden por fecha y vista (10 por página / todas) de las tablas de llamados.
 * Las comparten la tabla del resumen y el historial del botón flotante, y se mantienen al navegar
 * por la aplicación y al recargarla (solo estas preferencias: los llamados siguen viviendo en memoria).
 * orden: "desc" = más reciente primero, "asc" = más antigua primero.
 * vista: "paginas" = de a 10 filas, "todas" = sin paginar.
 */
export const PreferenciasTablaProvider = ({children}) => {
    const [preferencias, setPreferencias] = useState(leer);

    const cambiar = useCallback((cambios) => {
        setPreferencias((actuales) => {
            const nuevas = {...actuales, ...cambios};
            guardar(nuevas);
            return nuevas;
        });
    }, []);

    const valor = useMemo(() => ({
        orden: preferencias.orden,
        vista: preferencias.vista,
        setOrden: (orden) => cambiar({orden}),
        setVista: (vista) => cambiar({vista})
    }), [preferencias, cambiar]);

    return <PreferenciasTablaContext.Provider value={valor}>{children}</PreferenciasTablaContext.Provider>;
};

PreferenciasTablaProvider.propTypes = {
    children: PropTypes.node
};
