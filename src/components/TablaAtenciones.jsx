import {useMemo, useState} from "react";
import PropTypes from "prop-types";
import {ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Trash2} from "lucide-react";
import {Panel} from "./ui/Panel.jsx";
import {Button} from "./ui/Button.jsx";
import {Modal} from "./ui/Modal.jsx";
import {SegmentedButtons} from "./ui/Segmented.jsx";
import EditableCell from "./EditableCell.jsx";
import ResolucionChip from "./ResolucionChip.jsx";
import {aInputFecha, formatearFecha, resolucionNormalizada} from "../utilities/Atencion.js";
import {formTransform} from "../utilities/FormTransform.js";

const POR_PAGINA = 10;

const OPCIONES_VISTA = [
    {value: "paginas", label: `${POR_PAGINA} por página`},
    {value: "todas", label: "Mostrar todas"}
];

const OPCIONES_RESOLUCION = [
    {value: "RESUELTO", label: "Resuelto en N1"},
    {value: "N2", label: "Derivado a N2"},
    {value: "N3", label: "Derivado a N3"}
];

const OPCIONES_RESPONSABILIDAD = [
    {value: "SI", label: "Sí"},
    {value: "NO", label: "No"}
];

const TH = "whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-ink-3";
const TD = "px-4 py-3.5";

const plural = (n, singular, pluralTexto) => `${n} ${n === 1 ? singular : pluralTexto}`;

// En solo lectura la celda es texto plano; si no, se edita con doble clic.
const Celda = ({soloLectura, children, ...propsEdicion}) =>
    soloLectura ? children : <EditableCell {...propsEdicion}>{children}</EditableCell>;

Celda.propTypes = {
    soloLectura: PropTypes.bool,
    children: PropTypes.node
};

/**
 * Tabla de llamados y atenciones. Con soloLectura solo permite ordenar y paginar
 * (sin editar ni eliminar), y no necesita los manejadores.
 */
const TablaAtenciones = ({llamados, soloLectura = false, onEditarLlamado, onEditarAtencion, onEliminarAtencion, onEliminarLlamado}) => {

    // "desc": la atención más reciente arriba (por defecto). "asc": la primera del día arriba.
    const [orden, setOrden] = useState("desc");
    const [vista, setVista] = useState("paginas");
    const [pagina, setPagina] = useState(0);
    const [porEliminar, setPorEliminar] = useState(null);

    const filas = useMemo(() => {
        const sentido = orden === "desc" ? -1 : 1;
        return llamados
            .flatMap((llamado) => llamado.atenciones.map((atencion) => ({llamado, atencion})))
            .sort((a, b) => sentido * (
                (a.atencion.timestamp ?? 0) - (b.atencion.timestamp ?? 0)
                || a.llamado.id - b.llamado.id
                || a.atencion.id - b.atencion.id
            ));
    }, [llamados, orden]);

    const totalPaginas = Math.max(1, Math.ceil(filas.length / POR_PAGINA));
    // Si al eliminar desaparece la última página, se muestra la nueva última.
    const paginaActual = Math.min(pagina, totalPaginas - 1);
    const mostrarTodas = vista === "todas";
    const inicio = mostrarTodas ? 0 : paginaActual * POR_PAGINA;
    const visibles = mostrarTodas ? filas : filas.slice(inicio, inicio + POR_PAGINA);

    const cambiarOrden = () => {
        setOrden((actual) => (actual === "desc" ? "asc" : "desc"));
        setPagina(0);
    };

    const cambiarVista = (nueva) => {
        setVista(nueva);
        setPagina(0);
    };

    // Se busca en los datos vigentes: si cambiaron mientras el diálogo estaba abierto, no se elimina nada que ya no exista.
    const llamadoPorEliminar = porEliminar && llamados.find((l) => l.id === porEliminar.llamadoId);
    const atencionPorEliminar = llamadoPorEliminar?.atenciones.find((a) => a.id === porEliminar.atencionId);
    const abierto = Boolean(atencionPorEliminar);
    const esUnica = abierto && llamadoPorEliminar.atenciones.length === 1;

    const cerrarDialogo = () => setPorEliminar(null);

    const eliminarAtencion = () => {
        onEliminarAtencion(llamadoPorEliminar.id, atencionPorEliminar.id);
        cerrarDialogo();
    };

    const eliminarLlamado = () => {
        onEliminarLlamado(llamadoPorEliminar.id);
        cerrarDialogo();
    };

    return (
        <Panel className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-surface-2">
                        <tr>
                            <th scope="col" className={TH}>Llamado</th>
                            <th scope="col" className={TH}>Atención</th>
                            <th scope="col" className={TH}>Oficina</th>
                            <th scope="col" className={TH}>Ticket</th>
                            <th scope="col" className={TH}>Funcionario</th>
                            <th scope="col" className={TH}>Resolución</th>
                            <th scope="col" className={TH}>Del SRCeI</th>
                            <th scope="col" className={TH} aria-sort={orden === "desc" ? "descending" : "ascending"}>
                                <button type="button" onClick={cambiarOrden}
                                        title={orden === "desc" ? "Más recientes primero. Clic para ver primero las más antiguas" : "Más antiguas primero. Clic para ver primero las más recientes"}
                                        className="-mx-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 hover:bg-line/60 hover:text-ink">
                                    Fecha
                                    {orden === "desc"
                                        ? <ArrowDown className="size-3.5" aria-hidden="true"/>
                                        : <ArrowUp className="size-3.5" aria-hidden="true"/>}
                                </button>
                            </th>
                            {!soloLectura && <th scope="col" className={TH}><span className="sr-only">Acciones</span></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {visibles.map(({llamado, atencion}) => (
                            <tr key={`${llamado.id}-${atencion.id}`} className="border-t border-line">
                                <th scope="row" className={`${TD} text-left text-[15px] font-semibold`}>{llamado.id}</th>
                                <td className={`${TD} text-[15px] text-ink-2`}>{atencion.id}</td>
                                <td className={`${TD} text-[15px]`}>
                                    <Celda soloLectura={soloLectura} label="Oficina" value={llamado.oficina} normalizar={formTransform}
                                                  titulo="Doble clic para editar la oficina (se cambia en todo el llamado)"
                                                  onCommit={(oficina) => onEditarLlamado(llamado.id, {oficina})}>
                                        {llamado.oficina}
                                    </Celda>
                                </td>
                                <td className={`${TD} whitespace-nowrap font-mono text-[13.5px]`}>
                                    <Celda soloLectura={soloLectura} label="Ticket" value={atencion.ticket} mono normalizar={formTransform}
                                                  onCommit={(ticket) => onEditarAtencion(llamado.id, atencion.id, {ticket})}>
                                        {atencion.ticket}
                                    </Celda>
                                </td>
                                <td className={`${TD} text-[15px]`}>
                                    <Celda soloLectura={soloLectura} label="Funcionario" value={atencion.funcionario} normalizar={formTransform}
                                                  onCommit={(funcionario) => onEditarAtencion(llamado.id, atencion.id, {funcionario})}>
                                        {atencion.funcionario}
                                    </Celda>
                                </td>
                                <td className={TD}>
                                    <Celda soloLectura={soloLectura} label="Resolución" type="select" options={OPCIONES_RESOLUCION}
                                                  value={resolucionNormalizada(atencion.resolucion)}
                                                  onCommit={(resolucion) => onEditarAtencion(llamado.id, atencion.id, {resolucion})}>
                                        <ResolucionChip resolucion={atencion.resolucion}/>
                                    </Celda>
                                </td>
                                <td className={`${TD} text-[15px] text-ink-2`}>
                                    <Celda soloLectura={soloLectura} label="Del SRCeI" type="select" options={OPCIONES_RESPONSABILIDAD}
                                                  value={atencion.responsabilidad}
                                                  onCommit={(responsabilidad) => onEditarAtencion(llamado.id, atencion.id, {responsabilidad})}>
                                        {atencion.responsabilidad === "SI" ? "Sí" : "No"}
                                    </Celda>
                                </td>
                                <td className={`${TD} whitespace-nowrap text-[14px] text-ink-2`}>
                                    <Celda soloLectura={soloLectura} label="Fecha" type="datetime-local"
                                                  value={aInputFecha(atencion.timestamp ?? Date.now())}
                                                  onCommit={(texto) => {
                                                      const fecha = new Date(texto);
                                                      if (Number.isNaN(fecha.getTime())) return;
                                                      onEditarAtencion(llamado.id, atencion.id, {
                                                          fecha: formatearFecha(fecha),
                                                          timestamp: fecha.getTime()
                                                      });
                                                  }}>
                                        {atencion.fecha}
                                    </Celda>
                                </td>
                                {!soloLectura && (
                                    <td className={`${TD} text-right`}>
                                        <button type="button"
                                                aria-label={`Eliminar atención ${atencion.id} del llamado ${llamado.id}`}
                                                title="Eliminar"
                                                onClick={() => setPorEliminar({llamadoId: llamado.id, atencionId: atencion.id})}
                                                className="grid size-8 place-items-center rounded-md text-ink-3 hover:bg-danger-soft hover:text-danger">
                                            <Trash2 className="size-4" aria-hidden="true"/>
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filas.length === 0 && (
                <p className="border-t border-line px-6 py-8 text-[15px] text-ink-2">
                    Todavía no hay atenciones registradas. Crea un ticket para empezar.
                </p>
            )}

            {filas.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line bg-surface-2 px-4 py-3">
                    <p className="text-sm text-ink-2" aria-live="polite">
                        {mostrarTodas || filas.length <= POR_PAGINA
                            ? `Mostrando ${plural(filas.length, "atención", "atenciones")}`
                            : `Mostrando ${inicio + 1}–${inicio + visibles.length} de ${filas.length} atenciones`}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        {filas.length > POR_PAGINA && (
                            <SegmentedButtons options={OPCIONES_VISTA} value={vista} onSelect={cambiarVista}/>
                        )}
                        {!mostrarTodas && totalPaginas > 1 && (
                            <nav aria-label="Paginación" className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" icon={ChevronLeft} disabled={paginaActual === 0}
                                        onClick={() => setPagina(paginaActual - 1)}>Anterior</Button>
                                <span className="px-1 text-sm text-ink-2">Página {paginaActual + 1} de {totalPaginas}</span>
                                <Button variant="ghost" size="sm" disabled={paginaActual >= totalPaginas - 1}
                                        onClick={() => setPagina(paginaActual + 1)}>
                                    Siguiente <ChevronRight className="size-4" aria-hidden="true"/>
                                </Button>
                            </nav>
                        )}
                    </div>
                </div>
            )}

            {!soloLectura && (
                <Modal open={abierto} onClose={cerrarDialogo}
                       title={esUnica ? "¿Eliminar la atención y el llamado?" : "¿Eliminar de la tabla?"}>
                    {abierto && (
                        <>
                            <div className="space-y-3 px-6 py-5 text-[15px] leading-6 text-ink-2">
                                <p>
                                    Atención <strong className="text-ink">{atencionPorEliminar.id}</strong> del llamado{" "}
                                    <strong className="text-ink">{llamadoPorEliminar.id}</strong>
                                    {llamadoPorEliminar.oficina && <> ({llamadoPorEliminar.oficina})</>}
                                    {atencionPorEliminar.ticket && <>, ticket <span className="font-mono text-[13.5px] text-ink">{atencionPorEliminar.ticket}</span></>}.
                                </p>
                                {esUnica
                                    ? <p>Es la única atención de ese llamado, así que el llamado también se eliminará.</p>
                                    : <p>Puedes eliminar solo esta atención o el llamado completo ({plural(llamadoPorEliminar.atenciones.length, "atención", "atenciones")}).</p>}
                                <p>Esta acción no se puede deshacer y los números de llamado y de atención se reordenarán.</p>
                            </div>
                            <div className="flex flex-wrap justify-end gap-3 border-t border-line px-6 py-4">
                                <Button variant="ghost" size="sm" onClick={cerrarDialogo} autoFocus>Volver</Button>
                                {esUnica ? (
                                    <Button variant="danger" size="sm" icon={Trash2} onClick={eliminarAtencion}>Eliminar</Button>
                                ) : (
                                    <>
                                        <Button variant="danger" size="sm" onClick={eliminarAtencion}>Solo esta atención</Button>
                                        <Button variant="danger" size="sm" onClick={eliminarLlamado}>Llamado completo</Button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </Modal>
            )}
        </Panel>
    );
};

TablaAtenciones.propTypes = {
    llamados: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        oficina: PropTypes.string,
        atenciones: PropTypes.array.isRequired
    })).isRequired,
    soloLectura: PropTypes.bool,
    onEditarLlamado: PropTypes.func,
    onEditarAtencion: PropTypes.func,
    onEliminarAtencion: PropTypes.func,
    onEliminarLlamado: PropTypes.func
};

export default TablaAtenciones;
