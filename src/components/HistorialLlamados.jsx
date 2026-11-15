import {useContext, useMemo, useState} from "react";
import {useLocation} from "react-router";
import {ListChecks} from "lucide-react";
import {UserContext} from "../context/UserProvider.jsx";
import {Modal} from "./ui/Modal.jsx";
import TablaAtenciones from "./TablaAtenciones.jsx";
import {esResponsabilidad} from "../utilities/Atencion.js";
import {conLlamadoEnCurso} from "../utilities/Llamados.js";

// En el resumen del día ya está la tabla (editable), por eso ahí el botón no se muestra.
const RUTA_CON_TABLA = "/baha-summary";

/**
 * Botón flotante que abre una consulta de solo lectura con todos los llamados y atenciones del día.
 * Permite ordenar y paginar, pero no editar ni eliminar.
 */
const HistorialLlamados = () => {
    const {pathname} = useLocation();
    const {llamados, llamadoActivo} = useContext(UserContext);
    const [abierto, setAbierto] = useState(false);

    const todos = useMemo(() => conLlamadoEnCurso(llamados, llamadoActivo), [llamados, llamadoActivo]);

    if (pathname === RUTA_CON_TABLA) return null;

    const atenciones = todos.flatMap((llamado) => llamado.atenciones);
    const responsabilidad = atenciones.filter(esResponsabilidad).length;
    const resumen = [
        `${todos.length} ${todos.length === 1 ? "llamado" : "llamados"}`,
        `${atenciones.length} ${atenciones.length === 1 ? "atención" : "atenciones"}`,
        `${responsabilidad} de responsabilidad`
    ].join(" · ");

    return (
        <>
            <button type="button" onClick={() => setAbierto(true)}
                    aria-label={`Ver llamados y atenciones del día (${atenciones.length})`}
                    className="fixed bottom-6 right-6 z-40 inline-flex h-12 items-center gap-2.5 rounded-full bg-brand pl-4 pr-3 font-semibold text-brand-ink shadow-lg transition-[filter] hover:brightness-110">
                <ListChecks className="size-5" aria-hidden="true"/>
                <span className="hidden sm:inline">Ver llamados</span>
                <span className="grid h-7 min-w-7 place-items-center rounded-full bg-brand-ink/20 px-2 text-sm">{atenciones.length}</span>
            </button>
            <Modal open={abierto} onClose={() => setAbierto(false)} title="Llamados y atenciones del día" ancho="max-w-6xl">
                <p className="border-b border-line px-6 py-3 text-sm text-ink-2">{resumen}</p>
                <div className="p-4">
                    <TablaAtenciones llamados={todos} soloLectura/>
                </div>
            </Modal>
        </>
    );
};

export default HistorialLlamados;
