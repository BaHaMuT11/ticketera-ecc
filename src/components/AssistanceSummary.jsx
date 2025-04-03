import {useContext} from "react";
import {UserContext} from "../context/UserProvider.jsx";


const AssistanceSummary = () => {

    const {llamadoActivo} = useContext(UserContext);

    return (
        <div className="col-md-12">
            <div className="card">
                <div className="card-header text-bg-info d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Resumen de atenciones</h5>
                </div>
                <div className="card-body">
                    <h6> {llamadoActivo.oficina}</h6>
                    {
                        llamadoActivo.atenciones.map(atencion => (
                            <>
                                <p> <b>Ticket: </b>{atencion.ticket}</p>
                                <p> <b>Funcionario: </b>{atencion.funcionario}</p>
                                <p> <b>Resolución: </b>{atencion.resolucion}</p>
                                <p> <b>Responsabilidad: </b>{atencion.responsabilidad}</p>
                                <p> <b>Fecha: </b>{atencion.fecha}</p>
                                <br />
                            </>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default AssistanceSummary;