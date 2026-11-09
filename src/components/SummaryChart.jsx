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
import ResolucionChip from "./ResolucionChip.jsx";
import {resolucionNormalizada} from "../utilities/Atencion.js";
import {exportarLlamadosAExcel} from "../utilities/ExportExcel.js";
import {LLAMADO_INICIAL, SRCEI_INICIAL, TICKET_INICIAL} from "../utilities/EstadosIniciales.js";

const ENCABEZADOS = ["Llamado", "Atención", "Oficina", "Ticket", "Funcionario", "Resolución", "Del SRCeI", "Fecha"];

const SummaryChart = () => {

    const {userName, llamados, setLlamados, setLlamadoActivo, setEsLlamadoNuevo, setIdLLamadoActiva} = useContext(UserContext);

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

    const handleNuevaAtencion = () => {
        limpiarDatos("limpiarAtencion")
        navigate("/baha-ticket");
    };

    const handleNuevoLlamado = () => {
        limpiarDatos("limpiarLlamado");
        navigate("/baha-ticket");
    };

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
        {valor: atenciones.length - resueltasN1, etiqueta: "Derivadas a N2 o N3"}
    ];

    return (
        <div className="space-y-5">
            <Panel>
                <dl className="grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x">
                    {estadisticas.map(({valor, etiqueta}) => (
                        <div key={etiqueta} className="px-6 py-4">
                            <dd className="text-[28px] font-semibold leading-8 tracking-tight">{valor}</dd>
                            <dt className="text-sm text-ink-3">{etiqueta}</dt>
                        </div>
                    ))}
                </dl>
            </Panel>

            <Panel className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-surface-2">
                            <tr>
                                {ENCABEZADOS.map((encabezado) => (
                                    <th key={encabezado} scope="col" className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-ink-3">{encabezado}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {llamados.map((llamado) => (
                                llamado.atenciones.map((atencion) => (
                                    <tr key={`${llamado.id}-${atencion.id}`} className="border-t border-line">
                                        <th scope="row" className="px-4 py-3.5 text-left text-[15px] font-semibold">{llamado.id}</th>
                                        <td className="px-4 py-3.5 text-[15px] text-ink-2">{atencion.id}</td>
                                        <td className="px-4 py-3.5 text-[15px]">{llamado.oficina}</td>
                                        <td className="px-4 py-3.5 font-mono text-[13.5px]">{atencion.ticket}</td>
                                        <td className="px-4 py-3.5 text-[15px]">{atencion.funcionario}</td>
                                        <td className="px-4 py-3.5"><ResolucionChip resolucion={atencion.resolucion}/></td>
                                        <td className="px-4 py-3.5 text-[15px] text-ink-2">{atencion.responsabilidad === "SI" ? "Sí" : "No"}</td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-[14px] text-ink-2">{atencion.fecha}</td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
                {atenciones.length === 0 && (
                    <p className="border-t border-line px-6 py-8 text-[15px] text-ink-2">
                        Todavía no hay atenciones registradas. Crea un ticket para empezar.
                    </p>
                )}
            </Panel>

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
