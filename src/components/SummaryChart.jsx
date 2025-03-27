

const SummaryChart = () => {
    return (
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
                    <td>01/01/2025</td>
                </tr>
                <tr>
                    <th scope="row">1</th>
                    <th scope="row">2</th>
                    <td>SRCEI QUILPUÉ</td>
                    <td>INC000015315950</td>
                    <td>KIMBERLY ZAPATA</td>
                    <td>N2</td>
                    <td>01/01/2025</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <th scope="row">1</th>
                    <td>SRCEI SAN BERNARDO</td>
                    <td>INC000015315951</td>
                    <td>JAIME PADILLA</td>
                    <td>N3</td>
                    <td>01/01/2025</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SummaryChart;