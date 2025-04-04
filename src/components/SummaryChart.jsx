import {useContext, useEffect} from "react";
import {UserContext} from "../context/UserProvider.jsx";

const SummaryChart = () => {

    const {llamados} = useContext(UserContext);

    useEffect(() => {
        console.log(llamados);
    },[])

    return (
        <div className="row">
            <div className="col-md-12">
                <table className="table table-info table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Llamada</th>
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
                        {
                            llamados.map( (llamado) => (
                                llamado.atenciones.map((atencion) => (
                                    <tr key={`${llamado.id}-${atencion.id}`}>
                                        <th scope="row">{llamado.id}</th>
                                        <th scope="row">{atencion.id}</th>
                                        <td>{llamado.oficina}</td>
                                        <td>{atencion.ticket}</td>
                                        <td>{atencion.funcionario}</td>
                                        <td>{atencion.resolucion}</td>
                                        <td>{atencion.responsabilidad}</td>
                                        <td>01/01/2025</td>
                                    </tr>
                                ))
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SummaryChart;