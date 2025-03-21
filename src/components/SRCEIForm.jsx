import {useContext} from "react";
import {ResposibilityContext} from "../context/ResponsibilityProvider.jsx";

const SrceiForm = () => {

    const {srceiFormData, setSrceiFormData} = useContext(ResposibilityContext)

    const handleChange = (e) => {
        const {name,value,type,checked} = e.target;
        setSrceiFormData({
            ...srceiFormData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className="col-md-12">
            <div className="card">
                <div className="card-header text-bg-dark d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">TICKET DE RESPONSABILIDAD</h5>
                </div>
                <div className="card-body">
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
            </div>
        </div>
    );
};

export default SrceiForm;