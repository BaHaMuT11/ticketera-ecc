// Operaciones puras sobre la lista de llamados (editar y eliminar desde la tabla).
// Tras eliminar se renumeran los ids (llamados 1..n y atenciones 1..m dentro de cada llamado)
// para que los ids nuevos que se generen después no choquen con los existentes.

const renumerar = (llamados) =>
    llamados.map((llamado, i) => ({
        ...llamado,
        id: i + 1,
        atenciones: llamado.atenciones.map((atencion, j) => ({...atencion, id: j + 1}))
    }));

/** Elimina una atención. Si era la única del llamado, el llamado también desaparece. */
export const eliminarAtencion = (llamados, llamadoId, atencionId) => {
    const restantes = llamados
        .map((llamado) => llamado.id === llamadoId
            ? {...llamado, atenciones: llamado.atenciones.filter((a) => a.id !== atencionId)}
            : llamado)
        .filter((llamado) => llamado.atenciones.length > 0);
    return {llamados: renumerar(restantes), llamadoEliminado: restantes.length < llamados.length};
};

export const eliminarLlamado = (llamados, llamadoId) => ({
    llamados: renumerar(llamados.filter((llamado) => llamado.id !== llamadoId)),
    llamadoEliminado: true
});

export const editarLlamado = (llamados, llamadoId, cambios) =>
    llamados.map((llamado) => llamado.id === llamadoId ? {...llamado, ...cambios} : llamado);

export const editarAtencion = (llamados, llamadoId, atencionId, cambios) =>
    llamados.map((llamado) => llamado.id === llamadoId
        ? {...llamado, atenciones: llamado.atenciones.map((a) => a.id === atencionId ? {...a, ...cambios} : a)}
        : llamado);

/** Id que pasa a tener el llamado activo cuando se elimina el llamado "eliminadoId". null si era el activo. */
export const idTrasEliminarLlamado = (idActivo, eliminadoId) => {
    if (idActivo === eliminadoId) return null;
    return idActivo > eliminadoId ? idActivo - 1 : idActivo;
};

/**
 * Lista de llamados incluyendo el que se está trabajando, aunque todavía no se haya confirmado
 * con "Continuar" en el resumen del llamado (hasta ese momento solo vive en llamadoActivo).
 */
export const conLlamadoEnCurso = (llamados, llamadoActivo) => {
    if (llamadoActivo.atenciones.length === 0) return llamados;
    return llamados.some((llamado) => llamado.id === llamadoActivo.id)
        ? llamados.map((llamado) => llamado.id === llamadoActivo.id ? llamadoActivo : llamado)
        : [...llamados, llamadoActivo];
};
