import {useContext} from "react";
import {UserContext} from "../context/UserProvider.jsx";
import {useNavigate} from "react-router";
import {TicketContext} from "../context/TicketProvider.jsx";
import {ResposibilityContext} from "../context/ResponsibilityProvider.jsx";

const SummaryChart = () => {

    const {llamados, setLlamados} = useContext(UserContext);
    const {setLlamadoActivo} = useContext(UserContext);
    const {setEsLlamadoNuevo} = useContext(UserContext);
    const {setIdLLamadoActiva} = useContext(UserContext);

    const {ticketFormData, setTicketFormData} = useContext(TicketContext);
    const {setReporte} = useContext(TicketContext);
    const {setTicket} = useContext(TicketContext);

    const {setSrceiTicket} = useContext(ResposibilityContext);
    const {srceiFormData, setSrceiFormData} = useContext(ResposibilityContext)

    const navigate = useNavigate();

    const limpiarDatos = (accion) => {
        if (accion === "limpiarAtencion") {
            setEsLlamadoNuevo(false);
            setTicketFormData({
                ...ticketFormData,
                problema: "",
                pruebasMesa: "",
                grupoResolutor: "n1",
                responsabilidad: "NO"
            });
            setTicket("");
            setSrceiTicket("");
            setSrceiFormData({
                ...srceiFormData,
                nombreTicket: "",
                servicio: "Impresoras",
                sintoma: "",
                diagnostico: "",
                otros: "",
                region: "",
                taxonomia: ""
            });
            setReporte("");
        }
        if (accion === "limpiarLlamado") {
            setTicket("");
            setSrceiTicket("");
            setEsLlamadoNuevo(true);
            setTicketFormData({
                ...ticketFormData,
                nombre: "",
                tipoOficina: "OFICINA",
                oficina: "",
                problema: "",
                celular: "",
                correoElectronico: "",
                tipoCorreo: "SI",
                ip: "164.96.",
                cuentaUsuario: "",
                maquina: "",
                tipoMaquina: "ETF",
                responsabilidad: "NO",
                pruebasMesa: "",
                direccion: "",
                grupoResolutor: "n1",
                horario: ""
            });
            setSrceiFormData({
                ...srceiFormData,
                nombreTicket: "",
                servicio: "Impresoras",
                sintoma: "",
                diagnostico: "",
                otros: "",
                region: "",
                taxonomia: ""
            });
            setLlamadoActivo(() => ({
                oficina: "",
                atenciones: []
            }));
            setReporte("");
        }
        if (accion === "cerrarDia") {
            setTicket("");
            setSrceiTicket("");
            setTicketFormData({
                ...ticketFormData,
                nombre: "",
                tipoOficina: "OFICINA",
                oficina: "",
                whatsapp: "",
                problema: "",
                celular: "",
                correoElectronico: "",
                tipoCorreo: "SI",
                fonoFijo: "",
                ip: "164.96.",
                cuentaUsuario: "",
                maquina: "",
                tipoMaquina: "ETF",
                responsabilidad: "NO",
                pruebasMesa: "",
                direccion: "",
                grupoResolutor: "n1",
                horario: ""
            });
            setSrceiFormData({
                ...srceiFormData,
                nombreTicket: "",
                servicio: "Impresoras",
                sintoma: "",
                diagnostico: "",
                otros: "",
                region: "",
                taxonomia: ""
            });
            setReporte("");
            setLlamados([]);
            setLlamadoActivo({
                id: 0,
                oficina: "",
                atenciones: []
            });
            setIdLLamadoActiva(-1)
            setEsLlamadoNuevo(true)
        }
    }

    const handleNuevaAtencion = () => {
        limpiarDatos("limpiarAtencion")
        navigate("/baha-ticket");
    };

    const handleNuevoLlamado = () => {
        limpiarDatos("limpiarLlamado");
        navigate("/baha-ticket");
    };

    const handleCerrarDia = () => {
        /*
        const nuevosLlamados = [...llamados, llamadoActivo];


        setEsLlamadoNuevo(true);
        setLlamados(nuevosLlamados);
        setLlamadoActivo({ id: 0, oficina: "", atenciones: [] });


        exportarLlamadosAExcel(nuevosLlamados);
        */
        limpiarDatos("cerrarDia");
        navigate("/");
    };

    /*
    const exportarLlamadosAExcel = (llamadosAExportar) => {
        const dataForExcel = llamadosAExportar.flatMap((llamado) =>
            llamado.atenciones.map((atencion) => ({
                "ID de Llamado": llamado.id,
                "ID de Atención": atencion.id,
                "Oficina": llamado.oficina,
                "Ticket": atencion.ticket,
                "Funcionario": atencion.funcionario,
                "Resolución": atencion.resolucion,
                "Responsabilidad": atencion.responsabilidad,
                "Fecha": atencion.fecha
            }))
        );

        if (dataForExcel.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

            worksheet["A1"] = { t: "s", v: "Llamadas de " + userName.nombre2 };
            worksheet["A1"].s = {
                alignment: { horizontal: "center", vertical: "center" },
                font: { bold: true, sz: 14 }
            };
            worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }];

            const headers = [
                "ID de Llamado",
                "ID de Atención",
                "Oficina",
                "Ticket",
                "Funcionario",
                "Resolución",
                "Responsabilidad",
                "Fecha"
            ];

            headers.forEach((header, index) => {
                worksheet[XLSX.utils.encode_cell({ r: 1, c: index })] = { t: "s", v: header };
            });

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Resumen");

            XLSX.writeFile(workbook, `reporte_llamados_${new Date().toLocaleDateString("es-CL")}.xlsx`);
        } else {
            console.log("No hay datos para exportar");
        }
    };
    */

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
                                        <td>{atencion.resolucion === "n1" || atencion.resolucion === ""  || atencion.resolucion === "N1" ? "RESUELTO" : atencion.resolucion}</td>
                                        <td>{atencion.responsabilidad}</td>
                                        <td>{atencion.fecha}</td>
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
                        onClick={handleNuevaAtencion}>Nueva atención</button> &nbsp; &nbsp; &nbsp;
                <button type="submit"
                        className="btn btn-info btn-lg text-light w-100"
                        onClick={handleNuevoLlamado}>Nuevo llamado</button> &nbsp; &nbsp; &nbsp;
                <button type="submit"
                        className="btn btn-danger btn-lg text-light w-100"
                        onClick={handleCerrarDia}>Cerrar día</button>
            </div>
        </div>
    );
};

export default SummaryChart;