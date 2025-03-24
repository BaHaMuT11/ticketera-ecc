import {useContext, useState} from "react";
import {UserContext} from "../context/UserProvider.jsx";
import {TicketContext} from "../context/TicketProvider.jsx";
import {StringBuilder} from "../utilities/StringBuilder.js"
import TicketBody from "./generic/TicketBody.jsx";
import {formTransform} from "../utilities/FormTransform.js";
import {isset} from "../utilities/Isset.js";
import {useNavigate} from "react-router";

const TicketForm = () => {

    const {userName} = useContext(UserContext);
    const {ticketFormData, setTicketFormData} = useContext(TicketContext);
    const {ticket, setTicket} = useContext(TicketContext);
    const {derivacion, setDerivacion} = useContext(TicketContext);
    const {setTicketExport} = useContext(TicketContext);

    const [n2Visibility, setN2Visibility] = useState(false);
    const [n3Visibility, setN3Visibility] = useState(false);

    const navigate = useNavigate();

    const [horario, setHorario] = useState(null);
    const [direccion, setDireccion] = useState(null);
    const [rotulo, setRotulo] = useState(null);
    const [fallaFisica, setFallaFisica] = useState("NO");

    const[correoExport, setCorreoExport] = useState("");
    const[maquinaExport, setMaquinaExport] = useState("");
    const[oficinaExport, setOficinaExport] = useState("");

    const parseTicket = (formTicket) => {

        const defTipoEstacion = "TIPO ESTACION: " + formTransform(formTicket.tipoMaquina);
        const sb = new StringBuilder(defTipoEstacion);

        const construirCorreo = () => (
            formTransform(formTicket.tipoCorreo) === "REGISTROCIVIL"  ? formTransform(formTicket.correoElectronico) + "@REGISTROCIVIL.GOB.CL" :
                formTransform(formTicket.tipoCorreo) === "CONSULADO" ? formTransform(formTicket.correoElectronico) + "@MINREL.GOB.CL" :
                    formTransform(formTicket.tipoCorreo) === "MINISTERIO" ? formTransform(formTicket.correoElectronico) + "@MINREL.CL" :
                        formTransform(formTicket.tipoCorreo) === "SRCEI" ? formTransform(formTicket.correoElectronico) + "@SRCEI.CL" :
                            formTransform(formTicket.correoElectronico));
        const construirMaquina = () => (formTransform(formTicket.tipoMaquina) + "-" + formTransform(formTicket.maquina));
        const construirOficina = () => (
            formTransform(formTicket.tipoOficina) === "OFICINA"  ? "SRCEI "
                + formTransform(formTicket.oficina) : "CONSULADO " + formTransform(formTicket.oficina));

        setCorreoExport(construirCorreo());
        setMaquinaExport(construirMaquina());
        setOficinaExport(construirOficina());

        sb.appendLine("NOMBRE MAQUINA: " + construirMaquina());
        sb.appendLine("NOMBRE: " + formTransform(formTicket.nombre));
        sb.appendLine("FONO FIJO: " + formTransform(formTicket.fonoFijo));
        sb.appendLine("CELULAR: " + formTransform(formTicket.celular));
        if (formTransform(formTicket.tipoOficina) !== "OFICINA") {
            sb.appendLine("WHATSAPP: " + formTransform(formTicket.whatsapp));
        }
        sb.appendLine("CORREO ELECTRONICO: " + construirCorreo());
        sb.appendLine("OFICINA: " + construirOficina());
        sb.appendLine("IP: " + formTransform(formTicket.ip));
        sb.appendLine("CUENTA DE USUARIO: " + formTransform(formTicket.cuentaUsuario));
        sb.appendLine("PROBLEMA_PRE-DIAGNOSTICO: " + formTransform(formTicket.problema));
        sb.appendLine("PRUEBAS DE LA MESA: " + formTransform(formTicket.pruebasMesa));

        if (derivacion === "n2") {
            if (isset(horario)) {
                sb.appendLine("DIAS Y HORARIO DE CHILE: " + formTransform(horario));
            }
        }

        if (derivacion === "n3") {
            sb.appendLine("FALLA FISICA HW: " + formTransform(fallaFisica));
            if (isset(direccion)) {
                sb.appendLine("DIRECCION: " + formTransform(direccion));
            }
            if (isset(horario)) {
                sb.appendLine("DIAS Y HORARIO DE OFICINA: " + formTransform(horario));
            }
            if (isset(rotulo)) {
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

    const setExport = () => {
        setTicketExport(
            {
                nombre: formTransform(ticketFormData.nombre),
                correo: correoExport,
                estacion: maquinaExport,
                numero: formTransform(ticketFormData.celular) + " - " + formTransform(ticketFormData.fonoFijo),
                responsabilidad: formTransform(ticketFormData.responsabilidad),
                oficina: oficinaExport
            }
        );
    }

    const handleEnding = () => {
        if (ticketFormData.responsabilidad === "SI") {
            setExport();
            navigate("/baha-responsible");
        } else {
            setExport();
            navigate("/baha-summary");
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const tkt = parseTicket(ticketFormData);
        setTicket(tkt)
    };

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
                                                   onChange={handleChange}/>
                                            <label className="btn btn-outline-primary btn-sm"
                                                   htmlFor="consuladoRadio">Consulado</label>
                                        </div>
                                    </label>
                                    <input type="text" className="form-control form-control-sm" id="oficina"
                                           name="oficina" value={ticketFormData.oficina} onChange={handleChange}
                                           required/>
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
                                    <label htmlFor="correoElectronico" className="form-label">Correo Electrónico
                                        <div className="btn-group ms-2" role="group">
                                            <input type="radio" className="btn-check" name="tipoCorreo"
                                                   id="registroCivilRadio"
                                                   value="REGISTROCIVIL"
                                                   checked={ticketFormData.tipoCorreo === "REGISTROCIVIL"}
                                                   onChange={handleChange} required/>
                                            <label className="btn btn-outline-primary btn-sm"
                                                   htmlFor="registroCivilRadio">Registro
                                                Civil</label>

                                            <input type="radio" className="btn-check" name="tipoCorreo"
                                                   id="consuladoInstRadio" value="CONSULADO"
                                                   checked={ticketFormData.tipoCorreo === "CONSULADO"}
                                                   onChange={handleChange}/>
                                            <label className="btn btn-outline-primary btn-sm"
                                                   htmlFor="consuladoInstRadio">Consulado</label>

                                            <input type="radio" className="btn-check" name="tipoCorreo"
                                                   id="ministerioRadio"
                                                   value="MINISTERIO"
                                                   checked={ticketFormData.tipoCorreo === "MINISTERIO"}
                                                   onChange={handleChange}
                                            />
                                            <label className="btn btn-outline-primary btn-sm"
                                                   htmlFor="ministerioRadio">Ministerio</label>

                                            <input type="radio" className="btn-check" name="tipoCorreo" id="srceiRadio"
                                                   value="SRCEI"
                                                   checked={ticketFormData.tipoCorreo === "SRCEI"}
                                                   onChange={handleChange}/>
                                            <label className="btn btn-outline-primary btn-sm"
                                                   htmlFor="srceiRadio">SRCEI</label>

                                            <input type="radio" className="btn-check" name="tipoCorreo" id="siRadio"
                                                   value="SI"
                                                   checked={ticketFormData.tipoCorreo === "SI"}
                                                   onChange={handleChange}/>
                                            <label className="btn btn-outline-primary btn-sm"
                                                   htmlFor="siRadio">S/I</label>
                                        </div>
                                    </label>
                                    <input type="text" className="form-control form-control-sm" id="correoElectronico"
                                           name="correoElectronico" value={ticketFormData.correoElectronico}
                                           onChange={handleChange} required/>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="fonoFijo" className="form-label">Fono Fijo</label>
                                    <input type="tel" className="form-control form-control-sm" id="fonoFijo"
                                           name="fonoFijo" value={ticketFormData.fonoFijo}
                                           onChange={handleChange}/>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="ip" className="form-label">IP</label>
                                    <input type="text" className="form-control form-control-sm" id="ip" name="ip"
                                           value={ticketFormData.ip} onChange={handleChange} required/>
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
                                                   onChange={handleChange} required/>
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
                                                   value="BOO" checked={ticketFormData.tipoMaquina === "BOO"}
                                                   onChange={handleChange}/>
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="booRadio"
                                                   title="Estación BackOffice Tradicional">BOO</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="pcvRadio"
                                                   value="PCV" checked={ticketFormData.tipoMaquina === "PCV"}
                                                   onChange={handleChange}/>
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="pcvRadio"
                                                   title="PC Video PV">PCV</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="totRadio"
                                                   value="TOT" checked={ticketFormData.tipoMaquina === "TOT"}
                                                   onChange={handleChange}/>
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="totRadio"
                                                   title="Totem Dispensador">TOT</label>
                                        </div>
                                    </label>
                                    <input type="text" className="form-control form-control-sm" id="maquina"
                                           name="maquina"
                                           value={ticketFormData.maquina} onChange={handleChange} required/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Es de responsabilidad del SRCeI?</label>
                                    <div>
                                        <input type="radio" className="form-check-input" name="responsabilidad"
                                               id="responsabilidadSi"
                                               value="SI" checked={ticketFormData.responsabilidad === "SI"}
                                               onChange={handleChange} required/>
                                        <label htmlFor="responsabilidadSi" className="form-check-label">Sí</label>
                                        <input type="radio" className="form-check-input" name="responsabilidad"
                                               id="responsabilidadNo"
                                               value="NO"
                                               checked={ticketFormData.responsabilidad === "NO"}
                                               onChange={handleChange} required/>
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
                                        </div>
                                    )
                                }
                            </div>

                            <div className="d-flex justify-content-around">
                                <button type="submit" className="btn btn-success" onClick={ () => setDerivacion("")}>Resolver sin derivar</button>
                                <button type="submit" className="btn btn-success">Resolver</button>
                                <button type="button" className="btn btn-warning" onClick={ () => {setN2Visibility(!n2Visibility); setN3Visibility(false); setRotulo(null); setDireccion(null); setDerivacion("n2");}}>N2 Adm</button>
                                <button type="button" className="btn btn-warning" onClick={ () => {setN3Visibility(!n3Visibility); setN2Visibility(false); setDerivacion("n3");}}>N3 CECOM</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
            <div className="col-md-12 mb-2">
                <TicketBody text={ticket} title={"TICKET"} setter={setTicket} rows={15} bootstrapColor="text-bg-primary"/>
            </div>
            <div className="col-md-12 mb-2">
                <button type="submit"
                        className="btn btn-outline-warning btn-primary btn-lg text-light w-100"
                        onClick={handleEnding}>
                    Continuar
                </button>
            </div>
        </>
    );
};

export default TicketForm;