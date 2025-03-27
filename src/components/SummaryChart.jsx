import {useContext, useState} from "react";
import {UserContext} from "../context/UserProvider.jsx";


const SummaryChart = () => {

    const {atencionActiva, setAtencionActiva} = useContext(UserContext);
    const {llamadoActivo, setLlamadoActivo} = useContext(UserContext);

    const [reporte, setReporte] = useState("");

    const handleSubmit = () => {
        setAtencionActiva(
            {atencionActiva, ticket: reporte}
        );
        setLlamadoActivo(
            {
                id: llamadoActivo.id+1,
                oficina: "",
                atenciones: [...llamadoActivo.atenciones, atencionActiva]
            }
        );
    }

    return (
        <div className="row">
            <div className="col-md-12 pb-3">
                <div className="card">
                    <div className="card-header text-bg-primary d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Reporte</h5>
                    </div>
                    <div className="card-body">
                        <form id="formUser" onSubmit={handleSubmit}>
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
            </div>
            <div className="col-md-12">
                <table className="table table-info table-hover">
                    <thead>
                    <tr>
                        <th scope="col">LLamada</th>
                        <th scope="col">Atención</th>
                        <th scope="col">Oficina</th>
                        <th scope="col">Ticket</th>
                        <th scope="col">Funcionario</th>
                        <th scope="col">Resolución</th>
                        <th scope="col">Responsabilidad</th>
                        <th scope="col">Fecha</th>
                    </tr>
                    </thead>
                    <tbody className="table-group-divider">
                    <tr>
                        <th scope="row">1</th>
                        <th scope="row">1</th>
                        <td>SRCEI QUILPUÉ</td>
                        <td>INC000015315949</td>
                        <td>KIMBERLY ZAPATA</td>
                        <td>RESUELTO</td>
                        <td>NO</td>
                        <td>01/01/2025</td>
                    </tr>
                    <tr>
                        <th scope="row">1</th>
                        <th scope="row">2</th>
                        <td>SRCEI QUILPUÉ</td>
                        <td>INC000015315950</td>
                        <td>KIMBERLY ZAPATA</td>
                        <td>N2</td>
                        <td>NO</td>
                        <td>01/01/2025</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <th scope="row">1</th>
                        <td>SRCEI SAN BERNARDO</td>
                        <td>INC000015315951</td>
                        <td>JAIME PADILLA</td>
                        <td>N3</td>
                        <td>SI</td>
                        <td>01/01/2025</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SummaryChart;