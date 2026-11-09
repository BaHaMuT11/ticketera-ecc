import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router";
import PropTypes from "prop-types";
import {ArrowRight, Banknote, Check, ChevronDown, ChevronUp, FileCheck, FilePen, FileText, Send, Sparkles} from "lucide-react";
import {UserContext} from "../context/UserProvider.jsx";
import {TicketContext} from "../context/TicketProvider.jsx";
import {StringBuilder} from "../utilities/StringBuilder.js"
import TicketBody from "./generic/TicketBody.jsx";
import {formTransform, limpiarRegion, traducirOficina} from "../utilities/FormTransform.js";
import {isset, isValidString} from "../utilities/VariableUtils.js";
import {agregarAtencion} from "../utilities/Atencion.js";
import ReportForm from "./ReportForm.jsx";
import FormModal from "./generic/FormModal.jsx";
import OficioModal from "./modalForms/OficioModal.jsx";
import ProblemaCombobox from "./ProblemaCombobox.jsx";
import {Panel, PanelTitle} from "./ui/Panel.jsx";
import {Field, Input, Textarea} from "./ui/Field.jsx";
import {Segmented, SegmentedButtons} from "./ui/Segmented.jsx";
import {Button} from "./ui/Button.jsx";
import {Chip} from "./ui/Chip.jsx";

const TIPOS_OFICINA = [
    {value: "OFICINA", label: "Oficina"},
    {value: "CONSULADO", label: "Consulado"}
];

const TIPOS_MAQUINA = [
    {value: "ETF", label: "ETF", title: "Estación todas las funciones"},
    {value: "CON", label: "CON", title: "Consulados"},
    {value: "EEN", label: "EEN", title: "Estación de entrega"},
    {value: "ECL", label: "ECL", title: "Estación de captura"},
    {value: "TER", label: "TER", title: "Maleta"},
    {value: "BOC", label: "BOC", title: "Estación de Backoffice Central"},
    {value: "EBO", label: "EBO", title: "Estación BackOffice Tradicional"},
    {value: "TAB", label: "TAB", title: "Tablet"},
    {value: "TEC", label: "TEC", title: "TEC"},
    {value: "TEM", label: "TEM", title: "TEM"},
    {value: "SI", label: "S/I", title: "Sin información"}
];

const TIPOS_CORREO = [
    {value: "SI", label: "S/I", dominio: ""},
    {value: "REGISTROCIVIL", label: "Registro Civil", dominio: "@registrocivil.gob.cl"},
    {value: "CONSULADO", label: "Consulado", dominio: "@minrel.gob.cl"},
    {value: "MINISTERIO", label: "Ministerio", dominio: "@minrel.cl"},
    {value: "SRCEI", label: "SRCEI", dominio: "@srcei.cl"}
];

const HORARIOS = [
    {value: "LUNES A JUEVES 8:30 - 1, VIERNES HASTA LAS 1", label: "LaJ+V"},
    {value: "LUNES A VIERNES 8:30 - 1", label: "LaV"}
];

const ACCIONES_N2 = [
    {icono: FileText, titulo: "Oficio", corto: "Oficio"},
    {icono: FilePen, titulo: "Oficio Corregido", corto: "Oficio corregido"},
    {icono: FileCheck, titulo: "Término de Tarea", corto: "Término de tarea"},
    {icono: Send, titulo: "Despachar Solicitud", corto: "Despachar solicitud"},
    {icono: Banknote, titulo: "Cuadratura de Caja", corto: "Cuadratura de caja"}
];

const BotonValidar = ({onClick, etiqueta}) => (
    <button type="button" onClick={onClick} aria-label={etiqueta} title={etiqueta}
            className="grid size-10 shrink-0 place-items-center rounded-lg bg-ok-soft text-ok transition-[filter] hover:brightness-95">
        <Check className="size-4" aria-hidden="true"/>
    </button>
);

BotonValidar.propTypes = {
    onClick: PropTypes.func.isRequired,
    etiqueta: PropTypes.string.isRequired
};

const TicketForm = () => {

    const {llamadoActivo, setLlamadoActivo, llamados, esLlamadoNuevo, idLLamadoActiva, inventario} = useContext(UserContext);

    const {
        ticketFormData, setTicketFormData,
        ticket, setTicket,
        reporte, setReporte,
        derivacion, setDerivacion,
        setTicketExport,
        oficioForm, setOficioForm
    } = useContext(TicketContext);


    const navigate = useNavigate();

    const [correoExport, setCorreoExport] = useState("");
    const [maquinaExport, setMaquinaExport] = useState("");
    const [oficinaExport, setOficinaExport] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [formComponent, setFormComponent] = useState(null);

    const [lugar, setLugar] = useState("");
    const [derivacionAbierta, setDerivacionAbierta] = useState(false);


    const extraerCodigoMaquina = (cadena) => {
        const [, despues] = cadena.split("-");
        return despues || null;
    }

    const buscarMaquinaPorIP = (ip) => {
        return inventario.find(item => formTransform(item.ip) === formTransform(ip));
    }

    const buscarMaquinaPorMaquina = (maquina) => {
        return inventario.find(item => formTransform(item.nombre) === maquina)
    }

    const parseTicket = (formTicket) => {
        const defTipoEstacion =
            formTransform(formTicket.tipoMaquina) === "SI"
                ? "TIPO DE ESTACION: S/I"
                : "TIPO DE ESTACION: " + formTransform(formTicket.tipoMaquina);

        const sb = new StringBuilder(defTipoEstacion);

        const construirCorreo = () =>
            formTransform(formTicket.tipoCorreo) === "REGISTROCIVIL"
                ? formTransform(formTicket.correo) + "@REGISTROCIVIL.GOB.CL"
                : formTransform(formTicket.tipoCorreo) === "CONSULADO"
                    ? formTransform(formTicket.correo) + "@MINREL.GOB.CL"
                    : formTransform(formTicket.tipoCorreo) === "MINISTERIO"
                        ? formTransform(formTicket.correo) + "@MINREL.CL"
                        : formTransform(formTicket.tipoCorreo) === "SRCEI"
                            ? formTransform(formTicket.correo) + "@SRCEI.CL"
                            : formTransform(formTicket.correo);

        const construirMaquina = () =>
            formTransform(formTicket.tipoMaquina) === "SI"
                ? "S/I"
                : formTransform(formTicket.tipoMaquina) + "-" + formTransform(formTicket.maquina);

        const construirOficina = () =>
            formTransform(formTicket.tipoOficina) === "OFICINA"
                ? "SRCEI " + formTransform(traducirOficina(formTicket.oficina))
                : "CONSULADO " + formTransform(traducirOficina(formTicket.oficina));

        setCorreoExport(construirCorreo());
        setMaquinaExport(construirMaquina());
        setOficinaExport(construirOficina());

        sb.appendLine("NOMBRE DE MÁQUINA: " + construirMaquina());
        sb.appendLine("NOMBRE: " + formTransform(formTicket.nombre));
        sb.appendLine("CELULAR: " + formTransform(formTicket.celular));
        sb.appendLine("CORREO ELECTRONICO: " + construirCorreo());
        sb.appendLine("OFICINA: " + construirOficina());
        sb.appendLine("IP: " + formTransform(formTicket.ip));
        sb.appendLine("CUENTA USUARIO: " + formTransform(formTicket.cuentaUsuario));
        sb.appendLine("PROBLEMA_PRE-DIAGNOSTICO: " + formTransform(formTicket.problema));
        sb.appendLine("PRUEBA DE LA MESA: " + formTransform(formTicket.pruebasMesa));
        if (formTicket.grupoResolutor !== "n1") {
            sb.appendLine("DIRECCIÓN: " + formTransform(formTicket.direccion));
            sb.appendLine("HORARIO DE ATENCIÓN: " + formTransform(formTicket.horario));
        }

        return sb.toString();
    };

    const handleChange = (e) => {
        const {name,value,type,checked} = e.target;
        setTicketFormData({
            ...ticketFormData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Al elegir una sugerencia de la glosa se completan el problema y las pruebas de la mesa.
    const aplicarGlosa = (item) => {
        setTicketFormData((previo) => ({
            ...previo,
            problema: item.inconveniente,
            pruebasMesa: item.resolucion
        }));
    };

    const setExport = () => {
        setTicketExport(
            {
                nombre: formTransform(ticketFormData.nombre),
                correo: correoExport,
                estacion: maquinaExport,
                numero: formTransform(ticketFormData.celular),
                responsabilidad: formTransform(ticketFormData.responsabilidad),
                oficina: oficinaExport,
                derivacion: formTransform(derivacion),
                region: encontrarRegion(maquinaExport)
            }
        );
    }

    const buildAtencionActiva = () => {
        const resolucionPH = formTransform(derivacion);

        setLlamadoActivo(agregarAtencion({
            llamadoActivo, llamados, esLlamadoNuevo, idLLamadoActiva,
            oficina: formTransform(ticketFormData.oficina),
            atencion: {
                ticket: reporte,
                funcionario: formTransform(ticketFormData.nombre),
                resolucion: resolucionPH === "" ? "RESUELTO" : resolucionPH,
                responsabilidad: ticketFormData.responsabilidad
            }
        }));
    }

    const handleEnding = () => {
        if (ticketFormData.responsabilidad === "SI") {
            setExport();
            navigate("/baha-responsible");
        } else {
            setExport();
            buildAtencionActiva()
            navigate("/baha-assistance");
        }
    }

    const validarDesdeMaquina = () => {
        const maquina = (formTransform(ticketFormData.tipoMaquina) + "-" + formTransform(ticketFormData.maquina))
        const resultado = buscarMaquinaPorMaquina(maquina);

        setLugar(traducirOficina(resultado.ofi));
        setTicketFormData({...ticketFormData, ip: formTransform(resultado.ip) });
    }

    const validarDesdeIp = () => {
        const resultado = buscarMaquinaPorIP(ticketFormData.ip)

        const tipo = resultado.acronimo;
        const codigo = extraerCodigoMaquina(resultado.nombre);

        setLugar(traducirOficina(resultado.ofi));
        setTicketFormData({...ticketFormData, tipoMaquina: formTransform(tipo), maquina: formTransform(codigo)});
    }

    const encontrarRegion = (maquina) => {
        const estacion = inventario.find(item => formTransform(item.nombre) === maquina)
        if (isset(estacion)) {
            return limpiarRegion(estacion.region)
        } else {
            return "";
        }
    }

    const asignarOficina = () => {
        const maquina = buscarMaquinaPorIP(formTransform(ticketFormData.ip));
        setOficioForm({...oficioForm, codigoOficina: maquina.oficina});
    }

    const derivarTicket = (grupo) => {
        if (grupo === "n1") {
            setDerivacion("n1");
        }
        else if (grupo === "n2") {
            setDerivacion("n2");
            asignarOficina();
        } else {
            setDerivacion("n3");
        }
        // Los datos de derivación son obligatorios en N2 y N3: se muestran al elegirlos.
        if (grupo !== "n1") {
            setDerivacionAbierta(true);
        }
    }

    const handleFormModal = (titulo, componente) => {
        setTitle(titulo);
        setFormComponent(componente);
        setShowModal(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const tkt = parseTicket(ticketFormData);
        setTicket(tkt)
    };

    // Los efectos usan la forma funcional de setState para no pisarse entre sí:
    // todos corren en el mismo ciclo y con la forma normal el último descartaba los cambios de los demás.
    useEffect(() => {
        if (ticketFormData.tipoOficina === "CONSULADO") {
            setTicketFormData((previo) => ({...previo, tipoMaquina: "CON" }));
        }
    }, [ticketFormData.tipoOficina, setTicketFormData]);

    useEffect(() => {
        const tipoOficina = ticketFormData.tipoMaquina === "CON" ? "CONSULADO" : "OFICINA";
        setTicketFormData((previo) => ({...previo, tipoOficina }));
    }, [ticketFormData.tipoMaquina, setTicketFormData]);

    useEffect(() => {
        setTicketFormData((previo) => ({...previo, correo: "" }));
    }, [ticketFormData.tipoCorreo, setTicketFormData]);

    useEffect(() => {
        if (ticketFormData.tipoMaquina === "SI") {
            setTicketFormData((previo) => ({...previo, maquina: "S/I", ip: "S/I" }));
        }
    }, [ticketFormData.tipoMaquina, setTicketFormData]);

    const tipoMaquina = TIPOS_MAQUINA.find((t) => t.value === ticketFormData.tipoMaquina);
    const dominioCorreo = TIPOS_CORREO.find((t) => t.value === ticketFormData.tipoCorreo)?.dominio ?? "";
    const nombreMaquina = isValidString(ticketFormData.maquina) && formTransform(ticketFormData.tipoMaquina) !== "SI"
        ? formTransform(ticketFormData.tipoMaquina) + "-" + formTransform(ticketFormData.maquina)
        : "";

    // Si es responsabilidad del SRCeI no se pide reporte: el ticket se registra en el paso siguiente.
    const puedeContinuar = ticketFormData.responsabilidad === "SI" || Boolean(isValidString(reporte));

    return (
        <>
            <div className="grid items-start gap-6 xl:grid-cols-[1fr_420px]">
                <form id="ticketForm" onSubmit={handleSubmit} className="space-y-5">

                    <Panel className="p-6">
                        <PanelTitle title="Funcionario"/>
                        <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                            <Field label="Nombre" htmlFor="nombre">
                                <Input id="nombre" name="nombre" value={ticketFormData.nombre}
                                       onChange={handleChange} required/>
                            </Field>
                            <Field label="Celular" htmlFor="celular">
                                <Input id="celular" name="celular" type="tel" mono
                                       value={ticketFormData.celular} onChange={handleChange}/>
                            </Field>
                            <Field label="Oficina" htmlFor="oficina" className="sm:col-span-2"
                                   extra={<Segmented name="tipoOficina" small required options={TIPOS_OFICINA}
                                                     value={ticketFormData.tipoOficina} onChange={handleChange}/>}
                                   hint={<>Nombre de oficina: <span className="font-medium text-brand">{lugar ? lugar : "No disponible aún"}</span></>}>
                                <Input id="oficina" name="oficina" value={ticketFormData.oficina}
                                       onChange={handleChange} required/>
                            </Field>
                            <Field label="Cuenta de usuario" htmlFor="cuentaUsuario">
                                <Input id="cuentaUsuario" name="cuentaUsuario" mono
                                       value={ticketFormData.cuentaUsuario} onChange={handleChange} required/>
                            </Field>
                            <Field label="Problema" htmlFor="problema"
                                   hint="Busca en la glosa por código o palabra, por ejemplo DECA001 o deca.">
                                <ProblemaCombobox id="problema" name="problema" required
                                                  value={ticketFormData.problema} onChange={handleChange}
                                                  onSelect={aplicarGlosa}/>
                            </Field>
                        </div>
                    </Panel>

                    <Panel className="p-6">
                        <PanelTitle title="Equipo" subtitle="Valida con el inventario para completar la IP y el nombre de máquina."/>
                        <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                            <Field label="Tipo de máquina" className="sm:col-span-2"
                                   hint={tipoMaquina && tipoMaquina.title !== tipoMaquina.value
                                       ? `${tipoMaquina.label}: ${tipoMaquina.title.charAt(0).toLowerCase()}${tipoMaquina.title.slice(1)}`
                                       : undefined}>
                                <Segmented name="tipoMaquina" small required options={TIPOS_MAQUINA}
                                           value={ticketFormData.tipoMaquina} onChange={handleChange}/>
                            </Field>
                            <Field label="Código de máquina" htmlFor="maquina"
                                   hint={<>Nombre de máquina: <span className="font-medium text-brand">{nombreMaquina ? nombreMaquina : "No disponible aún"}</span></>}>
                                <div className="flex gap-2">
                                    <Input id="maquina" name="maquina" mono value={ticketFormData.maquina}
                                           onChange={handleChange} required/>
                                    <BotonValidar onClick={validarDesdeMaquina} etiqueta="Validar máquina con el inventario"/>
                                </div>
                            </Field>
                            <Field label="IP" htmlFor="ip">
                                <div className="flex gap-2">
                                    <Input id="ip" name="ip" mono value={ticketFormData.ip}
                                           onChange={handleChange} required/>
                                    <BotonValidar onClick={validarDesdeIp} etiqueta="Validar IP con el inventario"/>
                                </div>
                            </Field>
                        </div>
                    </Panel>

                    <Panel>
                        <button type="button" onClick={() => setDerivacionAbierta(!derivacionAbierta)}
                                aria-expanded={derivacionAbierta} aria-controls="datosDerivar"
                                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left">
                            <span>
                                <span className="block text-[17px] font-semibold tracking-tight">Datos para derivar</span>
                                <span className="block text-sm text-ink-3">Obligatorios en N2 y N3</span>
                            </span>
                            {derivacionAbierta
                                ? <ChevronUp className="size-5 text-ink-3" aria-hidden="true"/>
                                : <ChevronDown className="size-5 text-ink-3" aria-hidden="true"/>}
                        </button>
                        {derivacionAbierta && (
                            <div id="datosDerivar" className="grid items-end gap-x-5 gap-y-4 border-t border-line p-6 sm:grid-cols-2">
                                <Field label="Horario" htmlFor="horario"
                                       extra={<SegmentedButtons options={HORARIOS} value={ticketFormData.horario}
                                                                onSelect={(horario) => setTicketFormData({...ticketFormData, horario})}/>}>
                                    <Input id="horario" name="horario" mono value={ticketFormData.horario}
                                           onChange={handleChange} placeholder="Obligatorio N2 y N3"/>
                                </Field>
                                <Field label="Dirección" htmlFor="direccion">
                                    <Input id="direccion" name="direccion" mono value={ticketFormData.direccion}
                                           onChange={handleChange} placeholder="Obligatorio N3 y N2 SRCeI"/>
                                </Field>
                                <Field label="Correo electrónico" htmlFor="correoElectronico2" className="sm:col-span-2"
                                       extra={<Segmented name="tipoCorreo" small options={TIPOS_CORREO}
                                                         value={ticketFormData.tipoCorreo} onChange={handleChange}/>}>
                                    <div className="flex items-center gap-2">
                                        <Input id="correoElectronico2" name="correo" value={ticketFormData.correo}
                                               onChange={handleChange} placeholder="Obligatorio N2 y N3"/>
                                        {dominioCorreo && <span className="shrink-0 font-mono text-[13px] text-ink-3">{dominioCorreo}</span>}
                                    </div>
                                </Field>
                            </div>
                        )}
                    </Panel>

                    <Panel className="p-6">
                        <PanelTitle title="Resolución"/>
                        <div className="space-y-5">
                            <Field label="¿Es responsabilidad del SRCeI?">
                                <Segmented name="responsabilidad" required value={ticketFormData.responsabilidad}
                                           onChange={handleChange}
                                           options={[
                                               {value: "SI", label: "Sí"},
                                               {value: "NO", label: "No", onClick: () => setReporte("")}
                                           ]}/>
                            </Field>
                            <Field label="¿Cómo se resuelve?">
                                <Segmented name="grupoResolutor" required value={ticketFormData.grupoResolutor}
                                           onChange={handleChange}
                                           options={[
                                               {value: "n1", label: "Cerrado en N1", onClick: () => derivarTicket("n1")},
                                               {value: "n2", label: "Derivado a N2", onClick: () => derivarTicket("n2")},
                                               {value: "n3", label: "Derivado a N3", onClick: () => derivarTicket("n3")}
                                           ]}/>
                            </Field>
                            <Field label="Pruebas de la mesa" htmlFor="pruebasMesa">
                                <Textarea id="pruebasMesa" name="pruebasMesa" rows={3} className="min-h-[88px]"
                                          value={ticketFormData.pruebasMesa} onChange={handleChange} required/>
                            </Field>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button type="submit" icon={Sparkles}>Generar ticket</Button>
                        </div>
                    </Panel>
                </form>

                <div className="space-y-4 xl:sticky xl:top-6">
                    <TicketBody text={ticket} title="Ticket" sub="Puedes editarlo antes de copiar"
                                copyLabel="Copiar ticket" setter={setTicket} rows={15}
                                placeholder="El ticket aparece aquí cuando presionas Generar ticket."/>
                    {derivacion === "n2" && (
                        <Panel className="p-4">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <span className="text-sm font-medium text-ink-2">Acciones de N2</span>
                                <Chip tone="brand">Derivado a N2</Chip>
                            </div>
                            <div className="grid grid-cols-5 gap-2 text-center text-[12px] leading-4 text-ink-2">
                                {ACCIONES_N2.map(({icono: Icono, titulo, corto}) => (
                                    <button key={titulo} type="button" title={titulo}
                                            onClick={titulo === "Oficio"
                                                ? () => handleFormModal("Agregar oficio", <OficioModal cerrarModal={() => setShowModal(false)}/>)
                                                : undefined}
                                            className="flex flex-col items-center gap-1.5">
                                        <span className={`grid size-11 place-items-center rounded-xl border ${
                                            titulo === "Oficio"
                                                ? "border-brand/40 bg-brand-soft text-brand"
                                                : "border-line bg-surface-2 text-ink-2"}`}>
                                            <Icono className="size-5" aria-hidden="true"/>
                                        </span>
                                        {corto}
                                    </button>
                                ))}
                            </div>
                        </Panel>
                    )}
                    {ticketFormData.responsabilidad === "NO" &&
                        <ReportForm responsabilidad={ticketFormData.responsabilidad}/>
                    }
                    <Button icon={ArrowRight} full onClick={handleEnding} disabled={!puedeContinuar}>
                        Continuar
                    </Button>
                </div>
            </div>
            <FormModal show={showModal} setShow={setShowModal} formComponent={formComponent} title={title}/>
        </>
    );
};

export default TicketForm;
