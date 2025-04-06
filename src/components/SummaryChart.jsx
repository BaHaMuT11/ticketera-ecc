import {useContext, useEffect} from "react";
import {UserContext} from "../context/UserProvider.jsx";
import {useNavigate} from "react-router";
import * as XLSX from "xlsx";

const SummaryChart = () => {

    const {llamados, setLlamados} = useContext(UserContext);
    const {setLlamadoActivo} = useContext(UserContext);

    const navigate = useNavigate();

    const handleNuevaAtencion = () => {
        navigate("/baha-ticket");
    };

    const handleNuevoLlamado = () => {
        setLlamadoActivo(() => ({
            id: llamados.length + 1,
            oficina: "",
            atenciones: []
        }));

        navigate("/baha-ticket");
    };




    const handleCerrarDia = () => {

        const dataForExcel = llamados.flatMap((llamado) =>
            llamado.atenciones.map((atencion) => ({
                ID_Llamado: llamado.id,
                ID_Atención: atencion.id,
                Oficina: llamado.oficina,
                Ticket: atencion.ticket,
                Funcionario: atencion.funcionario,
                Resolución: atencion.resolucion,
                Responsabilidad: atencion.responsabilidad,
                Fecha: atencion.fecha
            }))
        );


        const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Resumen");


        XLSX.writeFile(workbook, `reporte_llamados_${new Date().toLocaleDateString("es-CL")}.xlsx`);


        setLlamados([]);
        setLlamadoActivo({
            id: 0,
            oficina: "",
            atenciones: []
        });

        navigate("/");
    };

    useEffect(() => {
        console.log(llamados);
    },[])

    return (
        <div className="row">
            <div className="col-md-12 mb-2">
                <table className="table table-responsive-md table-info table-hover">
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
            <div className="col-md-12 mb-2 d-flex justify-content-around">
                <button type="submit"
                        className="btn btn-info btn-lg text-light w-100"
                        onClick={handleNuevaAtencion}>Nueva atención</button> &nbsp; &nbsp;
                <button type="submit"
                        className="btn btn-info btn-lg text-light w-100"
                        onClick={handleNuevoLlamado}>Nuevo llamado</button> &nbsp; &nbsp;
                <button type="submit"
                        className="btn btn-danger btn-lg text-light w-100"
                        onClick={handleCerrarDia}>Cerrar día</button>
            </div>
        </div>
    );
};

export default SummaryChart;