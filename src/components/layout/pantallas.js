// Pasos del flujo del llamado. El orden es el del riel lateral.
export const PANTALLAS = [
    {
        ruta: "/",
        paso: "Agente",
        detalle: "Quién atiende",
        titulo: "Inicio de turno",
        subtitulo: "Antes de partir, dinos quién atiende."
    },
    {
        ruta: "/baha-ticket",
        paso: "Ticket",
        detalle: "Datos del llamado",
        titulo: "Nuevo ticket",
        subtitulo: "Completa los datos del llamado y genera el ticket."
    },
    {
        ruta: "/baha-responsible",
        paso: "Responsabilidad",
        detalle: "Solo si es del SRCeI",
        titulo: "Ticket de responsabilidad",
        subtitulo: "Se envía a SRCeI cuando la falla no es de la mesa."
    },
    {
        ruta: "/baha-assistance",
        paso: "Atención",
        detalle: "Resumen del llamado",
        titulo: "Resumen de atenciones",
        subtitulo: "Revisa lo que registraste en este llamado antes de seguir."
    },
    {
        ruta: "/baha-summary",
        paso: "Resumen del día",
        detalle: "Todas las atenciones",
        titulo: "Resumen del día",
        subtitulo: "Todas las atenciones de tu turno, en orden."
    }
];

export const indiceDePantalla = (ruta) => {
    const indice = PANTALLAS.findIndex((p) => p.ruta === ruta);
    return indice === -1 ? 0 : indice;
};
