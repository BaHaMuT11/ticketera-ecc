import {createContext, useCallback, useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext(null);

const CLAVE = "ticketera-tema";
const TEMAS = ["claro", "oscuro", "sistema"];

const leerTema = () => {
    try {
        const guardado = localStorage.getItem(CLAVE);
        return TEMAS.includes(guardado) ? guardado : "sistema";
    } catch {
        return "sistema";
    }
};

const aplicarTema = (tema) => {
    const oscuro = tema === "oscuro" ||
        (tema === "sistema" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", oscuro);
};

export const ThemeProvider = ({children}) => {
    const [tema, setTemaState] = useState(leerTema);

    useEffect(() => {
        aplicarTema(tema);
        if (tema !== "sistema") return;

        // En modo "sistema" se sigue el cambio del sistema operativo en vivo.
        const consulta = window.matchMedia("(prefers-color-scheme: dark)");
        const alCambiar = () => aplicarTema("sistema");
        consulta.addEventListener("change", alCambiar);
        return () => consulta.removeEventListener("change", alCambiar);
    }, [tema]);

    const setTema = useCallback((nuevo) => {
        setTemaState(nuevo);
        try {
            localStorage.setItem(CLAVE, nuevo);
        } catch {
            // sin localStorage el tema vale solo para esta sesión
        }
    }, []);

    const valor = useMemo(() => ({tema, setTema}), [tema, setTema]);

    return <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>;
};

ThemeProvider.propTypes = {
    children: PropTypes.node
};
