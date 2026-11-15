const OPCIONES_FECHA = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
};

export const formatearFecha = (fecha) => fecha.toLocaleString("es-CL", OPCIONES_FECHA);

const dosDigitos = (n) => String(n).padStart(2, "0");

/** Marca de tiempo (ms) -> texto para un input datetime-local (hora local). */
export const aInputFecha = (timestamp) => {
    const f = new Date(timestamp);
    return `${f.getFullYear()}-${dosDigitos(f.getMonth() + 1)}-${dosDigitos(f.getDate())}T${dosDigitos(f.getHours())}:${dosDigitos(f.getMinutes())}`;
};

/** N1 (o sin derivación) se muestra siempre como RESUELTO. */
export const resolucionNormalizada = (resolucion) =>
    ["", "n1", "N1"].includes(resolucion) ? "RESUELTO" : resolucion;

/** Un ticket de responsabilidad es una atención que es responsabilidad del SRCeI. */
export const esResponsabilidad = (atencion) => atencion.responsabilidad === "SI";

/**
 * Devuelve el llamado activo con una atención nueva al final.
 * - Llamado nuevo: el id es el siguiente de la lista de llamados.
 * - Llamado existente: se conserva el id del llamado que se está retomando.
 * Cada atención guarda su fecha como texto (para mostrar) y como marca de tiempo (para ordenar).
 */
export const agregarAtencion = ({llamadoActivo, llamados, esLlamadoNuevo, idLLamadoActiva, oficina, atencion}) => {
    const ahora = new Date();
    return {
        id: esLlamadoNuevo ? llamados.length + 1 : idLLamadoActiva,
        oficina,
        atenciones: [
            ...llamadoActivo.atenciones,
            {
                id: llamadoActivo.atenciones.length + 1,
                ...atencion,
                fecha: formatearFecha(ahora),
                timestamp: ahora.getTime()
            }
        ]
    };
};
