import {useContext} from "react";
import {UserContext} from "../context/UserProvider.jsx";
import {TicketContext} from "../context/TicketProvider.jsx";
import {StringBuilder} from "../utilities/StringBuilder.js"
import TicketBody from "./generic/TicketBody.jsx";
import {formTransform} from "../utilities/FormTransform.js";

const TicketForm = () => {

    const {userName} = useContext(UserContext);
    const {ticketFormData, setTicketFormData} = useContext(TicketContext);
    const {setTicket} = useContext(TicketContext);

    const parseTicket = (formTicket) => {
        const defTipoEstacion = "TIPO ESTACIÓN: " + formTransform(formTicket.tipoMaquina);
        const sb = new StringBuilder(defTipoEstacion);
        sb.appendLine("NOMBRE MAQUINA: " + formTransform(formTicket.tipoMaquina) + "-" + formTransform(formTicket.maquina))
        return sb.toString();
    }

    const handleChange = (e) => {
        const {name,value,type,checked} = e.target;
        setTicketFormData({
            ...ticketFormData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const ticket = parseTicket(ticketFormData);
        setTicket(ticket)
    };

    return (
        <>
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header text-bg-primary">
                        <h5 className="mb-0">CREACIÓN DEL TICKET - {userName.nombre2}</h5>
                    </div>
                    <div className="card-body">
                        <form id="ticketForm" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="nombre" className="form-label">Nombre</label>
                                    <input type="text" className="form-control form-control-sm" id="nombre" name="nombre"
                                           value={ticketFormData.nombre} onChange={handleChange} required/>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="oficina" className="form-label">Oficina
                                        <div className="btn-group ms-2" role="group">
                                            <input type="radio" className="btn-check" name="tipoOficina" id="oficinaRadio"
                                                   value="OFICINA" checked={ticketFormData.tipoOficina === "OFICINA"}
                                                   onChange={handleChange} required/>
                                            <label className="btn btn-outline-primary btn-sm"
                                                   htmlFor="oficinaRadio">Oficina</label>

                                            <input type="radio" className="btn-check" name="tipoOficina" id="consuladoRadio"
                                                   value="CONSULADO" checked={ticketFormData.tipoOficina === "CONSULADO"}
                                                   onChange={handleChange}  />
                                            <label className="btn btn-outline-primary btn-sm"
                                                   htmlFor="consuladoRadio">Consulado</label>
                                        </div>
                                    </label>
                                    <input type="text" className="form-control form-control-sm" id="oficina"
                                           name="oficina" value={ticketFormData.oficina} onChange={handleChange} required/>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="problema" className="form-label">Problema</label>
                                    <input type="text" className="form-control form-control-sm" id="problema"
                                           name="problema" value={ticketFormData.problema} onChange={handleChange}
                                           required/>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="correoElectronico" className="form-label">Correo Electrónico
                                        <div className="btn-group ms-2" role="group">
                                            <input type="radio" className="btn-check" name="tipoCorreo"
                                                   id="registroCivilRadio"
                                                   value="REGISTROCIVIL"
                                                   checked={ticketFormData.tipoCorreo === "REGISTROCIVIL"}
                                                   onChange={handleChange} required />
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="registroCivilRadio">Registro
                                                Civil</label>

                                            <input type="radio" className="btn-check" name="tipoCorreo"
                                                   id="consuladoInstRadio" value="CONSULADO"
                                                   checked={ticketFormData.tipoCorreo === "CONSULADO"}
                                                   onChange={handleChange} />
                                            <label className="btn btn-outline-primary btn-sm"
                                                   htmlFor="consuladoInstRadio">Consulado</label>

                                            <input type="radio" className="btn-check" name="tipoCorreo" id="ministerioRadio"
                                                   value="MINISTERIO"
                                                   checked={ticketFormData.tipoCorreo === "MINISTERIO"}
                                                   onChange={handleChange}
                                            />
                                            <label className="btn btn-outline-primary btn-sm"
                                                   htmlFor="ministerioRadio">Ministerio</label>

                                            <input type="radio" className="btn-check" name="tipoCorreo" id="srceiRadio"
                                                   value="SRCEI"
                                                   checked={ticketFormData.tipoCorreo === "SRCEI"}
                                                   onChange={handleChange} />
                                            <label className="btn btn-outline-primary btn-sm"
                                                   htmlFor="srceiRadio">SRCEI</label>

                                            <input type="radio" className="btn-check" name="tipoCorreo" id="siRadio"
                                                   value="SI"
                                                   checked={ticketFormData.tipoCorreo === "SI"}
                                                   onChange={handleChange}/>
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="siRadio">S/I</label>
                                        </div>
                                    </label>
                                    <input type="email" className="form-control form-control-sm" id="correoElectronico"
                                           name="correoElectronico" value={ticketFormData.correoElectronico}
                                           onChange={handleChange} required/>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="celular" className="form-label">Celular</label>
                                    <input type="tel" className="form-control form-control-sm" id="celular" name="celular"
                                           value={ticketFormData.celular} onChange={handleChange} required/>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="fonoFijo" className="form-label">Fono Fijo</label>
                                    <input type="tel" className="form-control form-control-sm" id="fonoFijo"
                                           name="fonoFijo" value={ticketFormData.fonoFijo}
                                           onChange={handleChange} required />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="ip" className="form-label">IP</label>
                                    <input type="text" className="form-control form-control-sm" id="ip" name="ip"
                                           value={ticketFormData.ip} onChange={handleChange} required/>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="cuentaUsuario" className="form-label">Cuenta de Usuario</label>
                                    <input type="text" className="form-control form-control-sm" id="cuentaUsuario"
                                           name="cuentaUsuario" value={ticketFormData.cuentaUsuario}
                                           onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="row mb-2">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="maquina" className="form-label">Máquina
                                        <div className="btn-group ms-2" role="group">
                                            <input type="radio" className="btn-check" name="tipoMaquina" id="etfRadio"
                                                   value="ETF" checked={ticketFormData.tipoMaquina === "ETF"}
                                                   onChange={handleChange} required />
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="etfRadio"
                                                   title="Estación todas las funciones">ETF</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="conRadio"
                                                   value="CON" checked={ticketFormData.tipoMaquina === "CON"}
                                                   onChange={handleChange} required />
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="conRadio"
                                                   title="Consulados">CON</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="eenRadio"
                                                   value="EEN" checked={ticketFormData.tipoMaquina === "EEN"}
                                                   onChange={handleChange} required />
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="eenRadio"
                                                   title="Estación de entrega">EEN</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="eclRadio"
                                                   value="ECL" checked={ticketFormData.tipoMaquina === "ECL"}
                                                   onChange={handleChange} />
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="eclRadio"
                                                   title="Estación de captura">ECL</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="terRadio"
                                                   value="TER" checked={ticketFormData.tipoMaquina === "TER"}
                                                   onChange={handleChange} />
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="terRadio"
                                                   title="Maleta">TER</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="bocRadio"
                                                   value="BOC" checked={ticketFormData.tipoMaquina === "BOC"}
                                                   onChange={handleChange} />
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="bocRadio"
                                                   title="Estación de Backoffice Central">BOC</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="booRadio"
                                                   value="BOO" checked={ticketFormData.tipoMaquina === "BOO"}
                                                   onChange={handleChange} />
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="booRadio"
                                                   title="Estación BackOffice Tradicional">BOO</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="pcvRadio"
                                                   value="PCV" checked={ticketFormData.tipoMaquina === "PCV"}
                                                   onChange={handleChange} />
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="pcvRadio"
                                                   title="PC Video PV">PCV</label>

                                            <input type="radio" className="btn-check" name="tipoMaquina" id="totRadio"
                                                   value="TOT" checked={ticketFormData.tipoMaquina === "TOT"}
                                                   onChange={handleChange} />
                                            <label className="btn btn-outline-primary btn-sm" htmlFor="totRadio"
                                                   title="Totem Dispensador">TOT</label>
                                        </div>
                                    </label>
                                    <input type="text" className="form-control form-control-sm" id="maquina" name="maquina"
                                           value={ticketFormData.maquina} onChange={handleChange} required/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Es de responsabilidad del SRCeI?</label>
                                    <div>
                                        <input type="radio" className="form-check-input" name="responsabilidad"
                                               id="responsabilidadSi"
                                               value="SI" checked={ticketFormData.responsabilidad === "SI"}
                                               onChange={handleChange} required />
                                        <label htmlFor="responsabilidadSi" className="form-check-label">Sí</label>
                                        <input type="radio" className="form-check-input" name="responsabilidad"
                                               id="responsabilidadNo"
                                               value="NO"
                                               checked={ticketFormData.responsabilidad === "NO"}
                                               onChange={handleChange} required />
                                        <label htmlFor="responsabilidadNo" className="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Remoto</label>
                                    <div>
                                        <input type="radio" className="form-check-input" name="remoto" id="remotoSi"
                                               value="SI" checked={ticketFormData.remoto === "SI"}
                                               onChange={handleChange} required />
                                        <label htmlFor="remotoSi" className="form-check-label">Sí</label>
                                        <input type="radio" className="form-check-input" name="remoto" id="remotoNo"
                                               value="NO" checked={ticketFormData.remoto === "NO"}
                                               onChange={handleChange} />
                                        <label htmlFor="remotoNo" className="form-check-label">No</label>
                                    </div>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Mantención Preventiva</label>
                                    <div>
                                        <input type="radio" className="form-check-input" name="mantenimiento"
                                               id="mantenimientoSi" value="SI"
                                               checked={ticketFormData.mantenimiento === "SI"}
                                               onChange={handleChange} required />
                                        <label htmlFor="mantenimientoSi" className="form-check-label">Sí</label>
                                        <input type="radio" className="form-check-input" name="mantenimiento"
                                               id="mantenimientoNo" value="NO"
                                               checked={ticketFormData.mantenimiento === "NO"}
                                               onChange={handleChange}  />
                                        <label htmlFor="mantenimientoNo" className="form-check-label">No</label>
                                    </div>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Falla Física</label>
                                    <div>
                                        <input type="radio" className="form-check-input" name="fallaFisica"
                                               id="fallaFisicaSi" value="SI"
                                               checked={ticketFormData.fallaFisica === "SI"}
                                               onChange={handleChange} required />
                                        <label htmlFor="fallaFisicaSi" className="form-check-label">Sí</label>
                                        <input type="radio" className="form-check-input" name="fallaFisica"
                                               id="fallaFisicaNo" value="NO"
                                               checked={ticketFormData.fallaFisica === "NO"}
                                               onChange={handleChange}  />
                                        <label htmlFor="fallaFisicaNo" className="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="pruebasMesa" className="form-label">Pruebas de la Mesa</label>
                                <textarea className="form-control form-control-sm" id="pruebasMesa" name="pruebasMesa"
                                          rows="3"
                                          value={ticketFormData.pruebasMesa}
                                          onChange={handleChange} required  />
                            </div>

                            <div className="d-flex justify-content-around">
                                <button type="submit" className="btn btn-success">Resolver</button>
                                <button type="submit" className="btn btn-success">N2 Adm</button>
                                <button type="submit" className="btn btn-success">N3 CECOM</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-md-12">
                <TicketBody />
            </div>
        </>
    );
};

export default TicketForm;