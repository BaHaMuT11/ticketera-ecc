import {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/UserProvider.jsx";
import {TicketContext} from "../context/TicketProvider.jsx";
import {StringBuilder} from "../utilities/StringBuilder.js"
import TicketBody from "./generic/TicketBody.jsx";
import {formTransform, limpiarRegion, traducirOficina} from "../utilities/FormTransform.js";
import {isset, isValidString} from "../utilities/VariableUtils.js";
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


    const navigate = useNavigate();

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

        if (derivacion !== "") {
            sb.appendLine("CORREO ELECTRONICO: " + construirCorreo());
        }

        sb.appendLine("OFICINA: " + construirOficina());
        sb.appendLine("IP: " + formTransform(formTicket.ip));
        sb.appendLine("CUENTA USUARIO: " + formTransform(formTicket.cuentaUsuario));
        sb.appendLine("PROBLEMA_PRE-DIAGNOSTICO: " + formTransform(formTicket.problema));
        sb.appendLine("PRUEBA DE LA MESA: " + formTransform(formTicket.pruebasMesa));

        // Siempre visibles
        sb.appendLine("DIRECCIÓN: " + formTransform(formTicket.direccion));
        sb.appendLine("HORARIO DE ATENCIÓN: " + formTransform(formTicket.horario));

        return sb.toString();
    };

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
                oficina: oficinaExport,
                derivacion: formTransform(derivacion),
                region: encontrarRegion(maquinaExport)
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
        if (ticketFormData.tipoCorreo === "SI") {
            setTicketFormData({...ticketFormData, correo: "S/I" });
        } else {
            setTicketFormData({...ticketFormData, correo: "" });
        }
    }, [ticketFormData.tipoCorreo]);

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
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Cómo se resuelve?</label>
                                    <div>
                                        <input type="radio" className="form-check-input" name="grupoResolutor"
                                               id="resolutorN1"
                                               value="SI" checked={ticketFormData.grupoResolutor === "n1"}
                                               onChange={handleChange} onClick={()=>derivarTicket("n1")} required/>
                                        <label htmlFor="resolutorN1" className="form-check-label">Cerrado en N1</label>

                                        <input type="radio" className="form-check-input" name="grupoResolutor"
                                               id="resolutorN2"
                                               value="NO"
                                               checked={ticketFormData.grupoResolutor === "n2"}
                                               onChange={handleChange} onClick={()=>derivarTicket("n2")}  required/>
                                        <label htmlFor="resolutorN2" className="form-check-label">Derivado a N2</label>

                                        <input type="radio" className="form-check-input" name="grupoResolutor"
                                               id="resolutorN3"
                                               value="NO"
                                               checked={ticketFormData.grupoResolutor === "n3"}
                                               onChange={handleChange} onClick={()=>derivarTicket("n3")}  required/>
                                        <label htmlFor="resolutorN3" className="form-check-label">Derivado a N3</label>
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

                            <div className="d-flex justify-content-around">
                                <div className="resolver-d">
                                    <button type="submit" className="btn btn-success">Resolver</button>
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