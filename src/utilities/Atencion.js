export const fechaActual = () =>
    new Date().toLocaleString("es-CL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

/** N1 (o sin derivación) se muestra siempre como RESUELTO. */
export const resolucionNormalizada = (resolucion) =>
    ["", "n1", "N1"].includes(resolucion) ? "RESUELTO" : resolucion;

/**
 * Devuelve el llamado activo con una atención nueva al final.
 * - Llamado nuevo: el id es el siguiente de la lista de llamados.
 * - Llamado existente: se conserva el id del llamado que se está retomando.
 */
export const agregarAtencion = ({llamadoActivo, llamados, esLlamadoNuevo, idLLamadoActiva, oficina, atencion}) => ({
    id: esLlamadoNuevo ? llamados.length + 1 : idLLamadoActiva,
    oficina,
    atenciones: [
        ...llamadoActivo.atenciones,
        {
            id: llamadoActivo.atenciones.length + 1,
            ...atencion,
            fecha: fechaActual()
        }
    ]
});
