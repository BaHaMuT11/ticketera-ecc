import { useContext, useState} from "react";
import {TicketContext} from "../context/TicketProvider.jsx";

const ReportForm = () => {

    const {ticketExport} = useContext(TicketContext);
    const [reporte, setReporte] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        ticketExport.responsabilidad === "NO" &&
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
                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn btn-success">Continuar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
    );
};

export default ReportForm;