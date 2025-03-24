import {useContext} from "react";
import {ResposibilityContext} from "../context/ResponsibilityProvider.jsx";
import TicketBody from "./generic/TicketBody.jsx";
import {formTransform} from "../utilities/FormTransform.js";
import {StringBuilder} from "../utilities/StringBuilder.js";
import {UserContext} from "../context/UserProvider.jsx";
import {TicketContext} from "../context/TicketProvider.jsx";

const SrceiForm = () => {

    const {userName} = useContext(UserContext);

    const {srceiFormData, setSrceiFormData} = useContext(ResposibilityContext)
    const {srceiTicket, setSrceiTicket} = useContext(ResposibilityContext);
    const {ticketExport} = useContext(TicketContext);

    const handleChange = (e) => {
        const {name,value,type,checked} = e.target;
        setSrceiFormData({
            ...srceiFormData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const ticket = parseSrceiTicket(srceiFormData);
        setSrceiTicket(ticket);
    }

    return (
        <div className="col-md-12">
            <div className="card">
                <div className="card-header text-bg-dark d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">TICKET DE RESPONSABILIDAD</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <form id="formularioResponsabilidad" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="nombreTicket" className="form-label">Ticket</label>
                                    <input type="text" className="form-control form-control-sm" id="nombreTicket"
                                           name="nombreTicket"
                                           value={srceiFormData.nombreTicket} onChange={handleChange}
                                           placeholder="Ej.: INC000015237270" required/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="servicio" className="form-label">Servicio</label>
                                    <select className="form-select form-select-sm" id="servicio" name="servicio"
                                            value={srceiFormData.servicio} onChange={handleChange} required>
                                        <option value="Impresoras">Impresoras</option>
                                        <option value="Pagos (Transbank)">Pagos (Transbank)</option>
                                        <option value="Redes de comunicación- Internet">Redes de comunicación- Internet</option>
                                        <option value="Redes de suministro eléctrico">Redes de suministro eléctrico</option>
                                        <option value="Licencias de Ofimática (Office 365)">Licencias de Ofimática (Office 365)
                                        </option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="sintoma" className="form-label">Síntoma</label>
                                    <input type="text" className="form-control form-control-sm" id="sintoma" name="sintoma"
                                           value={srceiFormData.sintoma} onChange={handleChange}
                                           placeholder="Ej.: Módulo de captura se demroa 15 minutos en iniciar" required/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="diagnostico" className="form-label">Diagnóstico</label>
                                    <input type="text" className="form-control form-control-sm" id="diagnostico" name="diagnostico"
                                           value={srceiFormData.diagnostico} onChange={handleChange}
                                           placeholder="Ej.: Demora se debe a problemas de red en la oficina"
                                           required/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="otros" className="form-label">Otros</label>
                                    <input type="text" className="form-control form-control-sm" id="otros" name="otros"
                                           value={srceiFormData.otros} onChange={handleChange}
                                           placeholder="Ej.: Se colocaron imagenes de respaldo en ticket"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="region" className="form-label">Región</label>
                                    <input type="text" className="form-control form-control-sm" id="region" name="region"
                                           value={srceiFormData.region} onChange={handleChange}
                                           placeholder="Ej.: BIO BIO" required/>
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="taxonomia" className="form-label">Taxonomía</label>
                                    <input type="text" className="form-control form-control-sm" id="taxonomia" name="taxonomia"
                                           value={srceiFormData.taxonomia} onChange={handleChange}
                                           placeholder="Ej.: REVISAR" required/>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-dark">Generar asunto y cuerpo</button>
                        </form>
                    </div>
                    <div className="row">
                        <div className="col-md-12 mt-3">
                            <TicketBody title="Correo Responsabilidad" text={srceiTicket} setter={setSrceiTicket} rows={18} bootstrapColor="text-bg-dark"  />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SrceiForm;