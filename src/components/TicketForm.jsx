import {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/UserProvider.jsx";
import {TicketContext} from "../context/TicketProvider.jsx";
import {StringBuilder} from "../utilities/StringBuilder.js"
import TicketBody from "./generic/TicketBody.jsx";
import {formTransform} from "../utilities/FormTransform.js";
import {isValidString, variableUtils} from "../utilities/VariableUtils.js";
import {useNavigate} from "react-router";
import ReportForm from "./ReportForm.jsx";
import FormModal from "./generic/FormModal.jsx";
import OficioModal from "./modalForms/OficioModal.jsx";

const TicketForm = () => {

    const {userName} = useContext(UserContext);
    const {llamadoActivo, setLlamadoActivo} = useContext(UserContext);
    const {llamados} = useContext(UserContext);
    const {esLlamadoNuevo} = useContext(UserContext);
    const {idLLamadoActiva} = useContext(UserContext);
    const {inventario} = useContext(UserContext);

    const {ticketFormData, setTicketFormData} = useContext(TicketContext);
    const {ticket, setTicket} = useContext(TicketContext);
    const {reporte, setReporte} = useContext(TicketContext);
    const {derivacion, setDerivacion} = useContext(TicketContext);
    const {setTicketExport} = useContext(TicketContext);
    const {oficioForm, setOficioForm} = useContext(TicketContext);

    const [n2Visibility, setN2Visibility] = useState(false);
    const [n3Visibility, setN3Visibility] = useState(false);

    const navigate = useNavigate();

    const [horario, setHorario] = useState(null);
    const [direccion, setDireccion] = useState(null);
    const [rotulo, setRotulo] = useState(null);
    const [fallaFisica, setFallaFisica] = useState("NO");
    const [correo, setCorreo] = useState("");
    const [tipoCorreo, setTipoCorreo] = useState("REGISTROCIVIL");

    const [correoExport, setCorreoExport] = useState("");
    const [maquinaExport, setMaquinaExport] = useState("");
    const [oficinaExport, setOficinaExport] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [formComponent, setFormComponent] = useState(null);

    const [lugar, setLugar] = useState("");


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

        const defTipoEstacion = (formTransform(formTicket.tipoMaquina) === "SI" ? "TIPO DE ESTACION: S/I" : "TIPO DE ESTACION: " + formTransform(formTicket.tipoMaquina));
        const sb = new StringBuilder(defTipoEstacion);

        const construirCorreo = () => (
            formTransform(tipoCorreo) === "REGISTROCIVIL"  ? formTransform(correo) + "@REGISTROCIVIL.GOB.CL" :
                formTransform(tipoCorreo) === "CONSULADO" ? formTransform(correo) + "@MINREL.GOB.CL" :
                    formTransform(tipoCorreo) === "MINISTERIO" ? formTransform(correo) + "@MINREL.CL" :
                        formTransform(tipoCorreo) === "SRCEI" ? formTransform(correo) + "@SRCEI.CL" :
                            formTransform(correo));
        const construirMaquina = () => (formTransform(formTicket.tipoMaquina) === "SI" ? "S/I" :formTransform(formTicket.tipoMaquina) + "-" + formTransform(formTicket.maquina));
        const construirOficina = () => (
            formTransform(formTicket.tipoOficina) === "OFICINA"  ? ""
                + formTransform(formTicket.oficina) : "" + formTransform(formTicket.oficina));

        setCorreoExport(construirCorreo());
        setMaquinaExport(construirMaquina());
        setOficinaExport(construirOficina());

        sb.appendLine("NOMBRE DE MAQUINA: " + construirMaquina());
        sb.appendLine("NOMBRE: " + formTransform(formTicket.nombre));
        sb.appendLine("FONO FIJO: " + formTransform(formTicket.fonoFijo));
        sb.appendLine("CELULAR: " + formTransform(formTicket.celular));
        if (formTransform(formTicket.tipoOficina) !== "OFICINA") {
            sb.appendLine("WHATSAPP: " + formTransform(formTicket.whatsapp));
        }
        if (derivacion !== "") {
            sb.appendLine("CORREO ELECTRONICO: " + construirCorreo());
        }
        sb.appendLine("OFICINA: " + construirOficina());
        sb.appendLine("IP: " + formTransform(formTicket.ip));
        sb.appendLine("CUENTA DE USUARIO: " + formTransform(formTicket.cuentaUsuario));
        sb.appendLine("PROBLEMA_PRE-DIAGNOSTICO: " + formTransform(formTicket.problema));
        sb.appendLine("PRUEBAS DE LA MESA: " + formTransform(formTicket.pruebasMesa));

        if (derivacion === "n2") {
            if (variableUtils(horario)) {
                sb.appendLine("DIAS Y HORARIO DE CHILE: " + formTransform(horario));
            }
        }

        if (derivacion === "n3") {
            sb.appendLine("FALLA FISICA HW: " + formTransform(fallaFisica));
            if (variableUtils(direccion)) {
                sb.appendLine("DIRECCION: " + formTransform(direccion));
            }
            if (variableUtils(horario)) {
                sb.appendLine("DIAS Y HORARIO DE OFICINA: " + formTransform(horario));
            }
            if (variableUtils(rotulo)) {
                sb.appendLine("ROTULO: " + formTransform(rotulo));
            }
        }

        return sb.toString();
    }

    const handleChange = (e) => {
        const {name,value,type,checked} = e.target;
        setTicketFormData({
            ...ticketFormData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleChangeCE = (e) => {
        setTipoCorreo(e.target.value);
    };

    const setExport = () => {
        setTicketExport(
            {
                nombre: formTransform(ticketFormData.nombre),
                correo: correoExport,
                estacion: maquinaExport,
                numero: formTransform(ticketFormData.celular) + " - " + formTransform(ticketFormData.fonoFijo),
                responsabilidad: formTransform(ticketFormData.responsabilidad),
                oficina: oficinaExport,
                derivacion: formTransform(derivacion)
            }
        );
    }

    const buildAtencionActiva = () => {
        const resolucionPH = formTransform(derivacion);

        if (esLlamadoNuevo) {
            setLlamadoActivo({
                id: llamados.length+1,
                oficina: formTransform(ticketFormData.oficina),
                atenciones: [...llamadoActivo.atenciones, {
                    id: llamadoActivo.atenciones.length+1,
                    ticket: reporte,
                    funcionario: formTransform(ticketFormData.nombre),
                    resolucion: resolucionPH === "" ? "RESUELTO" : resolucionPH ,
                    responsabilidad: ticketFormData.responsabilidad,
                    fecha: new Date().toLocaleString("es-CL", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                    })
                }]
            })
        } else {
            setLlamadoActivo({
                id: idLLamadoActiva,
                oficina: formTransform(ticketFormData.oficina),
                atenciones: [...llamadoActivo.atenciones, {
                    id: llamadoActivo.atenciones.length+1,
                    ticket: reporte,
                    funcionario: formTransform(ticketFormData.nombre),
                    resolucion: resolucionPH === "" ? "RESUELTO" : resolucionPH ,
                    responsabilidad: ticketFormData.responsabilidad,
                    fecha: new Date().toLocaleString("es-CL", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                    })
                }]
            })
        }
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
        console.log(maquina);
        const resultado = buscarMaquinaPorMaquina(maquina);

        setLugar(resultado.ofi);
        setTicketFormData({...ticketFormData, ip: formTransform(resultado.ip) });
    }

    const validarDesdeIp = () => {
        const resultado = buscarMaquinaPorIP(ticketFormData.ip)

        const tipo = resultado.acronimo;
        const codigo = extraerCodigoMaquina(resultado.nombre);

        setLugar(resultado.ofi);
        setTicketFormData({...ticketFormData, tipoMaquina: formTransform(tipo), maquina: formTransform(codigo)});
    }

    const asignarOficina = () => {
        const maquina = buscarMaquinaPorIP(formTransform(ticketFormData.ip));
        setOficioForm({...oficioForm, codigoOficina: maquina.oficina});
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



    useEffect(() => {
        if (ticketFormData.tipoOficina === "CONSULADO") {
            setTicketFormData({...ticketFormData, tipoMaquina: "CON" });
        }
    }, [ticketFormData.tipoOficina]);

    useEffect(() => {
        if (ticketFormData.tipoMaquina === "CON") {
            setTicketFormData({...ticketFormData, tipoOficina: "CONSULADO" });
        } else {
            setTicketFormData({...ticketFormData, tipoOficina: "OFICINA" });
        }
    }, [ticketFormData.tipoMaquina]);

    useEffect(() => {
        if (tipoCorreo === "SI") {
            setCorreo("S/I");
        } else {
            setCorreo("")
        }
    }, [tipoCorreo]);

    useEffect(() => {
        if (ticketFormData.tipoMaquina === "SI") {
            setTicketFormData({...ticketFormData, maquina: "S/I", ip: "S/I" });
        }
    }, [ticketFormData.tipoMaquina]);

    return (
        <>
            <div className="col-md-12 mb-2">
                <div className="card">
                    <div className="card-header text-bg-primary">
                        <h5 className="mb-0">CREACIÓN DEL TICKET - {userName.nombre2}</h5>
                    </div>
                    <div className="card-body">
                        <form id="ticketForm" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="nombre" className="form-label">Nombre</label>
                                    <input type="text" className="form-control form-control-sm" id="nombre"
                                           name="nombre"
                                           value={ticketFormData.nombre} onChange={handleChange} required/>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="oficina" className="form-label">Oficina
                                        <div className="btn-group ms-2" role="group">
                                            <input type="radio" className="btn-check" name="tipoOficina"
                                                   id="oficinaRadio"
                                                   value="OFICINA" checked={ticketFormData.tipoOficina === "OFICINA"}
                                                   onChange={handleChange} required/>
                                            <label className="btn btn-outline-primary btn-sm"
                                                   htmlFor="oficinaRadio">Oficina</label>

                                            <input type="radio" className="btn-check" name="tipoOficina"
                                                   id="consuladoRadio"
                                                   value="CONSULADO"
                                                   checked={ticketFormData.tipoOficina === "CONSULADO"}
                                                   onChange={handleChange}
                                                    />
                                            <label className="btn btn-outline-primary btn-sm"
                                                   htmlFor="consuladoRadio">Consulado</label>
                                        </div>
                                    </label>
                                    <input type="text" className="form-control form-control-sm" id="oficina"
                                           name="oficina" value={ticketFormData.oficina} onChange={handleChange}
                                           required/>
                                    <p>Nombre de oficina: <span className="nombre-maquina"> { lugar ? lugar : "No disponible aún"}</span></p>
                                </div>

                                {
                                    ticketFormData.tipoOficina !== "OFICINA" &&
                                    (
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="whatsapp" className="form-label">Whatsapp</label>
                                            <input type="text" className="form-control form-control-sm" id="whatsapp"
                                                   name="whatsapp" value={ticketFormData.whatsapp}
                                                   onChange={handleChange}
                                            />
                                        </div>
                                    )
                                }
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="problema" className="form-label">Problema</label>
                                    <input type="text" className="form-control form-control-sm" id="problema"
                                           name="problema" value={ticketFormData.problema} onChange={handleChange}
                                           required/>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="celular" className="form-label">Celular</label>
                                    <input type="tel" className="form-control form-control-sm" id="celular"
                                           name="celular"
                                           value={ticketFormData.celular} onChange={handleChange}/>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="fonoFijo" className="form-label">Fono Fijo</label>
                                    <input type="tel" className="form-control form-control-sm" id="fonoFijo"
                                           name="fonoFijo" value={ticketFormData.fonoFijo}
                                           onChange={handleChange}/>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="ip" className="form-label">IP</label>
                                    <div className="d-flex">
                                        <input type="text" className="form-control form-control-sm" id="ip" name="ip"
                                               value={ticketFormData.ip} onChange={handleChange} required/> &nbsp;
                                        <button className="boton-verde-sm" type="button" onClick={validarDesdeIp} >
                                            <i className="bi bi-check-lg"></i>
                                        </button>
                                    </div>
                                </div>

                            </div>

                            <div className="row mb-2">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="cuentaUsuario" className="form-label">Cuenta de Usuario</label>
                                    <input type="text" className="form-control form-control-sm" id="cuentaUsuario"
                                           name="cuentaUsuario" value={ticketFormData.cuentaUsuario}
                                           onChange={handleChange} required/>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="maquina" className="form-label">Máquina
                                        <div className="btn-group ms-2" role="group">
                                            <input type="radio" className="btn-check" name="tipoMaquina" id="etfRadio"
                                                   value="ETF" checked={ticketFormData.tipoMaquina === "ETF"}
                                                   onChange={handleChange} required/>
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="etfRadio"
                                                   title="Estación todas las funciones">ETF</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="conRadio"
                                                   value="CON" checked={ticketFormData.tipoMaquina === "CON"}
                                                   onChange={handleChange}
                                                   required />
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="conRadio"
                                                   title="Consulados">CON</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="eenRadio"
                                                   value="EEN" checked={ticketFormData.tipoMaquina === "EEN"}
                                                   onChange={handleChange} required/>
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="eenRadio"
                                                   title="Estación de entrega">EEN</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="eclRadio"
                                                   value="ECL" checked={ticketFormData.tipoMaquina === "ECL"}
                                                   onChange={handleChange}/>
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="eclRadio"
                                                   title="Estación de captura">ECL</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="terRadio"
                                                   value="TER" checked={ticketFormData.tipoMaquina === "TER"}
                                                   onChange={handleChange}/>
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="terRadio"
                                                   title="Maleta">TER</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="bocRadio"
                                                   value="BOC" checked={ticketFormData.tipoMaquina === "BOC"}
                                                   onChange={handleChange}/>
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="bocRadio"
                                                   title="Estación de Backoffice Central">BOC</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="booRadio"
                                                   value="EBO" checked={ticketFormData.tipoMaquina === "EBO"}
                                                   onChange={handleChange}/>
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="booRadio"
                                                   title="Estación BackOffice Tradicional">EBO</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="tabRadio"
                                                   value="TAB" checked={ticketFormData.tipoMaquina === "TAB"}
                                                   onChange={handleChange}/>
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="tabRadio"
                                                   title="Tablet">TAB</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="pcvRadio"
                                                   value="TEC" checked={ticketFormData.tipoMaquina === "TEC"}
                                                   onChange={handleChange}/>
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="pcvRadio"
                                                   title="TEC">TEC</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="totRadio"
                                                   value="TEM" checked={ticketFormData.tipoMaquina === "TEM"}
                                                   onChange={handleChange}/>
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="totRadio"
                                                   title="TEM">TEM</label>
                                            <input type="radio" className="btn-check" name="tipoMaquina" id="sinRadio"
                                                   value="SI" checked={ticketFormData.tipoMaquina === "SI"}
                                                   onChange={handleChange}/>
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="sinRadio"
                                                   title="Sin información">S/I</label>
                                        </div>
                                    </label>
                                    <div className="d-flex">
                                        <input type="text" className="form-control form-control-sm" id="maquina"
                                               name="maquina"
                                               value={ticketFormData.maquina} onChange={handleChange} required/> &nbsp;
                                        <button className="boton-verde-sm" type="button" onClick={validarDesdeMaquina}>
                                            <i className="bi bi-check-lg"></i>
                                        </button>
                                    </div>
                                    <p>Nombre de máquina: <span className="nombre-maquina">{ isValidString(ticketFormData.maquina) && formTransform(ticketFormData.tipoMaquina) !== "SI" ? (formTransform(ticketFormData.tipoMaquina) + "-" + formTransform(ticketFormData.maquina)): "No disponible aún"}</span></p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Es de responsabilidad del SRCeI?</label>
                                    <div>
                                        <input type="radio" className="form-check-input" name="responsabilidad"
                                               id="responsabilidadSi"
                                               value="SI" checked={ticketFormData.responsabilidad === "SI"}
                                               onChange={handleChange} onClick={()=>setReporte("x")} required/>
                                        <label htmlFor="responsabilidadSi" className="form-check-label">Sí</label>
                                        <input type="radio" className="form-check-input" name="responsabilidad"
                                               id="responsabilidadNo"
                                               value="NO"
                                               checked={ticketFormData.responsabilidad === "NO"}
                                               onChange={handleChange} onClick={()=>setReporte("")}  required/>
                                        <label htmlFor="responsabilidadNo" className="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>


                            <div className="mb-3">
                                <label htmlFor="pruebasMesa" className="form-label">Pruebas de la Mesa</label>
                                <textarea className="form-control form-control-sm" id="pruebasMesa" name="pruebasMesa"
                                          rows="3"
                                          value={ticketFormData.pruebasMesa}
                                          onChange={handleChange} required/>
                            </div>

                            <div className="gestion-derivaciones">
                                {
                                    n2Visibility &&
                                    (
                                        <div className="n2">
                                            <div className="mb-3 n2">
                                                <label htmlFor="horario" className="form-label d-flex align-items-center">
                                                    Horario
                                                    <div className="btn-group btn-group-sm ms-2" role="group">
                                                        <input type="radio" className="btn-check" name="horarioRadio"
                                                               id="horarioLaJ_V" autoComplete="off" onClick={ ()=>setHorario("LUNES A JUEVES 8:30 - 1 , VIERNES HASTA LAS 1")} />
                                                        <label className="btn btn-outline-primary"
                                                               htmlFor="horarioLaJ_V">LaJ+V</label>

                                                        <input type="radio" className="btn-check" name="horarioRadio"
                                                               id="horarioLaV" autoComplete="off" onClick={ ()=>setHorario("LUNES A VIERNES 8:30 - 1")}  />
                                                        <label className="btn btn-outline-primary"
                                                               htmlFor="horarioLaV">LaV</label>
                                                    </div>
                                                </label>
                                                <input type="text" className="form-control form-control-sm mt-1" id="horario"
                                                       name="horario" value={horario} onChange={(e) => setHorario(e.target.value)} required/>
                                                <div className="col-md-6 mb-3 mt-3">
                                                    <label htmlFor="correoElectronico" className="form-label">Correo Electrónico
                                                        <div className="btn-group ms-2" role="group">
                                                            <input type="radio" className="btn-check" name="tipoCorreo"
                                                                   id="registroCivilRadio"
                                                                   value="REGISTROCIVIL"
                                                                   checked={tipoCorreo === "REGISTROCIVIL"}
                                                                   onChange={handleChangeCE} required/>
                                                            <label className="btn btn-outline-primary btn-sm"
                                                                   htmlFor="registroCivilRadio">Registro
                                                                Civil</label>

                                                            <input type="radio" className="btn-check" name="tipoCorreo"
                                                                   id="consuladoInstRadio" value="CONSULADO"
                                                                   checked={tipoCorreo === "CONSULADO"}
                                                                   onChange={handleChangeCE}/>
                                                            <label className="btn btn-outline-primary btn-sm"
                                                                   htmlFor="consuladoInstRadio">Consulado</label>

                                                            <input type="radio" className="btn-check" name="tipoCorreo"
                                                                   id="ministerioRadio"
                                                                   value="MINISTERIO"
                                                                   checked={tipoCorreo === "MINISTERIO"}
                                                                   onChange={handleChangeCE}
                                                            />
                                                            <label className="btn btn-outline-primary btn-sm"
                                                                   htmlFor="ministerioRadio">Ministerio</label>

                                                            <input type="radio" className="btn-check" name="tipoCorreo" id="srceiRadio"
                                                                   value="SRCEI"
                                                                   checked={tipoCorreo === "SRCEI"}
                                                                   onChange={handleChangeCE}/>
                                                            <label className="btn btn-outline-primary btn-sm"
                                                                   htmlFor="srceiRadio">SRCEI</label>

                                                            <input type="radio" className="btn-check" name="tipoCorreo" id="siRadio"
                                                                   value="SI"
                                                                   checked={tipoCorreo === "SI"}
                                                                   onChange={handleChangeCE} />
                                                            <label className="btn btn-outline-primary btn-sm"
                                                                   htmlFor="siRadio">S/I</label>
                                                        </div>
                                                    </label>
                                                    <input type="text" className="form-control form-control-sm" id="correoElectronico"
                                                           name="correoElectronico" value={correo} onChange={ (e) => setCorreo(e.target.value)} r/>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    n3Visibility &&
                                    (
                                        <div className="n3">
                                            <div className="mb-3 n3">
                                                <label htmlFor="horario" className="form-label d-flex align-items-center">
                                                    Horario
                                                    <div className="btn-group btn-group-sm ms-2" role="group">
                                                        <input type="radio" className="btn-check" name="horarioRadio"
                                                               id="horarioLaJ_V" autoComplete="off" onClick={ ()=>setHorario("LUNES A JUEVES 8:30 - 1 , VIERNES HASTA LAS 1")} />
                                                        <label className="btn btn-outline-primary"
                                                               htmlFor="horarioLaJ_V">LaJ+V</label>

                                                        <input type="radio" className="btn-check" name="horarioRadio"
                                                               id="horarioLaV" autoComplete="off" onClick={ ()=>setHorario("LUNES A VIERNES 8:30 - 1")} />
                                                        <label className="btn btn-outline-primary"
                                                               htmlFor="horarioLaV">LaV</label>
                                                    </div>
                                                </label>
                                                <input type="text" className="form-control form-control-sm mt-1" id="horario"
                                                       name="horario" value={horario} onChange={ (e) => setHorario(e.target.value)} required/>
                                            </div>
                                            <div className="mb-3 n3">
                                                <label htmlFor="direccion" className="form-label">Dirección</label>
                                                <input type="text" className="form-control form-control-sm" id="direccion"
                                                       name="direccion" value={direccion} onChange={ (e) => setDireccion(e.target.value)} required/>

                                            </div>
                                            <div className="mb-3 n3">
                                                <label htmlFor="rotulo" className="form-label">Rótulo</label>
                                                <input type="text" className="form-control form-control-sm" id="rotulo"
                                                       name="rotulo" value={rotulo} onChange={ (e) => setRotulo(e.target.value)} />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Falla Física</label>
                                                <div>
                                                    <input type="radio" className="form-check-input" name="fallaFisica"
                                                           id="fallaFisicaSi" value="SI"
                                                           checked={fallaFisica === "SI"}
                                                           onChange={() => setFallaFisica("SI")} required/>
                                                    <label htmlFor="fallaFisicaSi" className="form-check-label">Sí</label>
                                                    <input type="radio" className="form-check-input" name="fallaFisica"
                                                           id="fallaFisicaNo" value="NO"
                                                           checked={fallaFisica === "NO"}
                                                           onChange={() => setFallaFisica("NO")} />
                                                    <label htmlFor="fallaFisicaNo" className="form-check-label">No</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-3 mt-3">
                                                <label className="form-label" htmlFor="correoElectronico2">
                                                    Correo Electrónico
                                                </label>

                                                <div className="btn-group ms-2 mb-2" role="group">
                                                    <input
                                                        type="radio"
                                                        className="btn-check"
                                                        name="tipoCorreo2"
                                                        id="registroCivilRadio2"
                                                        value="REGISTROCIVIL"
                                                        checked={tipoCorreo === "REGISTROCIVIL"}
                                                        onChange={handleChangeCE}
                                                        required
                                                    />
                                                    <label
                                                        className="btn btn-outline-primary btn-sm"
                                                        htmlFor="registroCivilRadio2"
                                                    >
                                                        Registro Civil
                                                    </label>

                                                    <input
                                                        type="radio"
                                                        className="btn-check"
                                                        name="tipoCorreo2"
                                                        id="consuladoInstRadio2"
                                                        value="CONSULADO"
                                                        checked={tipoCorreo === "CONSULADO"}
                                                        onChange={handleChangeCE}
                                                    />
                                                    <label
                                                        className="btn btn-outline-primary btn-sm"
                                                        htmlFor="consuladoInstRadio2"
                                                    >
                                                        Consulado
                                                    </label>

                                                    <input
                                                        type="radio"
                                                        className="btn-check"
                                                        name="tipoCorreo2"
                                                        id="ministerioRadio2"
                                                        value="MINISTERIO"
                                                        checked={tipoCorreo === "MINISTERIO"}
                                                        onChange={handleChangeCE}
                                                    />
                                                    <label
                                                        className="btn btn-outline-primary btn-sm"
                                                        htmlFor="ministerioRadio2"
                                                    >
                                                        Ministerio
                                                    </label>

                                                    <input
                                                        type="radio"
                                                        className="btn-check"
                                                        name="tipoCorreo2"
                                                        id="srceiRadio2"
                                                        value="SRCEI"
                                                        checked={tipoCorreo === "SRCEI"}
                                                        onChange={handleChangeCE}
                                                    />
                                                    <label
                                                        className="btn btn-outline-primary btn-sm"
                                                        htmlFor="srceiRadio2"
                                                    >
                                                        SRCEI
                                                    </label>

                                                    <input
                                                        type="radio"
                                                        className="btn-check"
                                                        name="tipoCorreo2"
                                                        id="siRadio2"
                                                        value="SI"
                                                        checked={tipoCorreo === "SI"}
                                                        onChange={handleChangeCE}
                                                    />
                                                    <label className="btn btn-outline-primary btn-sm" htmlFor="siRadio2">
                                                        S/I
                                                    </label>
                                                </div>

                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    id="correoElectronico2"
                                                    name="correoElectronico2"
                                                    value={correo}
                                                    onChange={(e) => setCorreo(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )
                                }
                            </div>

                            <div className="d-flex justify-content-around">
                                <div className="resolver-sd">
                                    <button type="submit" className="btn btn-success" onClick={ () => {setDerivacion(""); setN2Visibility(false); setN3Visibility(false)}}>Resolver sin derivar</button>
                                </div>
                                <div className="resolver-d">
                                    <button type="submit" className="btn btn-success">Resolver</button> &nbsp; &nbsp;
                                    <button type="button" className="btn btn-warning" onClick={ () => {setN2Visibility(!n2Visibility); setN3Visibility(false); setRotulo(null); setDireccion(null); setDerivacion("n2"); asignarOficina();}}>N2 Adm</button> &nbsp; &nbsp;
                                    <button type="button" className="btn btn-warning" onClick={ () => {setN3Visibility(!n3Visibility); setN2Visibility(false); setDerivacion("n3");}}>N3 CECOM</button>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
            <div className="col-md-12 mb-2">
                <TicketBody text={ticket} title={"TICKET"} setter={setTicket} rows={15} bootstrapColor="text-bg-primary"/>
            </div>
            <div className="col-md-12 mb-2">
                {
                    derivacion === "n2" ?
                        <div className="d-flex justify-content-center gap-3 flex-wrap">
                            <button type="button" className="btn btn-outline-primary btn-round" title="Oficio"
                                    onClick={() => handleFormModal("Agregar oficio",
                                        <OficioModal cerrarModal={ () => setShowModal(false)} />)}>
                                <i className="bi bi-file-earmark-text"></i>
                            </button>
                            <button type="button" className="btn btn-outline-warning btn-round" title="Oficio Corregido">
                                <i className="bi bi-pencil-square"></i>
                            </button>
                            <button type="button" className="btn btn-outline-success btn-round" title="Término de Tarea">
                                <i className="bi bi-check-circle"></i>
                            </button>
                            <button type="button" className="btn btn-outline-info btn-round" title="Despachar Solicitud">
                                <i className="bi bi-send"></i>
                            </button>
                            <button type="button" className="btn btn-outline-dark btn-round" title="Cuadratura de Caja">
                                <i className="bi bi-cash-stack"></i>
                            </button>
                        </div>
                        :
                        <></>
                }
            </div>
            <div className="col-md-12 mb-2">
                {
                    ticketFormData.responsabilidad === "NO" &&
                    <ReportForm responsabilidad={ticketFormData.responsabilidad}/>
                }

            </div>
            <div className="col-md-12 mb-2">
                {
                    isValidString(reporte) ?
                        <button type="submit"
                                className="btn btn-primary btn-lg text-light w-100"
                                onClick={handleEnding}>
                            Continuar
                        </button> :
                        <button type="submit"
                                className="btn btn-primary btn-lg text-light w-100"
                                onClick={handleEnding} disabled>
                            Continuar
                        </button>
                }
            </div>
            <FormModal show={showModal} setShow={setShowModal} formComponent={formComponent} title={title}/>
        </>
    );
};

export default TicketForm;