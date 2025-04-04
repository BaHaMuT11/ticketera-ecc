import {useContext} from "react";
import PropTypes from "prop-types";
import {TicketContext} from "../context/TicketProvider.jsx";

const ReportForm = (props) => {

    const {reporte, setReporte} = useContext(TicketContext);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        props.responsabilidad === "NO" &&
            <div className="card">
                <div className="card-header text-bg-info d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Reporte</h5>
                </div>
                <div className="card-body">
                    <form id="formReport" onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <label htmlFor="report" className="form-label">Reporte</label>
                                <input type="text" className="form-control form-control-sm" id="report" name="report"
                                       value={reporte}
                                       onChange={e => setReporte(e.target.value)} required />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
    );
};

ReportForm.propTypes = {
    responsabilidad: PropTypes.string.isRequired,
}

export default ReportForm;