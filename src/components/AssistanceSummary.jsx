import React, {useContext} from "react";
import {UserContext} from "../context/UserProvider.jsx";
import {useNavigate} from "react-router";


const AssistanceSummary = () => {

    const {llamadoActivo} = useContext(UserContext);
    const {llamados, setLlamados} = useContext(UserContext);
    const {esLlamadoNuevo} = useContext(UserContext);
    const {idLLamadoActiva, setIdLLamadoActiva} = useContext(UserContext);

    const navigate = useNavigate();

    const handleEnding = () => {
        if (esLlamadoNuevo){
            setIdLLamadoActiva(llamadoActivo.id);
            setLlamados([...llamados, llamadoActivo]);
        } else {
            let respaldo = llamados.map(llamado => ({ ...llamado }));
            respaldo = respaldo.map(llamado =>
                llamado.id === idLLamadoActiva ? llamadoActivo : llamado
            );
            setLlamados(respaldo);
        }
        navigate("/baha-summary");
    }

    return (
            <>
                <div className="col-md-12 mb-2">
                    <div className="card">
                        <div className="card-header text-bg-dark d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Resumen de atenciones</h5>
                        </div>
                        <div className="card-body">
                            <h6> {llamadoActivo.oficina}</h6>
                            {
                                llamadoActivo.atenciones.map(atencion => (
                                    <React.Fragment key={atencion.id}>
                                        <p> <b>Ticket: </b>{atencion.ticket}</p>
                                        <p> <b>Funcionario: </b>{atencion.funcionario}</p>
                                        <p> <b>Resolución: </b>{atencion.resolucion}</p>
                                        <p> <b>Responsabilidad: </b>{atencion.responsabilidad}</p>
                                        <p> <b>Fecha: </b>{atencion.fecha}</p>
                                        <br />
                                    </React.Fragment>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="col-md-12 mb-2">
                    <button type="submit"
                            className="btn btn-dark btn-lg text-light w-100"
                            onClick={handleEnding}>
                        Continuar
                    </button>
                </div>
            </>
    );
};

export default AssistanceSummary;