import {resolucionNormalizada} from "./Atencion.js";

const ENCABEZADOS = [
    "ID de Llamado",
    "ID de Atención",
    "Oficina",
    "Ticket",
    "Funcionario",
    "Resolución",
    "Responsabilidad",
    "Fecha"
];

const dosDigitos = (n) => String(n).padStart(2, "0");

export const nombreArchivoReporte = (fecha = new Date()) =>
    `reporte_llamados_${dosDigitos(fecha.getDate())}-${dosDigitos(fecha.getMonth() + 1)}-${fecha.getFullYear()}.xlsx`;

const filasDeLlamados = (llamados) =>
    llamados.flatMap((llamado) =>
        llamado.atenciones.map((atencion) => [
            llamado.id,
            atencion.id,
            llamado.oficina,
            atencion.ticket,
            atencion.funcionario,
            resolucionNormalizada(atencion.resolucion),
            atencion.responsabilidad,
            atencion.fecha
        ])
    );

/**
 * Descarga un .xlsx con todas las atenciones de los llamados.
 * Devuelve el nombre del archivo, o null si no había atenciones que exportar.
 * La librería se carga recién al exportar para no engordar la carga inicial.
 */
export const exportarLlamadosAExcel = async (llamados, nombreAgente) => {
    const filas = filasDeLlamados(llamados);
    if (filas.length === 0) return null;

    const XLSX = await import("xlsx");

    const hoja = XLSX.utils.aoa_to_sheet([
        [`Llamadas de ${nombreAgente}`],
        ENCABEZADOS,
        ...filas
    ]);

    hoja["!merges"] = [{s: {r: 0, c: 0}, e: {r: 0, c: ENCABEZADOS.length - 1}}];
    hoja["!cols"] = ENCABEZADOS.map((encabezado, columna) => ({
        wch: Math.min(50, Math.max(
            encabezado.length,
            ...filas.map((fila) => String(fila[columna] ?? "").length)
        ) + 2)
    }));
    hoja["!autofilter"] = {ref: `A2:${XLSX.utils.encode_cell({r: filas.length + 1, c: ENCABEZADOS.length - 1})}`};

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Resumen");

    const archivo = nombreArchivoReporte();
    XLSX.writeFile(libro, archivo);
    return archivo;
};
