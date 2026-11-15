import {useEffect} from "react";

/**
 * Pide confirmación al navegador antes de recargar (botón, F5, Ctrl+R), cerrar la pestaña o la ventana,
 * o salir de la página, mientras "activo" sea verdadero. Los datos viven solo en memoria y se perderían.
 * El navegador muestra su propio mensaje: no se puede personalizar el texto.
 */
export const useAvisoAlSalir = (activo) => {
    useEffect(() => {
        if (!activo) return;
        const alSalir = (evento) => {
            evento.preventDefault();
            evento.returnValue = ""; // requerido por algunos navegadores para mostrar el aviso
        };
        window.addEventListener("beforeunload", alSalir);
        return () => window.removeEventListener("beforeunload", alSalir);
    }, [activo]);
};
