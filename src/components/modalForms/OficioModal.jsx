import {useContext} from 'react';
import {TicketContext} from "../../context/TicketProvider.jsx";
import {formTransform} from "../../utilities/FormTransform.js";
import {StringBuilder} from "../../utilities/StringBuilder.js";
import PropTypes from "prop-types";

const OficioModal = (props) => {

    const {oficioForm, setOficioForm} = useContext(TicketContext);
    const {setOficio} = useContext(TicketContext);
    const {ticket, setTicket} = useContext(TicketContext);

    const handleChange = (e) => {
        const {name,value,type,checked} = e.target;
        setOficioForm({
            ...oficioForm,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const numeroOficio = "N° DE OFICIO: " + formTransform(oficioForm.numeroOficio);
        const sb = new StringBuilder(numeroOficio);
        sb.appendLine("TIPO DE OFICIO: " + formTransform(oficioForm.tipoOficio));
        sb.appendLine("AÑO OFICIO: " + formTransform(oficioForm.anioOficio));
        sb.appendLine("COD. OFICINA ORIGEN: " + formTransform(oficioForm.codigoOficina));
        sb.appendLine("RUN: " + formTransform(oficioForm.run));
        sb.appendLine("");

        const sb2 = new StringBuilder(ticket);

        const ofi = sb.toString();
        console.log("oficina" + ofi)
        setOficio(ofi);
        sb2.appendLine(ofi);
        setTicket(sb2.toString());

        props.cerrarModal();
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="modal-body">
                    <div className="mb-3">
                        <label htmlFor="numeroOficio" className="form-label">N° DE OFICIO</label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            id="numeroOficio"
                            name="numeroOficio"
                            value={oficioForm.numeroOficio}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tipoOficio" className="form-label">TIPO DE OFICIO</label>
                        <select
                            className="form-select form-select-sm"
                            id="tipoOficio"
                            name="tipoOficio"
                            value={oficioForm.tipoOficio}
                            onChange={handleChange}
                        >
                            <option value="CÉDULA">CÉDULA</option>
                            <option value="PASAPORTE">PASAPORTE</option>
                            <option value="CÉDULA Y PASAPORTE">MIXTO</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="anioOficio" className="form-label">AÑO OFICIO</label>
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            id="anioOficio"
                            name="anioOficio"
                            value={oficioForm.anioOficio}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="codigoOficina" className="form-label">COD. OFICINA ORIGEN</label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            id="codigoOficina"
                            name="codigoOficina"
                            value={oficioForm.codigoOficina}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="run" className="form-label">
                            RUN <span className="text-muted">(Cualquiera que esté en el oficio)</span>
                        </label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            id="run"
                            name="run"
                            value={oficioForm.run}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                        Agregar oficio
                    </button>
                </div>
            </form>
        </>
    );
};

OficioModal.propTypes = {
    cerrarModal: PropTypes.func.isRequired
};

export default OficioModal;