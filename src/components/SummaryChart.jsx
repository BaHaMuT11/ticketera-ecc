import {useContext, useState} from "react";
import {UserContext} from "../context/UserProvider.jsx";
import {useNavigate} from "react-router";
import {TicketContext} from "../context/TicketProvider.jsx";
import {ResposibilityContext} from "../context/ResponsibilityProvider.jsx";
import {ToastContext} from "../context/ToastProvider.jsx";
import {Plus, Power, User, Info} from "lucide-react";
import {Panel} from "./ui/Panel.jsx";
import {Button} from "./ui/Button.jsx";
import {ConfirmDialog} from "./ui/ConfirmDialog.jsx";
import TablaAtenciones from "./TablaAtenciones.jsx";
import {esResponsabilidad, resolucionNormalizada} from "../utilities/Atencion.js";
import {editarAtencion, editarLlamado, eliminarAtencion, eliminarLlamado, idTrasEliminarLlamado} from "../utilities/Llamados.js";
import {exportarLlamadosAExcel} from "../utilities/ExportExcel.js";
import {LLAMADO_INICIAL, SRCEI_INICIAL, TICKET_INICIAL} from "../utilities/EstadosIniciales.js";

const SummaryChart = () => {

    const {userName, llamados, setLlamados, setLlamadoActivo, setEsLlamadoNuevo, idLLamadoActiva, setIdLLamadoActiva} = useContext(UserContext);

    const {ticketFormData, setTicketFormData, setReporte, setTicket, setDerivacion} = useContext(TicketContext);

    const {setSrceiTicket, setSrceiFormData} = useContext(ResposibilityContext);

    const {toast} = useContext(ToastContext);

    const [confirmarCierre, setConfirmarCierre] = useState(false);

    const navigate = useNavigate();

    const limpiarDatos = (accion) => {
        if (accion === "limpiarAtencion") {
            setEsLlamadoNuevo(false);
            setTicketFormData({
                ...ticketFormData,
                problema: "",
                pruebasMesa: "",
                grupoResolutor: "",
                responsabilidad: ""
            });
            setTicket("");
            setDerivacion("");
            setSrceiTicket("");
            setSrceiFormData({...SRCEI_INICIAL});
            setReporte("");
        }
        if (accion === "limpiarLlamado") {
            setTicket("");
            setDerivacion("");
            setSrceiTicket("");
            setEsLlamadoNuevo(true);
            setTicketFormData({...TICKET_INICIAL});
            setSrceiFormData({...SRCEI_INICIAL});
            setLlamadoActivo(() => ({
                oficina: "",
                atenciones: []
            }));
            setReporte("");
        }
        if (accion === "cerrarDia") {
            setTicket("");
            setDerivacion("");
            setSrceiTicket("");
            setTicketFormData({...TICKET_INICIAL});
            setSrceiFormData({...SRCEI_INICIAL});
            setReporte("");
            setLlamados([]);
            setLlamadoActivo({...LLAMADO_INICIAL});
            setIdLLamadoActiva(-1)
            setEsLlamadoNuevo(true)
        }
    }

    const handleNuevoLlamado = () => {
        limpiarDatos("limpiarLlamado");
        navigate("/baha-ticket");
    };

    // La tabla puede haber editado o eliminado filas desde la última vez que se trabajó el llamado.
    // Por eso se retoma desde la lista de llamados (la fuente de verdad) y no desde la copia en "llamadoActivo".
    // Si ese llamado ya no existe (se eliminó), se parte uno nuevo.
    const handleNuevaAtencion = () => {
        const activo = llamados.find((llamado) => llamado.id === idLLamadoActiva);
        if (!activo) {
            handleNuevoLlamado();
            return;
        }
        limpiarDatos("limpiarAtencion");
        setLlamadoActivo({...activo, atenciones: activo.atenciones.map((atencion) => ({...atencion}))});
        // El formulario manda la oficina al guardar: debe llevar la que tiene el llamado ahora (puede haberse editado).
        setTicketFormData((previo) => ({...previo, oficina: activo.oficina}));
        navigate("/baha-ticket");
    };

    const handleEditarLlamado = (llamadoId, cambios) =>
        setLlamados((actuales) => editarLlamado(actuales, llamadoId, cambios));

    const handleEditarAtencion = (llamadoId, atencionId, cambios) =>
        setLlamados((actuales) => editarAtencion(actuales, llamadoId, atencionId, cambios));

    // Al desaparecer un llamado los siguientes se renumeran: hay que mover también el puntero al llamado activo.
    const registrarEliminacion = (resultado, llamadoId, mensaje) => {
        setLlamados(resultado.llamados);
        if (resultado.llamadoEliminado) {
            setIdLLamadoActiva(idTrasEliminarLlamado(idLLamadoActiva, llamadoId) ?? -1);
        }
        toast(mensaje);
    };

    const handleEliminarAtencion = (llamadoId, atencionId) => {
        const resultado = eliminarAtencion(llamados, llamadoId, atencionId);
        registrarEliminacion(resultado, llamadoId, resultado.llamadoEliminado
            ? `Se eliminó la atención y el llamado ${llamadoId}`
            : "Se eliminó la atención");
    };

    const handleEliminarLlamado = (llamadoId) =>
        registrarEliminacion(eliminarLlamado(llamados, llamadoId), llamadoId, `Se eliminó el llamado ${llamadoId}`);

    // Descarga el Excel con todas las atenciones y recién después limpia el día.
    // Si la descarga falla, el día queda abierto para no perder los datos.
    const handleCerrarDia = async () => {
        setConfirmarCierre(false);
        try {
            const archivo = await exportarLlamadosAExcel(llamados, userName.nombre2);
            limpiarDatos("cerrarDia");
            navigate("/");
            toast(archivo
                ? `Día cerrado. Se descargó ${archivo}`
                : "Día cerrado. No había atenciones para exportar.");
        } catch (error) {
            console.error("Error al exportar el reporte:", error);
            toast("No se pudo generar el Excel. El día sigue abierto.", "error");
        }
    };

    const atenciones = llamados.flatMap((llamado) => llamado.atenciones);
    const resueltasN1 = atenciones.filter((a) => resolucionNormalizada(a.resolucion) === "RESUELTO").length;

    const estadisticas = [
        {valor: llamados.length, etiqueta: "Llamados"},
        {valor: atenciones.length, etiqueta: "Atenciones"},
        {valor: resueltasN1, etiqueta: "Resueltas en N1"},
        {valor: atenciones.length - resueltasN1, etiqueta: "Derivadas a N2 o N3"},
        {valor: atenciones.filter(esResponsabilidad).length, etiqueta: "Tickets de responsabilidad"}
    ];

    return (
        <div className="space-y-5">
            <Panel>
                <dl className="grid grid-cols-2 divide-line sm:grid-cols-5 sm:divide-x">
                    {estadisticas.map(({valor, etiqueta}) => (
                        <div key={etiqueta} className="px-5 py-4 last:col-span-2 sm:last:col-span-1">
                            <dd className="text-[28px] font-semibold leading-8 tracking-tight">{valor}</dd>
                            <dt className="text-sm text-ink-3">{etiqueta}</dt>
                        </div>
                    ))}
                </dl>
            </Panel>

            <TablaAtenciones
                llamados={llamados}
                onEditarLlamado={handleEditarLlamado}
                onEditarAtencion={handleEditarAtencion}
                onEliminarAtencion={handleEliminarAtencion}
                onEliminarLlamado={handleEliminarLlamado}/>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                    <Button icon={Plus} onClick={handleNuevaAtencion}>Nueva atención</Button>
                    <Button variant="ghost" icon={User} onClick={handleNuevoLlamado}>Nuevo llamado</Button>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-2 text-sm text-ink-3">
                        <Info className="size-4 shrink-0" aria-hidden="true"/>
                        Cerrar el día descarga el Excel y borra todos los llamados.
                    </span>
                    <Button variant="danger" icon={Power} onClick={() => setConfirmarCierre(true)}>Cerrar día</Button>
                </div>
            </div>

            <ConfirmDialog
                open={confirmarCierre}
                title="¿Cerrar el día?"
                description={atenciones.length > 0
                    ? `Se descargará un Excel con ${atenciones.length} ${atenciones.length === 1 ? "atención" : "atenciones"} y se borrarán todos los llamados de hoy. Esta acción no se puede deshacer.`
                    : "No hay atenciones para exportar. Se limpiarán los datos del turno."}
                confirmLabel="Cerrar día"
                danger
                onConfirm={handleCerrarDia}
                onCancel={() => setConfirmarCierre(false)}
            />
        </div>
    );
};

export default SummaryChart;
