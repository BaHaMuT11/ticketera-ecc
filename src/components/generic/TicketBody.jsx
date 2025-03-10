import {useContext} from "react";
import {TicketContext} from "../../context/TicketProvider.jsx";

const TicketBody = () => {

    const {ticket} = useContext(TicketContext);

    return (
        <div className="card">
            <div className="card-header text-bg-primary d-flex justify-content-between align-items-center">
                <h5 className="mb-0">CUADRO RESUMEN</h5>
                <button className="btn btn-outline-light btn-sm">Copiar!</button>
            </div>
            <div className="card-body">
                <textarea className="form-control" rows="4" value={ticket} />
            </div>
        </div>
    );
};

export default TicketBody;