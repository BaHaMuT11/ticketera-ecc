import {useContext, useState} from "react";
import {ResposibilityContext} from "../context/ResponsibilityProvider.jsx";
import TicketBody from "./generic/TicketBody.jsx";
import {formTransform} from "../utilities/FormTransform.js";
import {StringBuilder} from "../utilities/StringBuilder.js";
import {UserContext} from "../context/UserProvider.jsx";
import {TicketContext} from "../context/TicketProvider.jsx";
import {useNavigate} from "react-router";
import {isValidString} from "../utilities/VariableUtils.js";
import {agregarAtencion} from "../utilities/Atencion.js";
import {ArrowRight, Sparkles} from "lucide-react";
import {Panel} from "./ui/Panel.jsx";
import {Field, Input, Select} from "./ui/Field.jsx";
import {Button} from "./ui/Button.jsx";

const CLASIFICACION_SERVICIO = {
    "Impresoras": "IMPRESORAS",
    "Pagos (Transbank)": "TRANSBANK",
    "Redes de comunicación- Internet": "REDES",
    "Redes de suministro eléctrico": "SUMINISTRO",
    "Licencias de Ofimática (Office 365)": "OFIMATICA"
};

const SrceiForm = () => {

    const {userName, llamadoActivo, setLlamadoActivo, llamados, esLlamadoNuevo, idLLamadoActiva} = useContext(UserContext);

    const {srceiFormData, setSrceiFormData, srceiTicket, setSrceiTicket} = useContext(ResposibilityContext);

    const {ticketExport, ticketFormData} = useContext(TicketContext);

    const [asunto, setAsunto] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name,value,type,checked} = e.target;
        setSrceiFormData({
            ...srceiFormData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const buildAtencionActiva = () => {
        const resolucionPH = ticketExport.derivacion;

        setLlamadoActivo(agregarAtencion({
            llamadoActivo, llamados, esLlamadoNuevo, idLLamadoActiva,
            oficina: formTransform(ticketFormData.oficina),
            atencion: {
                ticket: formTransform(srceiFormData.nombreTicket),
                funcionario: formTransform(ticketFormData.nombre),
                resolucion: resolucionPH === "" ? "RESUELTO" : resolucionPH,
                responsabilidad: ticketFormData.responsabilidad
            }
        }));
    }

    const handleEnding = () => {
        buildAtencionActiva();
        navigate("/baha-assistance");
    }

    const parseSrceiTicket = (srceiData) => {
        const defTicketSN = "• Ticket Service Now: " + formTransform(srceiData.nombreTicket);
        const sb = new StringBuilder(defTicketSN);

        sb.appendLine("• Servicio: " + formTransform(srceiData.servicio));
        sb.appendLine("• Oficina: " + ticketExport.oficina);
        sb.appendLine("• Nombre Funcionario: " + ticketExport.nombre);
        sb.appendLine("• Correo: " + ticketExport.correo);
        sb.appendLine("• Estación: " + ticketExport.estacion);
        sb.appendLine("• Número de Contacto Respaldo: " + ticketExport.numero);
        sb.appendLine("• Síntoma: " + formTransform(srceiData.sintoma));
        sb.appendLine("• Diagnóstico: " + formTransform(srceiData.diagnostico));
        sb.appendLine("• Otros : " + formTransform(srceiData.otros));
        sb.appendLine("");
        sb.appendLine("");
        sb.appendLine("Saludos,");
        sb.appendLine("Mesa de Servicios Nuevo SIDIV");
        sb.appendLine(userName.nombre2);
        sb.appendLine("Email: mdsf@nuevosidiv.registrocivil.cl");

        return sb.toString();
    }

    const clasificarServicio = (servicio) => CLASIFICACION_SERVICIO[servicio] ?? "";

    const handleSubmit = (e) => {
        e.preventDefault();
        const ticket = parseSrceiTicket(srceiFormData);
        setSrceiTicket(ticket);
        // Asunto: SERVICIO - REGIÓN - TAXONOMÍA - TICKET
        setAsunto(clasificarServicio(srceiFormData.servicio) + " - " + formTransform(srceiFormData.region) + " - " + formTransform(srceiFormData.taxonomia) + " - " + formTransform(srceiFormData.nombreTicket));
    }

    return (
        <div className="grid items-start gap-6 xl:grid-cols-[1fr_440px]">
            <Panel className="p-6">
                <form id="formularioResponsabilidad" onSubmit={handleSubmit}>
                    <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                        <Field label="Ticket" htmlFor="nombreTicket">
                            <Input id="nombreTicket" name="nombreTicket" mono
                                   value={srceiFormData.nombreTicket} onChange={handleChange}
                                   placeholder="Ej.: INC000015237270" required/>
                        </Field>
                        <Field label="Servicio" htmlFor="servicio">
                            <Select id="servicio" name="servicio" value={srceiFormData.servicio}
                                    onChange={handleChange} required>
                                <option value="Impresoras">Impresoras</option>
                                <option value="Pagos (Transbank)">Pagos (Transbank)</option>
                                <option value="Redes de comunicación- Internet">Redes de comunicación- Internet</option>
                                <option value="Redes de suministro eléctrico">Redes de suministro eléctrico</option>
                                <option value="Licencias de Ofimática (Office 365)">Licencias de Ofimática (Office 365)</option>
                            </Select>
                        </Field>
                        <Field label="Síntoma" htmlFor="sintoma">
                            <Input id="sintoma" name="sintoma" value={srceiFormData.sintoma}
                                   onChange={handleChange} required
                                   placeholder="Ej.: Módulo de captura se demora 15 minutos en iniciar"/>
                        </Field>
                        <Field label="Diagnóstico" htmlFor="diagnostico">
                            <Input id="diagnostico" name="diagnostico" value={srceiFormData.diagnostico}
                                   onChange={handleChange} required
                                   placeholder="Ej.: Demora se debe a problemas de red en la oficina"/>
                        </Field>
                        <Field label="Otros" htmlFor="otros" className="sm:col-span-2">
                            <Input id="otros" name="otros" value={srceiFormData.otros}
                                   onChange={handleChange}
                                   placeholder="Ej.: Se colocaron imágenes de respaldo en ticket"/>
                        </Field>
                        <Field label="Región" htmlFor="region"
                               hint={<>Región del equipo: <span className="font-medium text-brand">{ticketExport.region ? ticketExport.region : "No disponible aún"}</span></>}>
                            <Input id="region" name="region" value={srceiFormData.region}
                                   onChange={handleChange} required placeholder="Ej.: BIO BIO"/>
                        </Field>
                        <Field label="Taxonomía" htmlFor="taxonomia">
                            <Input id="taxonomia" name="taxonomia" value={srceiFormData.taxonomia}
                                   onChange={handleChange} required placeholder="Ej.: REVISAR"/>
                        </Field>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button type="submit" icon={Sparkles}>Generar asunto y correo</Button>
                    </div>
                </form>
            </Panel>

            <div className="space-y-4">
                <TicketBody title="Asunto" text={asunto} setter={setAsunto} rows={2} copyLabel="Copiar"
                            placeholder="El asunto aparece aquí."/>
                <TicketBody title="Correo de responsabilidad"
                            sub={<>Para: <span className="font-mono">soporte@srcei.cl</span></>}
                            text={srceiTicket} setter={setSrceiTicket} rows={16} copyLabel="Copiar correo"
                            placeholder="El correo aparece aquí cuando presionas Generar asunto y correo."/>
                <Button icon={ArrowRight} full onClick={handleEnding}
                        disabled={!isValidString(srceiFormData.nombreTicket)}>
                    Continuar
                </Button>
            </div>
        </div>
    );
};

export default SrceiForm;
